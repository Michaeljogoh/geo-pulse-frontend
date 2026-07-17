import type { Metadata } from 'next';
import { MarketPageClient } from '@/components/dashboard/pages/market-page';

export const metadata: Metadata = {
	title: 'Market',
	description: 'Live crypto prices in your effective currency.',
};

export default function MarketPage() {
	return <MarketPageClient />;
}
