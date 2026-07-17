'use client';

import Image from 'next/image';
import { memo } from 'react';

import { DegradedNotice } from '@/components/common/DegradedNotice';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { TrendingSkeleton } from '@/components/common/LoadingSkeletons';
import { SectionCard } from '@/components/common/SectionCard';
import { MetaFooterBadge } from '@/components/dashboard/MetaFooterBadge';
import { useEffectiveCurrency } from '@/hooks/useEffectiveCurrency';
import { useGeo } from '@/hooks/useGeo';
import { useTrending } from '@/hooks/useTrending';
import { ApiClientError } from '@/lib/api/client';
import { isResponseDegraded } from '@/lib/degraded';
import { displayValue } from '@/lib/display';
import type { TrendingCoin } from '@/types/domain';

const TrendingRow = memo(function TrendingRow({
	coin,
}: {
	coin: TrendingCoin;
}) {
	const alt = `${coin.name} (${coin.symbol}) logo`;

	return (
		<li className="flex items-center gap-2.5 py-1.5">
			{coin.thumb ? (
				<Image
					src={coin.thumb}
					alt={alt}
					width={28}
					height={28}
					className="size-7 shrink-0 rounded-full bg-muted"
					unoptimized={!coin.thumb.includes('coingecko.com')}
				/>
			) : (
				<span
					aria-hidden
					className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground"
				>
					{coin.symbol.slice(0, 1).toUpperCase()}
				</span>
			)}
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium text-foreground">
					{coin.name}
				</p>
				<p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
					{coin.symbol}
				</p>
			</div>
			<span className="font-mono text-xs text-muted-foreground tabular-nums">
				#{displayValue(coin.marketCapRank, '—')}
			</span>
		</li>
	);
});


/** Trending coins list. */
export function TrendingPanel({ className }: { className?: string }) {
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data, meta, isLoading, isError, error, refetch } = useTrending(vs);

	const errorMessage =
		error instanceof ApiClientError
			? error.message
			: error?.message ?? 'Trending data is unavailable.';

	const trending = data?.trending ?? [];

	return (
		<SectionCard
			title="Trending"
			className={className}
			meta={!isLoading && !isError ? <MetaFooterBadge meta={meta} /> : null}
		>
			{isLoading ? <TrendingSkeleton /> : null}

			{isError ? (
				<ErrorState
					title="Could not load trending"
					message={errorMessage}
					onRetry={refetch}
				/>
			) : null}

			{!isLoading && !isError ? (
				trending.length === 0 ? (
					<EmptyState
						title="No trending coins"
						description="Nothing is trending right now."
					/>
				) : (
					<>
						{isResponseDegraded(meta) ? <DegradedNotice /> : null}
						<ul className="divide-y divide-border/60">
							{trending.map((coin) => (
								<TrendingRow key={coin.id} coin={coin} />
							))}
						</ul>
					</>
				)
			) : null}
		</SectionCard>
	);
}
