'use client';

import { useEffect, useMemo, useState } from 'react';
import { SearchIcon } from 'lucide-react';

import { DegradedNotice } from '@/components/common/DegradedNotice';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { NewsSkeleton } from '@/components/common/LoadingSkeletons';
import { SectionCard } from '@/components/common/SectionCard';
import { MetaFooterBadge } from '@/components/dashboard/MetaFooterBadge';
import { NewsCard } from '@/components/dashboard/NewsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@/components/ui/pagination';
import {
	NEWS_IMAGE_PRELOAD_TIMEOUT_MS,
	NEWS_PAGE_SIZE,
	NEWS_SEARCH_DEBOUNCE_MS,
} from '@/config/constants';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useGeo } from '@/hooks/useGeo';
import { useImagesReady } from '@/hooks/useImagesReady';
import { useNews } from '@/hooks/useNews';
import { ApiClientError } from '@/lib/api/client';
import { isResponseDegraded } from '@/lib/degraded';
import { cn } from '@/lib/utils';
import type { NewsItem } from '@/types/domain';

function matchesNewsQuery(item: NewsItem, query: string): boolean {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	const title = item.title.toLowerCase();
	const source = (item.source ?? '').toLowerCase();
	return title.includes(q) || source.includes(q);
}

function NewsPagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	if (totalPages <= 1) return null;

	return (
		<Pagination className="justify-between sm:justify-center">
			<PaginationContent className="flex-wrap gap-1">
				<PaginationItem>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page <= 1}
						onClick={() => onPageChange(page - 1)}
						className="h-8 rounded-full border-hairline px-3 font-semibold dark:border-border"
					>
						Previous
					</Button>
				</PaginationItem>
				{Array.from({ length: totalPages }).map((_, index) => {
					const pageNumber = index + 1;
					const active = pageNumber === page;
					return (
						<PaginationItem key={pageNumber}>
							<Button
								type="button"
								variant={active ? 'default' : 'ghost'}
								size="sm"
								aria-current={active ? 'page' : undefined}
								aria-label={`Page ${pageNumber}`}
								onClick={() => onPageChange(pageNumber)}
								className={cn(
									'size-8 rounded-full p-0 font-semibold tabular-nums',
									active && 'text-white'
								)}
							>
								{pageNumber}
							</Button>
						</PaginationItem>
					);
				})}
				<PaginationItem>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page >= totalPages}
						onClick={() => onPageChange(page + 1)}
						className="h-8 rounded-full border-hairline px-3 font-semibold dark:border-border"
					>
						Next
					</Button>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

/** Geo-localized news feed with search + pagination. */
export function NewsFeed({ className }: { className?: string }) {
	const { data: geo } = useGeo();
	const country = geo?.countryCode ?? undefined;

	const { data, meta, isLoading, isError, error, refetch } = useNews({
		country,
		lang: 'en',
	});

	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const debouncedSearch = useDebouncedValue(search, NEWS_SEARCH_DEBOUNCE_MS);

	const errorMessage =
		error instanceof ApiClientError
			? error.message
			: error?.message ?? 'Local news is unavailable.';

	const items = data ?? [];

	const filtered = useMemo(
		() => items.filter((item) => matchesNewsQuery(item, debouncedSearch)),
		[items, debouncedSearch]
	);

	const totalPages = Math.max(1, Math.ceil(filtered.length / NEWS_PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const pageItems = filtered.slice(
		(safePage - 1) * NEWS_PAGE_SIZE,
		safePage * NEWS_PAGE_SIZE
	);

	const pageImageUrls = useMemo(
		() =>
			pageItems
				.map((item) => item.imageUrl)
				.filter((url): url is string => Boolean(url)),
		[pageItems]
	);

	const imagesReady = useImagesReady(
		pageImageUrls,
		NEWS_IMAGE_PRELOAD_TIMEOUT_MS
	);

	const showSkeleton =
		isLoading || (!isError && pageItems.length > 0 && !imagesReady);
	const showContent =
		!isLoading && !isError && !showSkeleton && filtered.length > 0;

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch]);

	useEffect(() => {
		if (page > totalPages) {
			setPage(totalPages);
		}
	}, [page, totalPages]);

	const hasActiveSearch = debouncedSearch.trim().length > 0;
	const dataReady = !isLoading && !isError;

	return (
		<SectionCard
			title="Local news"
			className={className}
			meta={dataReady && imagesReady ? <MetaFooterBadge meta={meta} /> : null}
		>
			{dataReady ? (
				<div className="mb-4 space-y-2">
					<label htmlFor="news-search" className="sr-only">
						Search news
					</label>
					<div className="relative">
						<SearchIcon
							className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
							aria-hidden
						/>
						<Input
							id="news-search"
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search headlines or sources…"
							autoComplete="off"
							className="h-10 rounded-md border-hairline bg-surface-card pl-9 dark:border-border"
						/>
					</div>
					{items.length > 0 ? (
						<p className="text-caption-sm text-muted-foreground">
							{hasActiveSearch
								? `${filtered.length} match${filtered.length === 1 ? '' : 'es'}`
								: `${items.length} stor${items.length === 1 ? 'y' : 'ies'}`}
							{filtered.length > NEWS_PAGE_SIZE
								? ` · page ${safePage} of ${totalPages}`
								: null}
						</p>
					) : null}
				</div>
			) : null}

			{showSkeleton ? <NewsSkeleton /> : null}

			{isError ? (
				<ErrorState
					title="Could not load news"
					message={errorMessage}
					onRetry={refetch}
				/>
			) : null}

			{dataReady && !showSkeleton && items.length === 0 ? (
				<EmptyState
					title="No local news"
					description="There are no stories for this region right now."
				/>
			) : null}

			{dataReady && !showSkeleton && items.length > 0 && filtered.length === 0 ? (
				<EmptyState
					title="No matching stories"
					description="Try a different search term."
				/>
			) : null}

			{showContent ? (
				<div className="space-y-4">
					{isResponseDegraded(meta) ? <DegradedNotice /> : null}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{pageItems.map((item) => (
							<NewsCard
								key={`${item.url}-${item.publishedAt}`}
								item={item}
							/>
						))}
					</div>
					<NewsPagination
						page={safePage}
						totalPages={totalPages}
						onPageChange={setPage}
					/>
				</div>
			) : null}
		</SectionCard>
	);
}
