'use client';

import { ErrorState } from '@/components/common/ErrorState';
import { ApiHealthSkeleton } from '@/components/common/LoadingSkeletons';
import { SectionCard } from '@/components/common/SectionCard';
import { MetaFooterBadge } from '@/components/dashboard/MetaFooterBadge';
import { Spinner } from '@/components/ui/spinner';
import { useStatus } from '@/hooks/useStatus';
import { ApiClientError } from '@/lib/api/client';
import {
	formatHitRatio,
	formatLatency,
	formatRelativeTime,
	formatUptime,
} from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ProviderHealth } from '@/types/domain';

function circuitDotClass(state: ProviderHealth['state']): string {
	switch (state) {
		case 'closed':
			return 'bg-gain';
		case 'open':
			return 'bg-loss';
		case 'half_open':
			return 'bg-warning';
		default:
			return 'bg-network-unknown';
	}
}

function circuitLabel(state: ProviderHealth['state']): string {
	switch (state) {
		case 'closed':
			return 'closed';
		case 'open':
			return 'open';
		case 'half_open':
			return 'half-open';
		default:
			return 'unknown';
	}
}

function isDegraded(state: ProviderHealth['state']): boolean {
	return state === 'open' || state === 'half_open';
}

function ProviderRow({ provider }: { provider: ProviderHealth }) {
	const degraded = isDegraded(provider.state);

	return (
		<li
			className={cn(
				'flex flex-wrap items-center justify-between gap-2 py-2',
				degraded && 'rounded-md bg-warning/10 px-2'
			)}
			data-slot="provider-row"
			data-state={provider.state}
		>
			<div className="flex min-w-0 items-center gap-2">
				<span
					className={cn(
						'size-2 shrink-0 rounded-full',
						circuitDotClass(provider.state)
					)}
					aria-hidden
					data-slot="circuit-dot"
				/>
				<div className="min-w-0">
					<p className="truncate text-sm font-medium text-foreground">
						{provider.provider}
					</p>
					<p className="text-[10px] tracking-wide text-muted-foreground uppercase">
						{circuitLabel(provider.state)}
						{degraded ? ' · degraded' : ''}
					</p>
				</div>
			</div>
			<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
				<span className="font-mono tabular-nums">
					{formatLatency(provider.avgLatencyMs)}
				</span>
				<span>
					{provider.lastSuccessAt
						? formatRelativeTime(provider.lastSuccessAt)
						: 'never'}
				</span>
			</div>
		</li>
	);
}

/** Phase 10 — provider circuit health + cache stats (IP-Meta-style). */
export function ApiHealthPanel({ className }: { className?: string }) {
	const { data, meta, isLoading, isError, error, isFetching, refetch } =
		useStatus();

	const errorMessage =
		error instanceof ApiClientError
			? error.message
			: error?.message ?? 'Status data is unavailable.';

	const providers = data?.providers ?? [];
	const hasDegraded = providers.some((p) => isDegraded(p.state));
	const showBackgroundFetch = isFetching && !isLoading && !!data;

	return (
		<SectionCard
			title="API health"
			className={className}
			meta={
				<div className="flex flex-wrap items-center justify-end gap-2">
					{showBackgroundFetch ? (
						<span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
							<Spinner className="size-3" />
							Updating
						</span>
					) : null}
					{!isLoading && !isError ? <MetaFooterBadge meta={meta} /> : null}
				</div>
			}
		>
			{isLoading ? <ApiHealthSkeleton /> : null}

			{isError ? (
				<ErrorState
					title="Could not load API health"
					message={errorMessage}
					onRetry={refetch}
				/>
			) : null}

			{!isLoading && !isError && data ? (
				<div className="space-y-3" aria-live="polite">
					{hasDegraded ? (
						<p
							className="rounded-md bg-warning/15 px-2 py-1.5 text-xs text-warning"
							role="status"
							data-slot="degraded-warning"
						>
							One or more providers are degraded — responses may be slow or
							cached.
						</p>
					) : null}

					{providers.length === 0 ? (
						<p className="text-muted-foreground text-sm">
							No providers reported.
						</p>
					) : (
						<ul className="divide-y divide-border/60">
							{providers.map((provider) => (
								<ProviderRow key={provider.provider} provider={provider} />
							))}
						</ul>
					)}

					<div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
						<div className="min-w-0 space-y-0.5">
							<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
								Cache hit
							</p>
							<p className="font-mono text-sm tabular-nums text-foreground">
								{formatHitRatio(data.cache.hitRatio)}
							</p>
						</div>
						<div className="min-w-0 space-y-0.5">
							<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
								L1 keys
							</p>
							<p className="font-mono text-sm tabular-nums text-foreground">
								{data.cache.l1Keys}
							</p>
						</div>
						<div className="min-w-0 space-y-0.5">
							<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
								Uptime
							</p>
							<p className="font-mono text-sm tabular-nums text-foreground">
								{formatUptime(data.uptimeSeconds)}
							</p>
						</div>
					</div>
				</div>
			) : null}
		</SectionCard>
	);
}
