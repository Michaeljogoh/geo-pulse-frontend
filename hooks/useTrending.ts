'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_STALE_TRENDING_MS } from '@/config/constants';
import { getTrending } from '@/lib/api/endpoints';
import { queryKeys } from '@/hooks/query-keys';
import type { QueryHookResult } from '@/hooks/types';
import type { TrendingResult } from '@/types/domain';

/** GET /api/trending */
export function useTrending(vs: string): QueryHookResult<TrendingResult> {
	const query = useQuery({
		queryKey: queryKeys.trending(vs),
		queryFn: () => getTrending(vs),
		staleTime: QUERY_STALE_TRENDING_MS,
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
