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

function circuitPillClass(state: ProviderHealth['state']): string {
	switch (state) {
		case 'closed':
			return 'bg-gain-bg text-gain';
		case 'open':
			return 'bg-loss-bg text-loss';
		case 'half_open':
			return 'bg-warning/15 text-warning';
		default:
			return 'bg-muted text-muted-foreground';
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
				'flex flex-col gap-3 rounded-md border border-hairline bg-surface-card p-4',
				'transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]',
				'hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.06)]',
				degraded && 'border-warning/40 bg-warning/5',
				'dark:border-border dark:bg-muted/30'
			)}
			data-slot="provider-row"
			data-state={provider.state}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2.5">
					<span
						className={cn(
							'size-2.5 shrink-0 rounded-full',
							circuitDotClass(provider.state)
						)}
						aria-hidden
						data-slot="circuit-dot"
					/>
					<div className="min-w-0">
						<p className="truncate font-heading text-sm font-semibold tracking-tight text-foreground">
							{provider.provider}
						</p>
						<p className="mt-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
							{degraded ? 'Needs attention' : 'Healthy'}
						</p>
					</div>
				</div>
				<span
					className={cn(
						'inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase',
						circuitPillClass(provider.state)
					)}
				>
					{circuitLabel(provider.state)}
				</span>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<div className="min-w-0 space-y-0.5">
					<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
						Latency
					</p>
					<p className="font-mono text-sm tabular-nums text-foreground">
						{formatLatency(provider.avgLatencyMs)}
					</p>
				</div>
				<div className="min-w-0 space-y-0.5">
					<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
						Last success
					</p>
					<p className="truncate text-sm text-foreground">
						{provider.lastSuccessAt
							? formatRelativeTime(provider.lastSuccessAt)
							: 'never'}
					</p>
				</div>
				<div className="min-w-0 space-y-0.5">
					<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
						Fails
					</p>
					<p className="font-mono text-sm tabular-nums text-foreground">
						{provider.consecutiveFail}
						<span className="text-muted-foreground">
							{' '}
							/ {provider.failureCount}
						</span>
					</p>
				</div>
			</div>
		</li>
	);
}

function StatTile({
	label,
	value,
}: {
	label: string;
	value: string | number;
}) {
	return (
		<div className="min-w-0 rounded-md border border-hairline bg-secondary/60 px-3 py-3 dark:border-border dark:bg-muted/40">
			<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
				{label}
			</p>
			<p className="mt-1 font-heading text-xl font-bold tracking-tight tabular-nums text-foreground">
				{value}
			</p>
		</div>
	);
}

/** Provider circuit health + cache stats. */
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
				<div className="space-y-4" aria-live="polite">
					{hasDegraded ? (
						<p
							className="rounded-md border border-warning/30 bg-warning/15 px-3 py-2 text-xs text-warning"
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
						<ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
							{providers.map((provider) => (
								<ProviderRow key={provider.provider} provider={provider} />
							))}
						</ul>
					)}

					<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
						<StatTile
							label="Cache hit"
							value={formatHitRatio(data.cache.hitRatio)}
						/>
						<StatTile label="L1 keys" value={data.cache.l1Keys} />
						<StatTile
							label="Uptime"
							value={formatUptime(data.uptimeSeconds)}
						/>
					</div>
				</div>
			) : null}
		</SectionCard>
	);
}
