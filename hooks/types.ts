import type { ResponseMeta } from '@/types/envelope';

/** Shared shape returned by Phase 3 data hooks. */
export type QueryHookResult<T> = {
	data: T | undefined;
	meta: ResponseMeta | undefined;
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
	isFetching: boolean;
	refetch: () => Promise<unknown>;
};
