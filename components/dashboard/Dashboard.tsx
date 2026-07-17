'use client';

import { Suspense } from 'react';
import {
	LoadingSkeletons,
	VisitorSkeleton,
} from '@/components/common/LoadingSkeletons';
import { SectionCard } from '@/components/common/SectionCard';
import { ApiHealthPanel } from '@/components/dashboard/ApiHealthPanel';
import { DashboardDegradedBanner } from '@/components/dashboard/DashboardDegradedBanner';
import { GainersLosers } from '@/components/dashboard/GainersLosers';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { NewsFeed } from '@/components/dashboard/NewsFeed';
import { TrendingPanel } from '@/components/dashboard/TrendingPanel';
import { VisitorIntelligenceCard } from '@/components/dashboard/VisitorIntelligenceCard';
import { WatchlistPanel } from '@/components/dashboard/WatchlistPanel';

/**
 * GeoPulse dashboard composition (Phases 6–15 + Section 11).
 * Sections fail independently — one API down never blanks the page.
 */
export function Dashboard() {
	return (
		<div className="flex flex-col gap-4" data-slot="geopulse-dashboard">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-heading-xl tracking-tight">
					Overview
				</h1>
				<p className="text-muted-foreground text-sm">
					Personalized market view for your location and currency.
				</p>
			</div>

			<DashboardDegradedBanner />

			<div className="grid grid-cols-1 gap-px overflow-x-hidden bg-border p-px md:grid-cols-2 lg:grid-cols-4">
				<Suspense
					fallback={
						<SectionCard
							title="Visitor intelligence"
							className="md:col-span-2"
						>
							<VisitorSkeleton />
						</SectionCard>
					}
				>
					<VisitorIntelligenceCard className="md:col-span-2" />
				</Suspense>
				<ApiHealthPanel className="md:col-span-2" />
				<MarketOverview className="lg:col-span-4" />
				<WatchlistPanel className="lg:col-span-4" />
				<TrendingPanel className="lg:col-span-2" />
				<GainersLosers className="lg:col-span-2" />
				<NewsFeed className="lg:col-span-4" />
			</div>
		</div>
	);
}

export function DashboardLoading() {
	return <LoadingSkeletons />;
}
