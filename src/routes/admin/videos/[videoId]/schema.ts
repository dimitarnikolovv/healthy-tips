import { z } from 'zod';
import { VideoStatusEnum } from '$lib/types/enums';

export const adminVideoUpdateSchema = z.object({
	title: z
		.string({ message: 'Заглавието е задължително.' })
		.min(3, { message: 'Заглавието трябва да е поне 3 символа.' })
		.max(200, { message: 'Заглавието не може да надвишава 200 символа.' })
		.trim(),
	description: z
		.string()
		.max(2_000, { message: 'Описанието не може да бъде по-дълго от 2000 символа.' })
		.optional()
		.transform((value) => value?.trim() ?? ''),
	status: z.enum(VideoStatusEnum, {
		message: 'Невалиден статус.'
	})
});

export type AdminVideoUpdateSchema = z.infer<typeof adminVideoUpdateSchema>;
