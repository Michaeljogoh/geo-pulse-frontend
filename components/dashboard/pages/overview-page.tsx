'use client';

import Link from 'next/link';
import {
	ActivityIcon,
	ArrowUpRightIcon,
	GlobeIcon,
	LineChartIcon,
	NewspaperIcon,
	StarIcon,
	TrendingUpIcon,
} from 'lucide-react';

import { DashboardDegradedBanner } from '@/components/dashboard/DashboardDegradedBanner';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { OverviewBalanceChart } from '@/components/dashboard/OverviewBalanceChart';
import { VisitorIntelligenceCard } from '@/components/dashboard/VisitorIntelligenceCard';
import { WatchlistPanel } from '@/components/dashboard/WatchlistPanel';
import {
	PageInsight,
	PageRelatedLinks,
} from '@/components/dashboard/page-chrome';
import { useOverviewMetrics } from '@/components/dashboard/page-metrics';
import { DashboardPageShell } from '@/components/dashboard/page-shell';
import { navGroups } from '@/components/app-shared';

const quickLinks =
	navGroups[0]?.items.filter((i) => i.path !== '/dashboard') ?? [];

const linkIcon: Record<string, React.ReactNode> = {
	'/dashboard/visitor': <GlobeIcon />,
	'/dashboard/market': <LineChartIcon />,
	'/dashboard/watchlist': <StarIcon />,
	'/dashboard/trending': <TrendingUpIcon />,
	'/dashboard/news': <NewspaperIcon />,
	'/dashboard/health': <ActivityIcon />,
};

export function OverviewPageClient() {
	const metrics = useOverviewMetrics();

	return (
		<DashboardPageShell metrics={metrics}>
			<OverviewBalanceChart />

			<DashboardDegradedBanner />

			<PageInsight
				title="Start here"
				body="Summary cards above mirror live feeds. Each sidebar route is a focused workspace with the same premium chrome."
			/>

			<section className="space-y-3">
				<div>
					<h2 className="font-heading text-sm font-semibold tracking-tight">
						Explore signals
					</h2>
					<p className="text-caption-sm text-muted-foreground">
						Open a dedicated page for deeper work.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{quickLinks.map((item) => (
						<Link
							key={item.path}
							href={item.path}
							className="group flex items-start gap-3 rounded-[var(--radius-md)] border border-hairline bg-surface-card p-4 transition-[transform,background-color,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:bg-secondary hover:shadow-[0_8px_24px_rgb(0_0_0/0.06)] dark:border-border dark:bg-muted/30"
						>
							<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white [&_svg]:size-4">
								{linkIcon[item.path] ?? <ActivityIcon />}
							</span>
							<div className="min-w-0 flex-1">
								<p className="font-heading text-sm font-semibold">
									{item.title}
								</p>
								<p className="mt-0.5 text-caption-sm text-muted-foreground text-pretty">
									{item.description}
								</p>
							</div>
							<ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
						</Link>
					))}
				</div>
			</section>

			<section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
				<VisitorIntelligenceCard tone="aubergine" />
				<WatchlistPanel className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border" />
				<div className="lg:col-span-2">
					<MarketOverview className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border" />
				</div>
			</section>

			<PageRelatedLinks
				links={[
					{
						href: '/dashboard/trending',
						label: 'Trending',
						hint: 'Movers',
					},
					{
						href: '/dashboard/news',
						label: 'News',
						hint: 'Headlines',
					},
					{
						href: '/dashboard/health',
						label: 'API health',
						hint: 'Circuits',
					},
				]}
			/>
		</DashboardPageShell>
	);
}
