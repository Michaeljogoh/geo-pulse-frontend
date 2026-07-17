'use client';

import { SignInButton } from '@/components/auth/SignInButton';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

/** Phase 14 — header auth slot: Sign in (anon) or UserMenu (authed). */
export function AuthHeaderControls() {
	const { status } = useAuth();

	if (status === 'loading') {
		return (
			<Skeleton
				className="size-8 rounded-full"
				aria-label="Loading account"
			/>
		);
	}

	if (status === 'authed') {
		return <UserMenu />;
	}

	return <SignInButton />;
}
