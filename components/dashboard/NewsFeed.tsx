'use client';

import { DegradedNotice } from '@/components/common/DegradedNotice';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { NewsSkeleton } from '@/components/common/LoadingSkeletons';
import { SectionCard } from '@/components/common/SectionCard';
import { MetaFooterBadge } from '@/components/dashboard/MetaFooterBadge';
import { NewsCard } from '@/components/dashboard/NewsCard';
import { useGeo } from '@/hooks/useGeo';
import { useNews } from '@/hooks/useNews';
import { ApiClientError } from '@/lib/api/client';
import { isResponseDegraded } from '@/lib/degraded';

/** Phase 9 — geo-localized news feed. */
export function NewsFeed({ className }: { className?: string }) {
	const { data: geo } = useGeo();
	const country = geo?.countryCode ?? undefined;

	const { data, meta, isLoading, isError, error, refetch } = useNews({
		country,
		lang: 'en',
	});

	const errorMessage =
		error instanceof ApiClientError
			? error.message
			: error?.message ?? 'Local news is unavailable.';

	const items = data ?? [];

	return (
		<SectionCard
			title="Local news"
			className={className}
			meta={!isLoading && !isError ? <MetaFooterBadge meta={meta} /> : null}
		>
			{isLoading ? <NewsSkeleton /> : null}

			{isError ? (
				<ErrorState
					title="Could not load news"
					message={errorMessage}
					onRetry={refetch}
				/>
			) : null}

			{!isLoading && !isError ? (
				items.length === 0 ? (
					<EmptyState
						title="No local news"
						description="There are no stories for this region right now."
					/>
				) : (
					<>
						{isResponseDegraded(meta) ? <DegradedNotice /> : null}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{items.map((item) => (
								<NewsCard
									key={`${item.url}-${item.publishedAt}`}
									item={item}
								/>
							))}
						</div>
					</>
				)
			) : null}
		</SectionCard>
	);
}
