import { LatencyBadge } from '@/components/common/LatencyBadge';
import type { ResponseMeta } from '@/types/envelope';
import { cn } from '@/lib/utils';

function sourceLabel(source: ResponseMeta['source']): string {
	switch (source) {
		case 'cache-l1':
			return 'cache L1';
		case 'cache-l2':
			return 'cache L2';
		case 'fallback':
			return 'fallback';
		default:
			return 'live';
	}
}

/** Phase 6 — source / provider / latency footer. */
export function MetaFooterBadge({
	meta,
	confidence,
	className,
}: {
	meta?: ResponseMeta | null;
	confidence?: number | null;
	className?: string;
}) {
	if (!meta) return null;

	return (
		<div
			className={cn(
				'flex flex-wrap items-center justify-end gap-1.5 text-[10px] text-foreground/80',
				className
			)}
		>
			<span className="rounded-md bg-muted px-1.5 py-0.5 uppercase tracking-wide text-foreground/80">
				{sourceLabel(meta.source)}
			</span>
			{meta.provider ? (
				<span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-foreground/80">
					{meta.provider}
				</span>
			) : null}
			{typeof confidence === 'number' ? (
				<span className="rounded-md bg-muted px-1.5 py-0.5 tabular-nums text-foreground/80">
					{Math.round(confidence * 100)}% conf
				</span>
			) : null}
			<LatencyBadge latencyMs={meta.latencyMs} />
		</div>
	);
}
