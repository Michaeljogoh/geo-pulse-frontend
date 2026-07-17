import type { Metadata } from 'next';
import { WatchlistPageClient } from '@/components/dashboard/pages/watchlist-page';

export const metadata: Metadata = {
	title: 'Watchlist',
	description: 'Private coin watchlist synced to your GeoPulse account.',
};

export default function WatchlistPage() {
	return <WatchlistPageClient />;
}
