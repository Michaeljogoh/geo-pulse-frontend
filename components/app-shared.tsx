import type { ReactNode } from 'react';
import {
	ActivityIcon,
	GlobeIcon,
	HomeIcon,
	LayoutGridIcon,
	LineChartIcon,
	NewspaperIcon,
	StarIcon,
	TrendingUpIcon,
} from 'lucide-react';

export type SidebarNavItem = {
	title: string;
	path: string;
	icon?: ReactNode;
	description?: string;
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

/** GeoPulse product navigation — standalone dashboard routes. */
export const navGroups: SidebarNavGroup[] = [
	{
		label: 'Dashboard',
		items: [
			{
				title: 'Overview',
				path: '/dashboard',
				description: 'Personalized snapshot across every signal',
				icon: <LayoutGridIcon />,
			},
			{
				title: 'Visitor',
				path: '/dashboard/visitor',
				description: 'IP intelligence, network type, and confidence',
				icon: <GlobeIcon />,
			},
			{
				title: 'Market',
				path: '/dashboard/market',
				description: 'Live prices in your effective currency',
				icon: <LineChartIcon />,
			},
			{
				title: 'Watchlist',
				path: '/dashboard/watchlist',
				description: 'Private coins synced to your account',
				icon: <StarIcon />,
			},
			{
				title: 'Trending',
				path: '/dashboard/trending',
				description: 'Movers, gainers, and losers',
				icon: <TrendingUpIcon />,
			},
			{
				title: 'News',
				path: '/dashboard/news',
				description: 'Regional crypto headlines',
				icon: <NewspaperIcon />,
			},
			{
				title: 'API health',
				path: '/dashboard/health',
				description: 'Provider circuits, latency, and cache',
				icon: <ActivityIcon />,
			},
		],
	},
	{
		label: 'Site',
		items: [
			{
				title: 'Home',
				path: '/',
				description: 'Marketing landing page',
				icon: <HomeIcon />,
			},
		],
	},
];

export const navLinks: SidebarNavItem[] = navGroups.flatMap((g) => g.items);

export function getActiveNavItem(pathname: string): SidebarNavItem | undefined {
	const exact = navLinks.find((item) => item.path === pathname);
	if (exact) return exact;

	// Nested dashboard paths (e.g. future /dashboard/market/[id])
	const nested = navLinks
		.filter(
			(item) =>
				item.path !== '/' &&
				item.path !== '/dashboard' &&
				pathname.startsWith(`${item.path}/`)
		)
		.sort((a, b) => b.path.length - a.path.length)[0];

	if (nested) return nested;

	if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
		return navLinks.find((item) => item.path === '/dashboard');
	}

	return undefined;
}
