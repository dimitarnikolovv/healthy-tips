import { pgTable, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { timestamps } from '../column-helpers';
import { relations } from 'drizzle-orm/relations';
import { roleEnum } from './enums';
import { RolesEnum } from '../../../types/enums';

export const users = pgTable(
	'users',
	{
		id: text('id').primaryKey(),
		googleId: text('google_id').unique(),
		firstName: varchar('first_name', { length: 180 }).notNull(),
		lastName: varchar('last_name', { length: 180 }).notNull(),
		email: varchar('email', { length: 255 }).notNull().unique(),
		passwordHash: text('password_hash').notNull(),
		role: roleEnum('role').$type<RolesEnum>().notNull().default(RolesEnum.basic),
		refreshToken: text('refresh_token'),

		...timestamps
	},
	(table) => [
		index('user_email_idx').on(table.email),
		index('user_role_idx').on(table.role),
		index('user_created_at_idx').on(table.createdAt),
		index('user_deleted_at_idx').on(table.deletedAt)
	]
);

// User Relations
export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions)
}));

export type User = typeof users.$inferSelect;

export const sessions = pgTable('sessions', {
	...timestamps,
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export type Session = typeof sessions.$inferSelect;
