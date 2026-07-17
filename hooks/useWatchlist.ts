'use client';

import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryKeys } from '@/hooks/query-keys';
import type { QueryHookResult } from '@/hooks/types';
import { useAuth } from '@/hooks/useAuth';
import { ApiClientError, type ApiSuccess } from '@/lib/api/client';
import {
	addWatchlist,
	getWatchlist,
	removeWatchlist,
} from '@/lib/api/endpoints';
import type { WatchlistItem } from '@/types/domain';

type WatchlistQueryData = ApiSuccess<WatchlistItem[]>;

function mutationErrorMessage(error: unknown): string {
	if (error instanceof ApiClientError) {
		if (/cap|limit|50/i.test(error.message)) {
			return error.message;
		}
		return error.message;
	}
	if (error instanceof Error) return error.message;
	return 'Watchlist update failed';
}

/** Authed watchlist query + optimistic add/remove. */
export function useWatchlist(vs: string): QueryHookResult<WatchlistItem[]> & {
	watchedIds: Set<string>;
	addCoin: (coinId: string) => Promise<void>;
	removeCoin: (coinId: string) => Promise<void>;
	isMutating: boolean;
} {
	const { status } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = queryKeys.watchlist(vs);

	const query = useQuery({
		queryKey,
		queryFn: () => getWatchlist(vs),
		enabled: status === 'authed',
		staleTime: 30_000,
	});

	const invalidateWatchlists = () =>
		queryClient.invalidateQueries({ queryKey: ['watchlist'] });

	const addMutation = useMutation({
		mutationFn: (coinId: string) => addWatchlist(coinId),
		onMutate: async (coinId) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<WatchlistQueryData>(queryKey);

			queryClient.setQueryData<WatchlistQueryData>(queryKey, (current) => {
				const existing = current?.data ?? previous?.data ?? [];
				if (existing.some((item) => item.coinId === coinId)) {
					return current ?? previous;
				}
				const optimistic: WatchlistItem = {
					coinId,
					available: false,
					coin: null,
					addedAt: new Date().toISOString(),
				};
				return {
					data: [...existing, optimistic],
					meta: current?.meta ??
						previous?.meta ?? {
							requestId: 'optimistic',
							source: 'live',
							latencyMs: 0,
							cached: false,
						},
				};
			});

			return { previous };
		},
		onError: (error, _coinId, context) => {
			if (context?.previous !== undefined) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			toast.error(mutationErrorMessage(error));
		},
		onSuccess: (result) => {
			queryClient.setQueryData(queryKey, result);
		},
		onSettled: () => {
			void invalidateWatchlists();
		},
	});

	const removeMutation = useMutation({
		mutationFn: (coinId: string) => removeWatchlist(coinId),
		onMutate: async (coinId) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<WatchlistQueryData>(queryKey);

			queryClient.setQueryData<WatchlistQueryData>(queryKey, (current) => {
				const existing = current?.data ?? previous?.data ?? [];
				return {
					data: existing.filter((item) => item.coinId !== coinId),
					meta: current?.meta ??
						previous?.meta ?? {
							requestId: 'optimistic',
							source: 'live',
							latencyMs: 0,
							cached: false,
						},
				};
			});

			return { previous };
		},
		onError: (error, _coinId, context) => {
			if (context?.previous !== undefined) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			toast.error(mutationErrorMessage(error));
		},
		onSuccess: (result) => {
			queryClient.setQueryData(queryKey, result);
		},
		onSettled: () => {
			void invalidateWatchlists();
		},
	});

	const items = query.data?.data ?? [];
	const watchedIds = new Set(items.map((item) => item.coinId));

	return {
		data: query.data?.data,
		meta: query.data?.meta,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		isFetching: query.isFetching,
		refetch: () => query.refetch(),
		watchedIds,
		addCoin: async (coinId: string) => {
			await addMutation.mutateAsync(coinId.trim().toLowerCase());
		},
		removeCoin: async (coinId: string) => {
			await removeMutation.mutateAsync(coinId.trim().toLowerCase());
		},
		isMutating: addMutation.isPending || removeMutation.isPending,
	};
}
