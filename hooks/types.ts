import type { ResponseMeta } from '@/types/envelope';

/** Shared shape returned by data hooks. */
export type QueryHookResult<T> = {
	data: T | undefined;
	meta: ResponseMeta | undefined;
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
	isFetching: boolean;
	refetch: () => Promise<unknown>;
};
