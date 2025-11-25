import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, VIDEO_BUCKET } from '../storage/s3';
import { db } from '../db';
import { videos, type Video } from '../db/schema/videos';
import { generateId, slugify } from '$lib/utils/general';
import { VideoStatusEnum } from '$lib/types/enums';
import { eq } from 'drizzle-orm';

type UploadVideoInput = {
	title: string;
	description?: string | null;
	file: File;
	uploaderId: string;
	status?: VideoStatusEnum;
};

export async function uploadVideoAsset({
	title,
	description,
	file,
	uploaderId,
	status = VideoStatusEnum.published
}: UploadVideoInput): Promise<Video> {
	if (!file || file.size === 0) {
		throw new Error('Видео файлът е задължителен.');
	}

	const fileBuffer = new Uint8Array(await file.arrayBuffer());
	const mimeType = file.type || 'application/octet-stream';
	const originalFilename = file.name || 'video-upload';
	const videoId = generateId();
	const baseSlug = slugify(title) || `video-${videoId}`;
	const objectKey = buildObjectKey(baseSlug, originalFilename);
	const shouldPublish = status === VideoStatusEnum.published;

	return await db.transaction(async (tx) => {
		const uniqueSlug = await ensureUniqueSlug(tx, baseSlug);

		await s3Client.send(
			new PutObjectCommand({
				Bucket: VIDEO_BUCKET,
				Key: objectKey,
				Body: fileBuffer,
				ContentType: mimeType,
				Metadata: {
					title: title,
					slug: uniqueSlug
				}
			})
		);

		try {
			const [createdVideo] = await tx
				.insert(videos)
				.values({
					id: videoId,
					title: title.trim(),
					slug: uniqueSlug,
					description: description?.trim() || null,
					status,
					bucket: VIDEO_BUCKET,
					objectKey,
					originalFilename,
					mimeType,
					fileSize: file.size,
					uploadedByUserId: uploaderId,
					publishedAt: shouldPublish ? new Date() : null
				})
				.returning();

			return createdVideo;
		} catch (error) {
			await cleanupObject(objectKey);
			throw error;
		}
	});
}

async function ensureUniqueSlug(
	tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
	baseSlug: string
) {
	let slugCandidate = baseSlug;
	let attempt = 1;

	// Limit attempts to avoid infinite loops.
	while (attempt < 50) {
		const existing = await tx.query.videos.findFirst({
			where: (video, { eq }) => eq(video.slug, slugCandidate)
		});

		if (!existing) {
			return slugCandidate;
		}

		slugCandidate = `${baseSlug}-${attempt}`;
		attempt += 1;
	}

	throw new Error('Неуспешно генериране на уникален адрес за видеото.');
}

async function cleanupObject(objectKey: string) {
	try {
		await s3Client.send(
			new DeleteObjectCommand({
				Bucket: VIDEO_BUCKET,
				Key: objectKey
			})
		);
	} catch (cleanupError) {
		console.error('Failed to clean up S3 object', cleanupError);
	}
}

function buildObjectKey(slug: string, filename: string) {
	const extension = extractExtension(filename) ?? 'mp4';
	const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '-');
	return `videos/${safeSlug}-${Date.now()}.${extension}`;
}

function extractExtension(filename: string) {
	const parts = filename.split('.');
	if (parts.length <= 1) return null;
	return parts.pop()?.toLowerCase() ?? null;
}

type UpdateVideoInput = {
	title: string;
	description?: string | null;
	status: VideoStatusEnum;
};

export async function updateVideoMetadata(videoId: string, payload: UpdateVideoInput) {
	const existingVideo = await db.query.videos.findFirst({
		where: (video, { eq }) => eq(video.id, videoId)
	});

	if (!existingVideo) {
		throw new Error('Видео не е намерено.');
	}

	let publishedAt: Date | null = existingVideo.publishedAt;

	if (payload.status === VideoStatusEnum.published) {
		publishedAt = existingVideo.publishedAt ?? new Date();
	} else {
		publishedAt = null;
	}

	const [updatedVideo] = await db
		.update(videos)
		.set({
			title: payload.title.trim(),
			description: payload.description?.trim() || null,
			status: payload.status,
			publishedAt
		})
		.where(eq(videos.id, videoId))
		.returning();

	return updatedVideo;
}

export async function deleteVideoAsset(videoId: string) {
	const existingVideo = await db.query.videos.findFirst({
		where: (video, { eq }) => eq(video.id, videoId)
	});

	if (!existingVideo) {
		throw new Error('Видео не е намерено.');
	}

	await db.transaction(async (tx) => {
		await s3Client.send(
			new DeleteObjectCommand({
				Bucket: existingVideo.bucket,
				Key: existingVideo.objectKey
			})
		);

		await tx.delete(videos).where(eq(videos.id, videoId));
	});

	return existingVideo;
}
