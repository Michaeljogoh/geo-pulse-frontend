'use client';

import { NewsFeed } from '@/components/dashboard/NewsFeed';
import {
	PageInsight,
	PageRelatedLinks,
} from '@/components/dashboard/page-chrome';
import { useNewsMetrics } from '@/components/dashboard/page-metrics';
import { DashboardPageShell } from '@/components/dashboard/page-shell';

export function NewsPageClient() {
	const metrics = useNewsMetrics();

	return (
		<DashboardPageShell metrics={metrics}>
			<PageInsight
				title="Localization"
				body="Headlines prefer your country code from visitor intelligence. Global fallback kicks in when regional coverage is thin."
			/>

			<section>
				<NewsFeed className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border" />
			</section>

			<PageRelatedLinks
				links={[
					{
						href: '/dashboard/trending',
						label: 'Trending',
						hint: 'Price movers',
					},
					{
						href: '/dashboard/market',
						label: 'Market',
						hint: 'Live quotes',
					},
					{
						href: '/dashboard/visitor',
						label: 'Visitor',
						hint: 'Your region',
					},
				]}
			/>
		</DashboardPageShell>
	);
}
