import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema/videos';
import { DEFAULT_SEO_DESCRIPTION, DEFAULT_SEO_TITLE } from '$lib/utils/constants';
import { VideoStatusEnum } from '$lib/types/enums';
import { and, eq, ilike, or } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url, locals }) => {
	const searchTerm = url.searchParams.get('q')?.trim() ?? '';

	const where = searchTerm
		? and(
				eq(videos.status, VideoStatusEnum.published),
				or(ilike(videos.title, `%${searchTerm}%`), ilike(videos.description, `%${searchTerm}%`))
			)
		: eq(videos.status, VideoStatusEnum.published);

	const publishedVideos = await db.query.videos.findMany({
		where,
		orderBy: (video, { desc }) => [desc(video.publishedAt), desc(video.createdAt)]
	});

	return {
		title: DEFAULT_SEO_TITLE,
		description: DEFAULT_SEO_DESCRIPTION,
		searchTerm,
		user: locals.user
			? {
					firstName: locals.user.firstName,
					lastName: locals.user.lastName,
					role: locals.user.role
				}
			: null,
		videos: publishedVideos
	};
};
