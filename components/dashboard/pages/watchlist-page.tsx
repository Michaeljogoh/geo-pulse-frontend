'use client';

import { WatchlistPanel } from '@/components/dashboard/WatchlistPanel';
import {
	PageInsight,
	PageRelatedLinks,
} from '@/components/dashboard/page-chrome';
import { useWatchlistMetrics } from '@/components/dashboard/page-metrics';
import { DashboardPageShell } from '@/components/dashboard/page-shell';

export function WatchlistPageClient() {
	const metrics = useWatchlistMetrics();

	return (
		<DashboardPageShell metrics={metrics}>
			<PageInsight
				title="Privacy"
				body="Your watchlist is account-scoped. Missing prices stay empty — we never invent quotes for unavailable coins."
			/>

			<section>
				<WatchlistPanel className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border" />
			</section>

			<PageRelatedLinks
				links={[
					{
						href: '/dashboard/market',
						label: 'Market',
						hint: 'Star coins live',
					},
					{
						href: '/dashboard/trending',
						label: 'Trending',
						hint: 'Find movers',
					},
					{
						href: '/dashboard',
						label: 'Overview',
						hint: 'Snapshot',
					},
				]}
			/>
		</DashboardPageShell>
	);
}
