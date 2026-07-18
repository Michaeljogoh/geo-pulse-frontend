import { Skeleton } from '@/components/ui/skeleton';
import { SectionCard } from '@/components/common/SectionCard';

/** Visitor layout skeleton (flag/title + meter + field grid). */
export function VisitorSkeleton() {
	return (
		<div className="space-y-4" data-slot="section-skeleton" data-section="visitor">
			<div className="flex items-start justify-between gap-3">
				<div className="w-full space-y-2">
					<Skeleton className="h-5 w-1/2" />
					<Skeleton className="h-3 w-2/3" />
				</div>
				<Skeleton className="h-5 w-20 rounded-full" />
			</div>
			<div className="space-y-1.5">
				<div className="flex justify-between">
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-3 w-8" />
				</div>
				<Skeleton className="h-1.5 w-full rounded-full" />
			</div>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="space-y-1">
						<Skeleton className="h-2.5 w-12" />
						<Skeleton className="h-4 w-full" />
					</div>
				))}
			</div>
		</div>
	);
}

/** Provider cards + cache stats skeleton. */
export function ApiHealthSkeleton() {
	return (
		<div className="space-y-4" data-slot="section-skeleton" data-section="api-health">
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="space-y-3 rounded-md border border-hairline p-4 dark:border-border"
					>
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-2">
								<Skeleton className="size-2.5 rounded-full" />
								<div className="space-y-1">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-2.5 w-16" />
								</div>
							</div>
							<Skeleton className="h-6 w-16 rounded-full" />
						</div>
						<div className="grid grid-cols-3 gap-2">
							{Array.from({ length: 3 }).map((_, j) => (
								<div key={j} className="space-y-1">
									<Skeleton className="h-2.5 w-12" />
									<Skeleton className="h-4 w-10" />
								</div>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="space-y-2 rounded-md border border-hairline px-3 py-3 dark:border-border"
					>
						<Skeleton className="h-2.5 w-14" />
						<Skeleton className="h-6 w-12" />
					</div>
				))}
			</div>
		</div>
	);
}

/** Market table row skeletons. */
export function MarketSkeleton({ rows = 6 }: { rows?: number }) {
	return (
		<div className="space-y-0" data-slot="section-skeleton" data-section="market">
			<div className="mb-2 flex gap-2 border-b border-border/60 pb-2">
				<Skeleton className="h-3 w-6" />
				<Skeleton className="h-3 w-24" />
				<Skeleton className="ml-auto h-3 w-16" />
				<Skeleton className="h-3 w-12" />
				<Skeleton className="hidden h-3 w-16 sm:block" />
			</div>
			{Array.from({ length: rows }).map((_, i) => (
				<div
					key={i}
					className="flex items-center gap-2 border-b border-border/40 py-2 last:border-0"
				>
					<Skeleton className="h-3 w-5" />
					<Skeleton className="size-6 shrink-0 rounded-full" />
					<div className="min-w-0 flex-1 space-y-1">
						<Skeleton className="h-3.5 w-24" />
						<Skeleton className="h-2.5 w-10" />
					</div>
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-3 w-12" />
					<Skeleton className="hidden h-3 w-14 sm:block" />
				</div>
			))}
		</div>
	);
}

/** Trending list row skeletons. */
export function TrendingSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<ul
			className="space-y-0"
			data-slot="section-skeleton"
			data-section="trending"
		>
			{Array.from({ length: rows }).map((_, i) => (
				<li key={i} className="flex items-center gap-2.5 py-1.5">
					<Skeleton className="size-7 shrink-0 rounded-full" />
					<div className="min-w-0 flex-1 space-y-1">
						<Skeleton className="h-3.5 w-28" />
						<Skeleton className="h-2.5 w-10" />
					</div>
					<Skeleton className="h-3 w-8" />
				</li>
			))}
		</ul>
	);
}

/** Two-column movers skeleton. */
export function GainersLosersSkeleton() {
	return (
		<div
			className="grid grid-cols-1 gap-4 sm:grid-cols-2"
			data-slot="section-skeleton"
			data-section="gainers-losers"
		>
			{(['Gainers', 'Losers'] as const).map((label) => (
				<div key={label} className="space-y-2">
					<Skeleton className="h-2.5 w-14" />
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center justify-between gap-2 py-1">
							<div className="space-y-1">
								<Skeleton className="h-3.5 w-20" />
								<Skeleton className="h-2.5 w-8" />
							</div>
							<Skeleton className="h-3 w-12" />
						</div>
					))}
				</div>
			))}
		</div>
	);
}

/** News card grid skeleton (up to 9 slots). */
export function NewsSkeleton() {
	return (
		<div
			className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
			data-slot="section-skeleton"
			data-section="news"
		>
			{Array.from({ length: 9 }).map((_, i) => (
				<div key={i} className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-4/5" />
					<div className="flex gap-2">
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-3 w-20" />
					</div>
				</div>
			))}
		</div>
	);
}

/**
 * Full-dashboard loading lattice.
 * Mirrors live section layouts to limit layout shift.
 */
export function LoadingSkeletons() {
	return (
		<div className="grid grid-cols-1 gap-px bg-border p-px md:grid-cols-2 lg:grid-cols-4">
			<SectionCard title="Visitor intelligence" className="md:col-span-2">
				<VisitorSkeleton />
			</SectionCard>
			<SectionCard title="API health" className="md:col-span-2">
				<ApiHealthSkeleton />
			</SectionCard>
			<SectionCard title="Market overview" className="lg:col-span-4">
				<MarketSkeleton />
			</SectionCard>
			<SectionCard title="Trending" className="lg:col-span-2">
				<TrendingSkeleton />
			</SectionCard>
			<SectionCard title="Gainers / losers" className="lg:col-span-2">
				<GainersLosersSkeleton />
			</SectionCard>
			<SectionCard title="Local news" className="lg:col-span-4">
				<NewsSkeleton />
			</SectionCard>
		</div>
	);
}

/** Generic fallback rows (kept for light use). Prefer section skeletons. */
export function SectionSkeletonBody({ rows = 4 }: { rows?: number }) {
	return (
		<div className="space-y-2" data-slot="section-skeleton">
			{Array.from({ length: rows }).map((_, i) => (
				<Skeleton key={i} className="h-8 w-full" />
			))}
		</div>
	);
}
