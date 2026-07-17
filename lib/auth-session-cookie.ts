/** Presence cookie — not a security token. Firebase ID tokens stay in the SDK. */
export const AUTH_SESSION_COOKIE = 'gp_auth';

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function secureFlag(): string {
	if (typeof window === 'undefined') return '';
	return window.location.protocol === 'https:' ? '; Secure' : '';
}

/** Mark the browser as signed-in so the proxy can redirect guests instantly. */
export function setAuthSessionCookie(): void {
	if (typeof document === 'undefined') return;
	document.cookie = `${AUTH_SESSION_COOKIE}=1; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secureFlag()}`;
}

export function clearAuthSessionCookie(): void {
	if (typeof document === 'undefined') return;
	document.cookie = `${AUTH_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secureFlag()}`;
}

export function hasAuthSessionCookie(): boolean {
	if (typeof document === 'undefined') return false;
	return document.cookie
		.split(';')
		.some((part) => part.trim().startsWith(`${AUTH_SESSION_COOKIE}=`));
}

/** Safe same-origin path for post-login redirect (blocks open redirects). */
export function safeAuthNextPath(value: string | null | undefined): string {
	if (!value) return '/dashboard';
	if (!value.startsWith('/') || value.startsWith('//')) return '/dashboard';
	if (value.startsWith('/sign-in') || value.startsWith('/sign-up')) {
		return '/dashboard';
	}
	return value;
}
