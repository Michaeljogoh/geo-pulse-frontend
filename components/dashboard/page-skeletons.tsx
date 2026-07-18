import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionCard } from '@/components/common/SectionCard';
import {
	ApiHealthSkeleton,
	GainersLosersSkeleton,
	MarketSkeleton,
	NewsSkeleton,
	TrendingSkeleton,
	VisitorSkeleton,
} from '@/components/common/LoadingSkeletons';
import { cn } from '@/lib/utils';

const cardClass =
	'rounded-md border border-hairline bg-surface-card ring-0 dark:border-border';

function MetricsSkeletonGrid({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className={cn(
						'flex min-h-[7.5rem] flex-col justify-between rounded-md border border-hairline bg-surface-card p-4',
						'dark:border-border dark:bg-muted/30'
					)}
				>
					<div className="flex items-start justify-between gap-3">
						<Skeleton className="h-2.5 w-16" />
						<Skeleton className="size-8 rounded-full" />
					</div>
					<div className="mt-3 space-y-2">
						<Skeleton className="h-7 w-24" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>
			))}
		</div>
	);
}

function InsightSkeleton() {
	return (
		<aside className={cn(cardClass, 'px-4 py-3')}>
			<Skeleton className="h-2.5 w-20" />
			<Skeleton className="mt-2 h-4 w-full max-w-xl" />
		</aside>
	);
}

/** Chart placeholder used by overview progressive loading. */
export function OverviewChartSkeleton() {
	return (
		<section
			aria-busy="true"
			aria-label="Market value chart loading"
			className={cn(cardClass, 'p-5 sm:p-6')}
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-8 w-20 rounded-full" />
					</div>
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-3 w-28" />
				</div>
				<div className="flex gap-1">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-7 w-8 rounded-full" />
					))}
				</div>
			</div>
			<Skeleton className="mt-6 h-[240px] w-full rounded-md sm:h-[280px]" />
		</section>
	);
}

function PageSkeletonShell({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col gap-6" data-slot="dashboard-page-skeleton">
			<MetricsSkeletonGrid />
			{children}
		</div>
	);
}

/** `/dashboard` overview route loading UI. */
export function OverviewPageSkeleton() {
	return (
		<PageSkeletonShell>
			<OverviewChartSkeleton />
			<InsightSkeleton />
			<section className="space-y-3">
				<div className="space-y-2">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-3 w-48" />
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className={cn(cardClass, 'flex items-start gap-3 p-4')}
						>
							<Skeleton className="size-9 rounded-full" />
							<div className="min-w-0 flex-1 space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-3 w-full" />
							</div>
						</div>
					))}
				</div>
			</section>
			<section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
				<SectionCard
					title="Visitor intelligence"
					className="border-0 bg-primary text-primary-foreground ring-0"
				>
					<VisitorSkeleton />
				</SectionCard>
				<SectionCard title="Watchlist" className={cardClass}>
					<div className="space-y-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-8 w-full" />
						))}
					</div>
				</SectionCard>
				<div className="lg:col-span-2">
					<SectionCard title="Market overview" className={cardClass}>
						<MarketSkeleton />
					</SectionCard>
				</div>
			</section>
		</PageSkeletonShell>
	);
}

/** `/dashboard/visitor` loading UI. */
export function VisitorPageSkeleton() {
	return (
		<PageSkeletonShell>
			<InsightSkeleton />
			<section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<SectionCard title="Visitor intelligence" className={cardClass}>
						<VisitorSkeleton />
					</SectionCard>
				</div>
				<SectionCard title="Personalization" className={cardClass}>
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-4 w-full" />
						))}
						<Skeleton className="mt-2 h-10 w-full rounded-full" />
					</div>
				</SectionCard>
			</section>
		</PageSkeletonShell>
	);
}

/** `/dashboard/market` loading UI. */
export function MarketPageSkeleton() {
	return (
		<PageSkeletonShell>
			<InsightSkeleton />
			<section>
				<SectionCard title="Market overview" className={cardClass}>
					<MarketSkeleton rows={8} />
				</SectionCard>
			</section>
		</PageSkeletonShell>
	);
}

/** `/dashboard/watchlist` loading UI. */
export function WatchlistPageSkeleton() {
	return (
		<PageSkeletonShell>
			<InsightSkeleton />
			<section>
				<SectionCard title="Watchlist" className={cardClass}>
					<div className="space-y-3">
						<div className="flex gap-2">
							<Skeleton className="h-9 flex-1" />
							<Skeleton className="h-9 w-16" />
						</div>
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-10 w-full" />
						))}
					</div>
				</SectionCard>
			</section>
		</PageSkeletonShell>
	);
}

/** `/dashboard/trending` loading UI. */
export function TrendingPageSkeleton() {
	return (
		<PageSkeletonShell>
			<InsightSkeleton />
			<section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
				<SectionCard title="Trending" className={cardClass}>
					<TrendingSkeleton />
				</SectionCard>
				<SectionCard title="Gainers / losers" className={cardClass}>
					<GainersLosersSkeleton />
				</SectionCard>
			</section>
		</PageSkeletonShell>
	);
}

/** `/dashboard/news` loading UI. */
export function NewsPageSkeleton() {
	return (
		<PageSkeletonShell>
			<InsightSkeleton />
			<section>
				<SectionCard title="Local news" className={cardClass}>
					<NewsSkeleton />
				</SectionCard>
			</section>
		</PageSkeletonShell>
	);
}

/** `/dashboard/health` loading UI. */
export function HealthPageSkeleton() {
	return (
		<PageSkeletonShell>
			<InsightSkeleton />
			<section>
				<SectionCard title="API health" className={cardClass}>
					<ApiHealthSkeleton />
				</SectionCard>
			</section>
		</PageSkeletonShell>
	);
}
