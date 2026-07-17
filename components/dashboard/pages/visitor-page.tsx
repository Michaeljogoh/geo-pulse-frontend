'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';

import { SectionCard } from '@/components/common/SectionCard';
import { VisitorSkeleton } from '@/components/common/LoadingSkeletons';
import { VisitorIntelligenceCard } from '@/components/dashboard/VisitorIntelligenceCard';
import {
	PageInsight,
	PageRelatedLinks,
} from '@/components/dashboard/page-chrome';
import { useVisitorMetrics } from '@/components/dashboard/page-metrics';
import { DashboardPageShell } from '@/components/dashboard/page-shell';
import { Button } from '@/components/ui/button';
import { useGeo } from '@/hooks/useGeo';

export function VisitorPageClient() {
	const metrics = useVisitorMetrics();
	const { data: geo } = useGeo();

	return (
		<DashboardPageShell metrics={metrics}>
			<PageInsight
				title="Why it matters"
				body="Currency and region drive every personalized market and news request. Confidence tells you how much to trust the geo signal."
			/>

			<section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Suspense
						fallback={
							<SectionCard
								title="Visitor intelligence"
								className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border"
							>
								<VisitorSkeleton />
							</SectionCard>
						}
					>
						<VisitorIntelligenceCard className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border" />
					</Suspense>
				</div>
				<SectionCard
					title="Personalization"
					meta={
						<span className="text-caption-sm text-muted-foreground">
							How GeoPulse uses this signal
						</span>
					}
					className="rounded-md border border-hairline bg-surface-card ring-0 dark:border-border"
				>
					<ul className="space-y-3 text-sm text-muted-foreground">
						<li className="flex gap-2">
							<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
							<span>
								Market prices render in your effective currency
								({geo?.currency ?? 'detected or override'}).
							</span>
						</li>
						<li className="flex gap-2">
							<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
							<span>
								News prefers headlines relevant to{' '}
								{geo?.countryCode ?? 'your region'}.
							</span>
						</li>
						<li className="flex gap-2">
							<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
							<span>
								Network type helps explain latency and mobile vs
								fixed connections.
							</span>
						</li>
					</ul>
					<Button
						render={<Link href="/dashboard/market" />}
						nativeButton={false}
						className="mt-4 h-10 w-full rounded-full font-bold text-white"
					>
						View market
						<ArrowUpRightIcon className="size-4" />
					</Button>
				</SectionCard>
			</section>

			<PageRelatedLinks
				links={[
					{
						href: '/dashboard/market',
						label: 'Market',
						hint: 'Prices in your currency',
					},
					{
						href: '/dashboard/news',
						label: 'News',
						hint: 'Regional headlines',
					},
					{
						href: '/dashboard',
						label: 'Overview',
						hint: 'Full snapshot',
					},
				]}
			/>
		</DashboardPageShell>
	);
}
