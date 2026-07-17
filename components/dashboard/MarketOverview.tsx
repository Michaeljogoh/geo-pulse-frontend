'use client';

import { DegradedNotice } from '@/components/common/DegradedNotice';
import { ErrorState } from '@/components/common/ErrorState';
import { MarketSkeleton } from '@/components/common/LoadingSkeletons';
import { SectionCard } from '@/components/common/SectionCard';
import { Spinner } from '@/components/ui/spinner';
import { MetaFooterBadge } from '@/components/dashboard/MetaFooterBadge';
import { MarketTable } from '@/components/dashboard/MarketTable';
import { MARKET_LIMIT } from '@/config/constants';
import { useAuth } from '@/hooks/useAuth';
import { useEffectiveCurrency } from '@/hooks/useEffectiveCurrency';
import { useGeo } from '@/hooks/useGeo';
import { useMarket } from '@/hooks/useMarket';
import { useWatchlist } from '@/hooks/useWatchlist';
import { ApiClientError } from '@/lib/api/client';
import { isResponseDegraded } from '@/lib/degraded';
import { deriveLocale } from '@/lib/locale';

/** Phase 7 / 15 — market overview with optional watchlist stars when authed. */
export function MarketOverview({ className }: { className?: string }) {
	const { status } = useAuth();
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const locale = deriveLocale(geo?.countryCode, geo?.timezone);

	const { data, meta, isLoading, isError, error, isFetching, refetch } =
		useMarket(vs, MARKET_LIMIT);

	const {
		watchedIds,
		addCoin,
		removeCoin,
		isMutating,
	} = useWatchlist(vs);

	const errorMessage =
		error instanceof ApiClientError
			? error.message
			: error?.message ?? 'Live market data is unavailable.';

	const showBackgroundFetch = isFetching && !isLoading && !!data;
	const showWatchlist = status === 'authed';

	return (
		<SectionCard
			title="Market overview"
			className={className}
			meta={
				<div className="flex flex-wrap items-center justify-end gap-2">
					{showBackgroundFetch ? (
						<span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
							<Spinner className="size-3" />
							Updating
						</span>
					) : null}
					<span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-foreground/80">
						{vs}
					</span>
					{!isLoading && !isError ? <MetaFooterBadge meta={meta} /> : null}
				</div>
			}
		>
			{isLoading ? <MarketSkeleton /> : null}

			{isError ? (
				<ErrorState
					title="Could not load market data"
					message={errorMessage}
					onRetry={refetch}
				/>
			) : null}

			{!isLoading && !isError && data ? (
				<div aria-live="polite">
					{isResponseDegraded(meta) ? <DegradedNotice /> : null}
					<MarketTable
						coins={data}
						locale={locale}
						watchlist={
							showWatchlist
								? {
										watchedIds,
										disabled: isMutating,
										onToggle: (coinId, nextWatched) => {
											void (nextWatched
												? addCoin(coinId)
												: removeCoin(coinId));
										},
									}
								: undefined
						}
					/>
				</div>
			) : null}
		</SectionCard>
	);
}
