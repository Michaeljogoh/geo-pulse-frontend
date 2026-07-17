'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import {
	clearAuthSessionCookie,
	hasAuthSessionCookie,
	safeAuthNextPath,
} from '@/lib/auth-session-cookie';

export { safeAuthNextPath } from '@/lib/auth-session-cookie';

/**
 * Client gate for Firebase Auth — dashboard is authenticated-only.
 * Guests are usually redirected by proxy (cookie) before this mounts.
 * With a session cookie, render optimistically while Firebase hydrates.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
	const { status } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [hasHint] = useState(() => hasAuthSessionCookie());

	useEffect(() => {
		if (status !== 'anon') return;
		clearAuthSessionCookie();
		const next = encodeURIComponent(safeAuthNextPath(pathname));
		router.replace(`/sign-in?next=${next}`);
	}, [status, router, pathname]);

	if (status === 'authed' || (status === 'loading' && hasHint)) {
		return children;
	}

	return (
		<div
			className="min-h-svh bg-background"
			aria-busy="true"
			aria-label="Loading"
		>
			<span className="sr-only">Loading</span>
		</div>
	);
}
