import type { Metadata } from 'next';
import { HealthPageClient } from '@/components/dashboard/pages/health-page';

export const metadata: Metadata = {
	title: 'API health',
	description: 'Provider circuits, latency, cache, and uptime.',
};

export default function HealthPage() {
	return <HealthPageClient />;
}
