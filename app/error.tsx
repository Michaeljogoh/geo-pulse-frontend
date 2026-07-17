'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/** Phase 11 — unexpected render errors with retry. */
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
		<main
			className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center"
			data-slot="app-error"
		>
			<h1 className="font-heading text-heading-xl">Something went wrong</h1>
			<p className="text-muted-foreground max-w-md text-body-md">
				An unexpected error occurred. You can retry or return home.
			</p>
			{error.digest ? (
				<p className="font-mono text-[10px] text-muted-foreground">
					{error.digest}
				</p>
			) : null}
			<div className="flex flex-wrap items-center justify-center gap-2">
				<Button type="button" onClick={reset}>
					Try again
				</Button>
				<Button
					render={<Link href="/" />}
					nativeButton={false}
					variant="secondary"
				>
					Go home
				</Button>
			</div>
		</main>
	);
}
