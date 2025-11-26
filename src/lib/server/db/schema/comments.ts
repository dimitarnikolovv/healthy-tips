import { pgTable, text } from 'drizzle-orm/pg-core';
import { videos } from './videos';
import { users } from './auth';
import { timestamps } from '../column-helpers';
import { relations } from 'drizzle-orm';

export const comments = pgTable('comments', {
	id: text('id').primaryKey(),
	videoId: text('video_id')
		.notNull()
		.references(() => videos.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	...timestamps
});

export const commentRelations = relations(comments, ({ one }) => ({
	video: one(videos, {
		fields: [comments.videoId],
		references: [videos.id]
	}),

	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	})
}));

export type Comment = typeof comments.$inferSelect;
