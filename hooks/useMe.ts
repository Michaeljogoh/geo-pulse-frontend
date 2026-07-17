'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/query-keys';
import type { QueryHookResult } from '@/hooks/types';
import { useAuth } from '@/hooks/useAuth';
import { getMe } from '@/lib/api/endpoints';
import type { AuthUser } from '@/types/domain';

/** GET /api/me — enabled only when Firebase session is authed. */
export function useMe(): QueryHookResult<AuthUser> {
	const { status } = useAuth();

	const query = useQuery({
		queryKey: queryKeys.me,
		queryFn: () => getMe(),
		enabled: status === 'authed',
		staleTime: 60_000,
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
