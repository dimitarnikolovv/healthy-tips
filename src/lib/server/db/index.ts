import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as auth from './schema/auth';
import * as enums from './schema/enums';
import * as videos from './schema/videos';

import { PRIVATE_DATABASE_URL } from '$env/static/private';

if (!PRIVATE_DATABASE_URL) throw new Error('PRIVATE_DATABASE_URL is not set');

const client = postgres(PRIVATE_DATABASE_URL);

const schema = {
	// Enums always first
	...enums,

	// Tables
	...auth,
	...videos
};

export const db = drizzle(client, { schema });
