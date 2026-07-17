'use client';

import { useQuery } from '@tanstack/react-query';

import {
	QUERY_REFETCH_STATUS_MS,
	QUERY_STALE_STATUS_MS,
} from '@/config/constants';
import { getStatus } from '@/lib/api/endpoints';
import { queryKeys } from '@/hooks/query-keys';
import type { QueryHookResult } from '@/hooks/types';
import { useUiStore } from '@/store/uiStore';
import type { StatusPayload } from '@/types/domain';

/** GET /api/status — provider health + cache stats (respects auto-refresh). */
export function useStatus(): QueryHookResult<StatusPayload> {
	const autoRefresh = useUiStore((s) => s.autoRefresh);

	const query = useQuery({
		queryKey: queryKeys.status,
		queryFn: () => getStatus(),
		staleTime: QUERY_STALE_STATUS_MS,
		refetchInterval: autoRefresh ? QUERY_REFETCH_STATUS_MS : false,
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
