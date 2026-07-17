'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_STALE_GEO_MS } from '@/config/constants';
import { getDashboard } from '@/lib/api/endpoints';
import { queryKeys } from '@/hooks/query-keys';
import type { QueryHookResult } from '@/hooks/types';
import type { DashboardPayload } from '@/types/domain';

/**
 * GET /api/dashboard — preferred initial personalized payload.
 * Uses geo-aligned stale time (visitor-driven aggregate).
 */
export function useDashboard(
	ip?: string
): QueryHookResult<DashboardPayload> {
	const query = useQuery({
		queryKey: queryKeys.dashboard(ip),
		queryFn: () => getDashboard(ip),
		staleTime: QUERY_STALE_GEO_MS,
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
