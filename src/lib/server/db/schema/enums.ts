import { pgEnum } from 'drizzle-orm/pg-core';
import { RolesEnum, VideoStatusEnum } from '../../../types/enums';

// When changed change the enum in src/lib/enums.ts

export const roleEnum = pgEnum('role', Object.values(RolesEnum) as [string, ...string[]]);
export type RoleType = keyof typeof RolesEnum;

export const videoStatusEnum = pgEnum(
	'video_status',
	Object.values(VideoStatusEnum) as [string, ...string[]]
);
