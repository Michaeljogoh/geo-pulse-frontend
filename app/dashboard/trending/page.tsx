import type { Metadata } from 'next';
import { TrendingPageClient } from '@/components/dashboard/pages/trending-page';

export const metadata: Metadata = {
	title: 'Trending',
	description: 'Trending coins, gainers, and losers.',
};

export default function TrendingPage() {
	return <TrendingPageClient />;
}
