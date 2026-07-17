'use client';

import { GainersLosers } from '@/components/dashboard/GainersLosers';
import { TrendingPanel } from '@/components/dashboard/TrendingPanel';
import {
	PageInsight,
	PageRelatedLinks,
} from '@/components/dashboard/page-chrome';
import { useTrendingMetrics } from '@/components/dashboard/page-metrics';
import { DashboardPageShell } from '@/components/dashboard/page-shell';

export function TrendingPageClient() {
	const metrics = useTrendingMetrics();

	return (
		<DashboardPageShell metrics={metrics}>
			<PageInsight
				title="Read carefully"
				body="Trending is attention, not advice. Pair movers with news and your watchlist before acting."
			/>

			<section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
				<TrendingPanel className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border" />
				<GainersLosers className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border" />
			</section>

			<PageRelatedLinks
				links={[
					{
						href: '/dashboard/news',
						label: 'News',
						hint: 'Context for movers',
					},
					{
						href: '/dashboard/market',
						label: 'Market',
						hint: 'Full table',
					},
					{
						href: '/dashboard/watchlist',
						label: 'Watchlist',
						hint: 'Track favorites',
					},
				]}
			/>
		</DashboardPageShell>
	);
}
