import { formatLatency } from '@/lib/format';
import { cn } from '@/lib/utils';

/** Latency chip for meta footers. */
export function LatencyBadge({
	latencyMs,
	className,
}: {
	latencyMs: number;
	className?: string;
}) {
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground/80 tabular-nums',
				className
			)}
		>
			{formatLatency(latencyMs)}
		</span>
	);
}
