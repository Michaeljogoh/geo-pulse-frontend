import { cn } from '@/lib/utils';

const DEFAULT_MESSAGE =
	'Live data unavailable — showing cached/last-known.';

/** Non-blocking inline warning for degraded/cached sections. */
export function DegradedNotice({
	message = DEFAULT_MESSAGE,
	className,
}: {
	message?: string;
	className?: string;
}) {
	return (
		<p
			role="status"
			data-slot="degraded-notice"
			className={cn(
				'mb-3 rounded-md bg-warning/15 px-2 py-1.5 text-xs text-warning',
				className
			)}
		>
			{message}
		</p>
	);
}
