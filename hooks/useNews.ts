'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_STALE_NEWS_MS } from '@/config/constants';
import { getNews, type GetNewsParams } from '@/lib/api/endpoints';
import { queryKeys } from '@/hooks/query-keys';
import type { QueryHookResult } from '@/hooks/types';
import type { NewsItem } from '@/types/domain';

/** GET /api/news */
export function useNews(
	params: GetNewsParams = {}
): QueryHookResult<NewsItem[]> {
	const query = useQuery({
		queryKey: queryKeys.news(params),
		queryFn: () => getNews(params),
		staleTime: QUERY_STALE_NEWS_MS,
	});

	return {
		data: query.data?.data,
		meta: query.data?.meta,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		isFetching: query.isFetching,
		refetch: () => query.refetch(),
	};
}
