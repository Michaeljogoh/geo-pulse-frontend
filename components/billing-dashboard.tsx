import dynamic from 'next/dynamic';

import { BillingHealth } from '@/components/billing-health';
import { DashboardActivity } from '@/components/dashboard-activity';
import { DashboardInvoices } from '@/components/dashboard-invoices';
import { DashboardStats } from '@/components/stats';
import { Skeleton } from '@/components/ui/skeleton';

/** Lazy-load Recharts bundles for the billing demo charts. */
const NetRevenueChart = dynamic(
	() =>
		import('@/components/net-revenue-chart').then((m) => m.NetRevenueChart),
	{
		loading: () => <Skeleton className="min-h-92 w-full lg:col-span-2" />,
		ssr: false,
	}
);

const ChannelSalesChart = dynamic(
	() =>
		import('@/components/channel-sales-chart').then(
			(m) => m.ChannelSalesChart
		),
	{
		loading: () => <Skeleton className="min-h-92 w-full lg:col-span-2" />,
		ssr: false,
	}
);

export function Dashboard() {
	return (
		<div className="grid grid-cols-1 gap-px bg-border p-px md:grid-cols-2 lg:grid-cols-4">
			<DashboardStats />
			<NetRevenueChart />
			<ChannelSalesChart />
			<DashboardInvoices />
			<BillingHealth />
			<DashboardActivity />
		</div>
	);
}
