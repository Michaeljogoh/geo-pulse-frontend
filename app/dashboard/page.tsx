import type { Metadata } from 'next';
import { OverviewPageClient } from '@/components/dashboard/pages/overview-page';

export const metadata: Metadata = {
	title: 'Overview',
	description:
		'Personalized market view for your location and currency across every GeoPulse signal.',
};

export default function OverviewPage() {
	return <OverviewPageClient />;
}
