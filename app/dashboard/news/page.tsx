import type { Metadata } from 'next';
import { NewsPageClient } from '@/components/dashboard/pages/news-page';

export const metadata: Metadata = {
	title: 'News',
	description: 'Regional crypto headlines personalized to your location.',
};

export default function NewsPage() {
	return <NewsPageClient />;
}
