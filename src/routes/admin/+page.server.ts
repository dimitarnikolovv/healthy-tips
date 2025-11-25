import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { adminVideoUploadSchema } from './schema';
import { DEFAULT_SEO_TITLE } from '$lib/utils/constants';
import { uploadVideoAsset } from '$lib/server/videos/upload';

const seoTitle = `Админ панел | ${DEFAULT_SEO_TITLE}`;

export const load: PageServerLoad = async () => {
	const uploadForm = await superValidate(zod4(adminVideoUploadSchema));
	return {
		uploadForm,
		title: seoTitle
	};
};

export const actions: Actions = {
	upload: async (event) => {
		const form = await superValidate(event.request, zod4(adminVideoUploadSchema));

		if (!form.valid) {
			return fail(400, {
				form: withFiles(form),
				message: 'Попълнете всички задължителни полета.'
			});
		}

		if (!event.locals.user) {
			return fail(401, {
				form: withFiles(form),
				message: 'Нямате права за тази операция.'
			});
		}

		try {
			const video = await uploadVideoAsset({
				title: form.data.title,
				description: form.data.description || null,
				file: form.data.videoFile,
				uploaderId: event.locals.user.id,
				status: form.data.status
			});

			return {
				form: withFiles(form),
				message: `Видеото „${video.title}“ беше качено успешно.`
			};
		} catch (error) {
			console.error('Video upload failed', error);
			return fail(500, {
				form: withFiles(form),
				message: 'Качването на видеото се провали. Опитайте отново.'
			});
		}
	}
};
