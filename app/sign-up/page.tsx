import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthPage } from '@/components/auth-page';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
	title: 'Sign up',
	description:
		'Create a GeoPulse account to save a watchlist and sync your personalized dashboard.',
};

function AuthFallback() {
	return (
		<div className="flex min-h-svh items-center justify-center">
			<Spinner className="size-6 text-primary" />
		</div>
	);
}

export default function SignUpPage() {
	return (
		<Suspense fallback={<AuthFallback />}>
			<AuthPage mode="sign-up" />
		</Suspense>
	);
}
