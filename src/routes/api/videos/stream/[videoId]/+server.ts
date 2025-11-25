import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { getSignedVideoUrl } from '$lib/server/videos/urls';
import { RolesEnum, VideoStatusEnum } from '$lib/types/enums';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { videoId } = params;

	if (!videoId) {
		throw error(400, 'Липсва идентификатор на видео.');
	}

	const video = await db.query.videos.findFirst({
		where: (video, { eq }) => eq(video.id, videoId),
		columns: {
			bucket: true,
			objectKey: true,
			status: true
		}
	});

	if (!video) {
		throw error(404, 'Видеото не е намерено.');
	}

	const isAdmin = locals.user?.role === RolesEnum.admin;

	if (video.status !== VideoStatusEnum.published && !isAdmin) {
		throw error(403, 'Нямате достъп до това видео.');
	}

	const signedUrl = await getSignedVideoUrl(video.bucket, video.objectKey);

	return new Response(null, {
		status: 307,
		headers: {
			Location: signedUrl,
			'Cache-Control': 'no-store',
			Pragma: 'no-cache'
		}
	});
};
