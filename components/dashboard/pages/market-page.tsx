'use client';

import { MarketOverview } from '@/components/dashboard/MarketOverview';
import {
	PageInsight,
	PageRelatedLinks,
} from '@/components/dashboard/page-chrome';
import { useMarketMetrics } from '@/components/dashboard/page-metrics';
import { DashboardPageShell } from '@/components/dashboard/page-shell';

export function MarketPageClient() {
	const metrics = useMarketMetrics();

	return (
		<DashboardPageShell metrics={metrics}>
			<PageInsight
				title="Freshness"
				body="Prices refresh with the market feed. Override currency from the header when you need a different display unit than your geo default."
			/>

			<section>
				<MarketOverview className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border" />
			</section>

			<PageRelatedLinks
				links={[
					{
						href: '/dashboard/trending',
						label: 'Trending',
						hint: 'Movers today',
					},
					{
						href: '/dashboard/watchlist',
						label: 'Watchlist',
						hint: 'Full watchlist page',
					},
					{
						href: '/dashboard/visitor',
						label: 'Visitor',
						hint: 'Currency source',
					},
				]}
			/>
		</DashboardPageShell>
	);
}
