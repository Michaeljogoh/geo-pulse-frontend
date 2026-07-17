import type { Metadata } from 'next';
import { VisitorPageClient } from '@/components/dashboard/pages/visitor-page';

export const metadata: Metadata = {
	title: 'Visitor',
	description: 'IP intelligence, network type, currency, and confidence.',
};

export default function VisitorPage() {
	return <VisitorPageClient />;
}
