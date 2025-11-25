import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_HOST } from '$env/static/public';
import {
	checkIfUserAndRole,
	deleteSessionTokenCookie,
	sessionCookieName,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/auth';
import { RolesEnum } from '$lib/types/enums';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(sessionCookieName);

	// If no session token is present, set user and session to null and continue
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	let requiredRole: RolesEnum[] = [];

	// Define roles based on the route
	if (event.url.pathname.startsWith('/admin')) {
		requiredRole = [RolesEnum.admin];
	} else if (event.url.pathname.startsWith('/account')) {
		requiredRole = [RolesEnum.basic];
	}

	// Validate session token and role
	const { session, user } = await validateSessionToken(sessionToken, requiredRole);

	if (session) {
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		console.log(event.url.pathname);

		deleteSessionTokenCookie(event);
	}

	if (
		user?.deletedAt &&
		!event.url.pathname.startsWith('/account-deactivated') &&
		!event.url.pathname.startsWith('/logout')
	) {
		return redirect(302, '/account-deactivated');
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { locals } = event;

	if (!checkIfUserAndRole(locals, [RolesEnum.admin]) && event.url.pathname.startsWith('/admin')) {
		event.url = new URL('/', PUBLIC_HOST);
		return redirect(302, '/');
	}

	return resolve(event);
};

export const handle = sequence(handleAuth, authGuard);
