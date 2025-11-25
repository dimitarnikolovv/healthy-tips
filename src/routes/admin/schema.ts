import { VideoStatusEnum } from '@/types/enums';
import { z } from 'zod';

export const MAX_VIDEO_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

export const ACCEPTED_VIDEO_MIME_TYPES = [
	'video/mp4',
	'video/webm',
	'video/ogg',
	'video/quicktime',
	'video/x-matroska'
] as const;

export const adminVideoUploadSchema = z
	.object({
		title: z
			.string({ message: 'Полето е задължително.' })
			.min(3, { message: 'Заглавието трябва да бъде поне 3 символа.' })
			.max(180, { message: 'Заглавието не може да надвишава 180 символа.' })
			.trim(),
		description: z
			.string()
			.max(2_000, {
				message: 'Описанието не може да бъде по-дълго от 2000 символа.'
			})
			.trim()
			.optional(),
		videoFile: z.file(),
		status: z
			.enum(VideoStatusEnum, {
				message: 'Невалиден статус.'
			})
			.default(VideoStatusEnum.draft)
	})
	.check(({ value, issues }) => {
		const { videoFile } = value;
		if (videoFile) {
			if (videoFile.size > MAX_VIDEO_FILE_SIZE_BYTES) {
				issues.push({
					code: 'custom',
					message: 'Файлът не трябва да е по-голям от 500MB',
					input: videoFile
				});
			}

			// Check if the file is a video file
			if (
				!ACCEPTED_VIDEO_MIME_TYPES.includes(
					videoFile.type as (typeof ACCEPTED_VIDEO_MIME_TYPES)[number]
				)
			) {
				issues.push({
					code: 'custom',
					message: 'Файлът не е видео файл',
					input: videoFile
				});
			}
		}
	});

export type AdminVideoUploadSchema = z.infer<typeof adminVideoUploadSchema>;
