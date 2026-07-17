'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<h1 className="font-heading text-heading-xl">Something went wrong</h1>
			<p className="max-w-md text-body-md text-muted-foreground">
				An unexpected error occurred. You can retry or return home.
			</p>
			<div className="flex flex-wrap items-center justify-center gap-2">
				<Button type="button" onClick={reset}>
					Try again
				</Button>
				<Button render={<Link href="/" />} nativeButton={false} variant="secondary">
					Go home
				</Button>
			</div>
		</main>
	);
}
