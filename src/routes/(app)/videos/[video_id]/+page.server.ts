import { db } from '@/server/db';
import type { PageServerLoad } from './$types';
import { and, eq } from 'drizzle-orm';
import { videos } from '@/server/db/schema/videos';
import { VideoStatusEnum } from '@/types/enums';
import { error, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { addCommentSchema, deleteCommentSchema, editCommentSchema } from './schema';
import { comments } from '@/server/db/schema/comments';
import { generateId } from '@/utils/general';

export const load: PageServerLoad = async ({ params, url }) => {
	const limit = parseInt(url.searchParams.get('limit') ?? '20');
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));

	const video = await db.query.videos.findFirst({
		where: and(eq(videos.id, params.video_id), eq(videos.status, VideoStatusEnum.published))
	});

	if (!video) return error(404, 'Video not found');

	const commentList = await db.query.comments.findMany({
		where: eq(comments.videoId, video.id),
		with: {
			user: {
				columns: {
					id: true,
					firstName: true,
					lastName: true,
					role: true
				}
			}
		},
		limit,
		offset: (page - 1) * limit,
		orderBy: (comment, { desc }) => desc(comment.createdAt)
	});

	const addCommentForm = await superValidate(zod4(addCommentSchema));

	const editCommentForm = await superValidate(zod4(editCommentSchema));

	const deleteCommentForm = await superValidate(zod4(deleteCommentSchema));

	return {
		video,
		comments: commentList,
		addCommentForm,
		editCommentForm,
		deleteCommentForm
	};
};

export const actions: Actions = {
	addComment: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod4(addCommentSchema));

		if (!locals.user) {
			return fail(401, { form, message: 'Трябва да влезете в профила си, за да коментирате.' });
		}

		if (params.video_id === undefined) {
			return fail(400, { form, message: 'Невалиден видео идентификатор.' });
		}

		if (!form.valid) {
			return fail(400, { form, message: 'Моля, коригирайте грешките в формуляра.' });
		}

		try {
			await db.insert(comments).values({
				id: generateId(),
				videoId: params.video_id,
				userId: locals.user.id,
				content: form.data.content
			});

			return { form, message: 'Коментарът е добавен успешно.' };
		} catch (err) {
			console.log(err);

			return fail(500, {
				form,
				message: 'Възникна грешка при добавянето на коментара. Моля, опитайте отново.'
			});
		}
	},
	editComment: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod4(editCommentSchema));

		if (!locals.user) {
			return fail(401, { form, message: 'Трябва да влезете в профила си, за да редактирате коментар.' });
		}

		if (params.video_id === undefined) {
			return fail(400, { form, message: 'Невалиден видео идентификатор.' });
		}

		if (!form.valid) {
			return fail(400, { form, message: 'Моля, коригирайте грешките във формуляра.' });
		}

		const existingComment = await db.query.comments.findFirst({
			where: and(eq(comments.id, form.data.id), eq(comments.videoId, params.video_id))
		});

		if (!existingComment) {
			return fail(404, { form, message: 'Коментарът не беше намерен.' });
		}

		if (existingComment.userId !== locals.user.id) {
			return fail(403, { form, message: 'Нямате права да редактирате този коментар.' });
		}

		try {
			await db.update(comments).set({ content: form.data.content }).where(eq(comments.id, form.data.id));

			return { form, message: 'Коментарът е редактиран успешно.' };
		} catch (err) {
			console.log(err);

			return fail(500, {
				form,
				message: 'Възникна грешка при редактирането на коментара. Моля, опитайте отново.'
			});
		}
	},
	deleteComment: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod4(deleteCommentSchema));

		if (!locals.user) {
			return fail(401, { form, message: 'Трябва да влезете в профила си, за да изтриете коментар.' });
		}

		if (params.video_id === undefined) {
			return fail(400, { form, message: 'Невалиден видео идентификатор.' });
		}

		if (!form.valid) {
			return fail(400, { form, message: 'Моля, коригирайте грешките във формуляра.' });
		}

		const existingComment = await db.query.comments.findFirst({
			where: and(eq(comments.id, form.data.id), eq(comments.videoId, params.video_id))
		});

		if (!existingComment) {
			return fail(404, { form, message: 'Коментарът не беше намерен.' });
		}

		if (existingComment.userId !== locals.user.id) {
			return fail(403, { form, message: 'Нямате права да изтриете този коментар.' });
		}

		try {
			await db.delete(comments).where(eq(comments.id, form.data.id));

			return { form, message: 'Коментарът е изтрит успешно.' };
		} catch (err) {
			console.log(err);

			return fail(500, {
				form,
				message: 'Възникна грешка при изтриването на коментара. Моля, опитайте отново.'
			});
		}
	}
};
