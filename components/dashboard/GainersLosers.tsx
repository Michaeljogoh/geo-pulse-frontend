'use client';

import { memo } from 'react';

import { DegradedNotice } from '@/components/common/DegradedNotice';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { GainersLosersSkeleton } from '@/components/common/LoadingSkeletons';
import { PercentChange } from '@/components/common/PercentChange';
import { SectionCard } from '@/components/common/SectionCard';
import { MetaFooterBadge } from '@/components/dashboard/MetaFooterBadge';
import { GAINERS_LOSERS_COUNT } from '@/config/constants';
import { useEffectiveCurrency } from '@/hooks/useEffectiveCurrency';
import { useGeo } from '@/hooks/useGeo';
import { useTrending } from '@/hooks/useTrending';
import { ApiClientError } from '@/lib/api/client';
import { isResponseDegraded } from '@/lib/degraded';
import type { Coin } from '@/types/domain';

const MoverRow = memo(function MoverRow({ coin }: { coin: Coin }) {
	return (
		<li className="flex items-center justify-between gap-2 py-1.5">
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{coin.name}
				</p>
				<p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
					{coin.symbol}
				</p>
			</div>
			<PercentChange value={coin.priceChangePct24h} />
		</li>
	);
});

function CoinList({
	title,
	coins,
	emptyTitle,
}: {
	title: string;
	coins: Coin[];
	emptyTitle: string;
}) {
	return (
		<div className="min-w-0 space-y-2">
			<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
				{title}
			</p>
			{coins.length === 0 ? (
				<EmptyState title={emptyTitle} description="No rows to show." />
			) : (
				<ul className="divide-y divide-border/60">
					{coins.map((coin) => (
						<MoverRow key={`${title}-${coin.id}`} coin={coin} />
					))}
				</ul>
			)}
		</div>
	);
}

/** Phase 8 / Section 11 — top gainers and losers lists (memoized rows). */
export function GainersLosers({ className }: { className?: string }) {
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data, meta, isLoading, isError, error, refetch } = useTrending(vs);

	const errorMessage =
		error instanceof ApiClientError
			? error.message
			: error?.message ?? 'Movers data is unavailable.';

	const gainers = (data?.gainers ?? []).slice(0, GAINERS_LOSERS_COUNT);
	const losers = (data?.losers ?? []).slice(0, GAINERS_LOSERS_COUNT);

	return (
		<SectionCard
			title="Gainers / losers"
			className={className}
			meta={!isLoading && !isError ? <MetaFooterBadge meta={meta} /> : null}
		>
			{isLoading ? <GainersLosersSkeleton /> : null}

			{isError ? (
				<ErrorState
					title="Could not load movers"
					message={errorMessage}
					onRetry={refetch}
				/>
			) : null}

			{!isLoading && !isError ? (
				<>
					{isResponseDegraded(meta) ? <DegradedNotice /> : null}
					<div
						className="grid grid-cols-1 gap-4 sm:grid-cols-2"
						aria-live="polite"
					>
						<CoinList
							title="Gainers"
							coins={gainers}
							emptyTitle="No gainers"
						/>
						<CoinList title="Losers" coins={losers} emptyTitle="No losers" />
					</div>
				</>
			) : null}
		</SectionCard>
	);
}
