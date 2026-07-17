import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthPage } from '@/components/auth-page';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
	title: 'Sign in',
	description:
		'Sign in to GeoPulse to track coins, sync your watchlist, and keep prices in your currency.',
};

function AuthFallback() {
	return (
		<div className="flex min-h-svh items-center justify-center">
			<Spinner className="size-6 text-primary" />
		</div>
	);
}

export default function SignInPage() {
	return (
		<Suspense fallback={<AuthFallback />}>
			<AuthPage mode="sign-in" />
		</Suspense>
	);
}
