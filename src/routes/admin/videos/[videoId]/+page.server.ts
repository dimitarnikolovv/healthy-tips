import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { adminVideoUpdateSchema } from './schema';
import { DEFAULT_SEO_TITLE } from '$lib/utils/constants';
import { updateVideoMetadata } from '$lib/server/videos/upload';

export const load: PageServerLoad = async ({ params }) => {
	const { videoId } = params;

	const video = await db.query.videos.findFirst({
		where: (video, { eq }) => eq(video.id, videoId)
	});

	if (!video) {
		throw error(404, 'Видеото не е намерено.');
	}

	const editForm = await superValidate(zod4(adminVideoUpdateSchema));

	return {
		video,
		editForm,
		title: `Редакция на ${video.title} | ${DEFAULT_SEO_TITLE}`
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const { videoId } = params;
		const form = await superValidate(request, zod4(adminVideoUpdateSchema));

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Попълнете валидни данни.'
			});
		}

		try {
			await updateVideoMetadata(videoId, {
				title: form.data.title,
				description: form.data.description,
				status: form.data.status
			});

			return {
				form,
				message: 'Промените са запазени успешно.'
			};
		} catch (err) {
			console.error('Failed to update video', err);
			return fail(500, {
				form,
				message: 'Запазването се провали. Опитайте отново.'
			});
		}
	}
};
