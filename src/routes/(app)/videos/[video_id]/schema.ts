import z from 'zod';

export const addCommentSchema = z.object({
	content: z
		.string('Полето е задължително.')
		.min(1, 'Полето е задължително.')
		.max(2500, 'Максимум 2500 символа.')
		.trim()
});

export const editCommentSchema = z.object({
	...addCommentSchema.shape,
	id: z.string().min(1)
});

export type EditCommentSchema = z.infer<typeof editCommentSchema>;

export const deleteCommentSchema = z.object({
	id: z.string().min(1)
});

export type DeleteCommentSchema = z.infer<typeof deleteCommentSchema>;
