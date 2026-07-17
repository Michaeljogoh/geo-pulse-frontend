'use client';

import { ApiHealthPanel } from '@/components/dashboard/ApiHealthPanel';
import { DashboardDegradedBanner } from '@/components/dashboard/DashboardDegradedBanner';
import {
	PageInsight,
	PageRelatedLinks,
} from '@/components/dashboard/page-chrome';
import { useHealthMetrics } from '@/components/dashboard/page-metrics';
import { DashboardPageShell } from '@/components/dashboard/page-shell';

export function HealthPageClient() {
	const metrics = useHealthMetrics();

	return (
		<DashboardPageShell metrics={metrics}>
			<DashboardDegradedBanner />

			<PageInsight
				title="Resilience"
				body="Open or half-open circuits mean a provider is struggling. Panels fail independently so one outage never blanks the whole product."
			/>

			<section>
				<ApiHealthPanel className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border" />
			</section>

			<PageRelatedLinks
				links={[
					{
						href: '/dashboard',
						label: 'Overview',
						hint: 'All signals',
					},
					{
						href: '/dashboard/market',
						label: 'Market',
						hint: 'Price feed',
					},
					{
						href: '/dashboard/news',
						label: 'News',
						hint: 'Headline feed',
					},
				]}
			/>
		</DashboardPageShell>
	);
}
