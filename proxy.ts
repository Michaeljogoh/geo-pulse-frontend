import { NextResponse, type NextRequest } from 'next/server';

import {
	AUTH_SESSION_COOKIE,
	safeAuthNextPath,
} from '@/lib/auth-session-cookie';

/**
 * Instant guest redirect for /dashboard — runs before page JS / Firebase.
 * Cookie is a presence hint only; RequireAuth still verifies the real session.
 */
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = Boolean(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

	if (pathname.startsWith('/dashboard') && !hasSession) {
		const url = request.nextUrl.clone();
		url.pathname = '/sign-in';
		url.searchParams.set('next', safeAuthNextPath(pathname));
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard', '/dashboard/:path*'],
};
