import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema/videos';
import { deleteVideoAsset } from '$lib/server/videos/upload';
import { fail } from '@sveltejs/kit';
import { DEFAULT_SEO_TITLE } from '$lib/utils/constants';

export const load: PageServerLoad = async ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') ?? '12');
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));

	const videoList = await db.query.videos.findMany({
		orderBy: (video, { desc }) => desc(video.createdAt),
		limit,
		offset: (page - 1) * limit,
		columns: {
			id: true,
			title: true,
			status: true,
			fileSize: true,
			createdAt: true,
			publishedAt: true
		},
		with: {
			uploader: {
				columns: {
					firstName: true,
					lastName: true
				}
			}
		}
	});

	const totalItems = await db.$count(videos);
	const totalPages = Math.ceil(totalItems / limit);

	return {
		videos: videoList,

		page,
		limit,
		totalItems,
		totalPages,

		title: `Всички видеа | ${DEFAULT_SEO_TITLE}`
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const videoId = formData.get('videoId');

		if (typeof videoId !== 'string' || videoId.length === 0) {
			return fail(400, {
				message: 'Невалидно видео.'
			});
		}

		try {
			await deleteVideoAsset(videoId);

			return {
				success: true,
				message: 'Видеото беше изтрито.'
			};
		} catch (error) {
			console.error('Failed to delete video', error);
			return fail(500, {
				message: 'Изтриването се провали. Опитайте отново.'
			});
		}
	}
};
