import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react';
import { type ReactNode, createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/components/providers';
import { QUERY_REFETCH_MARKET_MS } from '@/config/constants';
import { ApiClientError } from '@/lib/api/client';
import { useGeo } from '@/hooks/useGeo';
import { useMarket } from '@/hooks/useMarket';
import { useDashboard } from '@/hooks/useDashboard';
import { useStatus } from '@/hooks/useStatus';
import { useUiStore } from '@/store/uiStore';
import { server } from '@/tests/msw/server';
import { apiBase, mockCoin } from '@/tests/msw/handlers';
import { http, HttpResponse } from 'msw';

function createWrapper() {
	const client = createQueryClient();
	return function Wrapper({ children }: { children: ReactNode }) {
		return createElement(QueryClientProvider, { client }, children);
	};
}

describe('Phase 3 query hooks', () => {
	beforeEach(() => {
		useUiStore.setState({ currencyOverride: null, autoRefresh: true });
		vi.useRealTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('useGeo fetches via the typed API client', async () => {
		const { result } = renderHook(() => useGeo('8.8.8.8'), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.isError).toBe(false);
		expect(result.current.data?.ip).toBe('8.8.8.8');
		expect(result.current.meta?.requestId).toBe('test-request-id');
	});

	it('useDashboard returns personalized payload', async () => {
		const { result } = renderHook(() => useDashboard(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.data).toBeDefined());
		expect(result.current.data?.visitor.currency).toBe('USD');
		expect(result.current.data?.market[0]?.id).toBe(mockCoin.id);
	});

	it('useStatus returns provider health', async () => {
		const { result } = renderHook(() => useStatus(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.data).toBeDefined());
		expect(result.current.data?.providers[0]?.provider).toBe('coingecko');
		expect(result.current.data?.cache.l1Keys).toBe(3);
	});

	it('useMarket auto-refetches on interval when autoRefresh is on', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		let marketHits = 0;

		server.use(
			http.get(`${apiBase()}/api/market`, () => {
				marketHits += 1;
				return HttpResponse.json({
					data: [{ ...mockCoin, currentPrice: 65000 + marketHits }],
					meta: {
						requestId: `market-${marketHits}`,
						source: 'live',
						latencyMs: 5,
						cached: false,
						provider: 'coingecko',
					},
					error: null,
				});
			})
		);

		const { result } = renderHook(() => useMarket('usd', 20), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.data).toBeDefined());
		expect(marketHits).toBe(1);

		await act(async () => {
			await vi.advanceTimersByTimeAsync(QUERY_REFETCH_MARKET_MS + 50);
		});

		await waitFor(() => expect(marketHits).toBeGreaterThanOrEqual(2));
	});

	it('does not retry on 4xx ApiClientError', async () => {
		let hits = 0;
		server.use(
			http.get(`${apiBase()}/api/geo`, () => {
				hits += 1;
				return HttpResponse.json(
					{
						data: null,
						meta: {
							requestId: 'val-1',
							source: 'live',
							latencyMs: 1,
							cached: false,
						},
						error: {
							code: 'VALIDATION_ERROR',
							message: 'Invalid IP',
						},
					},
					{ status: 400 }
				);
			})
		);

		const { result } = renderHook(() => useGeo('bad'), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(hits).toBe(1);
		expect(result.current.error).toBeInstanceOf(ApiClientError);
		expect((result.current.error as ApiClientError).code).toBe(
			'VALIDATION_ERROR'
		);
		expect((result.current.error as ApiClientError).status).toBe(400);
	});
});
