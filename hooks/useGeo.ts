'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_STALE_GEO_MS } from '@/config/constants';
import { getGeo } from '@/lib/api/endpoints';
import { queryKeys } from '@/hooks/query-keys';
import type { QueryHookResult } from '@/hooks/types';
import type { IpIntelligence } from '@/types/domain';

/** GET /api/geo — visitor IP intelligence. */
export function useGeo(ip?: string): QueryHookResult<IpIntelligence> {
	const query = useQuery({
		queryKey: queryKeys.geo(ip),
		queryFn: () => getGeo(ip),
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
