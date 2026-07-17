'use client';

import { useQuery } from '@tanstack/react-query';

import {
	QUERY_REFETCH_MARKET_MS,
	QUERY_STALE_MARKET_MS,
} from '@/config/constants';
import { getMarket } from '@/lib/api/endpoints';
import { queryKeys } from '@/hooks/query-keys';
import type { QueryHookResult } from '@/hooks/types';
import { useUiStore } from '@/store/uiStore';
import type { Coin } from '@/types/domain';

/** GET /api/market — auto-refetch when `autoRefresh` is enabled. */
export function useMarket(
	vs: string,
	limit: number
): QueryHookResult<Coin[]> {
	const autoRefresh = useUiStore((s) => s.autoRefresh);

	const query = useQuery({
		queryKey: queryKeys.market(vs, limit),
		queryFn: () => getMarket(vs, limit),
		staleTime: QUERY_STALE_MARKET_MS,
		refetchInterval: autoRefresh ? QUERY_REFETCH_MARKET_MS : false,
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
