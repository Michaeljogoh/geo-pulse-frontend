'use client';

import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

/** Header auth slot: UserMenu when signed in; nothing for guests (sign-in lives on /sign-in). */
export function AuthHeaderControls() {
	const { status } = useAuth();

	if (status === 'loading') {
		return (
			<Skeleton
				className="size-9 shrink-0 rounded-full"
				aria-label="Loading account"
			/>
		);
	}

	if (status === 'authed') {
		return <UserMenu />;
	}

	return null;
}
