import { bigint, index, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from '../column-helpers';
import { videoStatusEnum } from './enums';
import { relations } from 'drizzle-orm/relations';
import { users } from './auth';
import { VideoStatusEnum } from '../../../types/enums';
import { comments } from './comments';

export const videos = pgTable(
	'videos',
	{
		id: text('id').primaryKey(),
		title: varchar('title', { length: 200 }).notNull(),
		slug: varchar('slug', { length: 220 }).notNull(),
		description: text('description'),
		status: videoStatusEnum('status')
			.notNull()
			.$type<VideoStatusEnum>()
			.default(VideoStatusEnum.draft),
		bucket: varchar('bucket', { length: 255 }).notNull(),
		objectKey: text('object_key').notNull(),
		originalFilename: text('original_filename'),
		mimeType: varchar('mime_type', { length: 120 }).notNull(),
		fileSize: bigint('file_size', { mode: 'number' }).notNull(),
		uploadedByUserId: text('uploaded_by_user_id').references(() => users.id, {
			onDelete: 'set null'
		}),
		publishedAt: timestamp('published_at', { withTimezone: true, mode: 'date' }),
		...timestamps
	},
	(table) => [
		uniqueIndex('videos_slug_unique_idx').on(table.slug),
		uniqueIndex('videos_object_key_unique_idx').on(table.objectKey),
		index('videos_status_idx').on(table.status),
		index('videos_uploader_idx').on(table.uploadedByUserId)
	]
);

export const videoRelations = relations(videos, ({ one, many }) => ({
	uploader: one(users, {
		fields: [videos.uploadedByUserId],
		references: [users.id]
	}),

	comments: many(comments)
}));

export type Video = typeof videos.$inferSelect;
