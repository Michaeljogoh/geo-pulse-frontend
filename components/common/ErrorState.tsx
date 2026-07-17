'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

type RetryResult = void | { isError?: boolean };

/** Retryable error panel — toast on manual refresh success/failure (Phase 12). */
export function ErrorState({
	title = 'Something went wrong',
	message = 'This section could not be loaded.',
	onRetry,
}: {
	title?: string;
	message?: string;
	onRetry?: () => unknown | Promise<unknown>;
}) {
	const [pending, setPending] = useState(false);

	async function handleRetry() {
		if (!onRetry || pending) return;
		setPending(true);
		const toastId = toast.loading('Retrying…');
		try {
			const result = await onRetry();
			const failed =
				result != null &&
				typeof result === 'object' &&
				'isError' in result &&
				Boolean(result.isError);
			if (failed) {
				toast.error('Could not refresh. Try again.', { id: toastId });
			} else {
				toast.success('Updated', { id: toastId });
			}
		} catch {
			toast.error('Could not refresh. Try again.', { id: toastId });
		} finally {
			setPending(false);
		}
	}

	return (
		<div
			className="flex flex-col items-start gap-3 py-2"
			data-slot="error-state"
			role="alert"
		>
			<div className="space-y-1">
				<p className="text-sm font-medium text-foreground">{title}</p>
				<p className="text-muted-foreground text-xs">{message}</p>
			</div>
			{onRetry ? (
				<Button
					type="button"
					size="sm"
					variant="outline"
					disabled={pending}
					onClick={() => {
						void handleRetry();
					}}
				>
					{pending ? 'Retrying…' : 'Retry'}
				</Button>
			) : null}
		</div>
	);
}
