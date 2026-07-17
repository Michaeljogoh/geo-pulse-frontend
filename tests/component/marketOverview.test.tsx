import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/components/providers';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { formatCurrency, formatPercent } from '@/lib/format';
import { useUiStore } from '@/store/uiStore';
import { server } from '@/tests/msw/server';
import { apiBase, mockCoin, okMeta } from '@/tests/msw/handlers';

function Wrapper({ children }: { children: ReactNode }) {
	const client = createQueryClient();
	return createElement(
		QueryClientProvider,
		{ client },
		createElement(AuthProvider, null, children)
	);
}

describe('MarketOverview', () => {
	beforeEach(() => {
		useUiStore.setState({ currencyOverride: null, autoRefresh: true });
		vi.clearAllMocks();
	});

	it('renders coins in effective currency with color-coded 24h %', async () => {
		render(<MarketOverview />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('Bitcoin')).toBeTruthy();
		});

		expect(screen.getByText('BTC')).toBeTruthy();
		expect(
			screen.getByText(formatCurrency(mockCoin.currentPrice, 'USD'))
		).toBeTruthy();
		expect(
			screen.getByText(formatPercent(mockCoin.priceChangePct24h!))
		).toBeTruthy();
		expect(screen.getByText('USD')).toBeTruthy();

		const pct = screen.getByText(formatPercent(mockCoin.priceChangePct24h!));
		expect(pct.className).toContain('text-gain');
	});

	it('shows skeleton on first load', async () => {
		server.use(
			http.get(`${apiBase()}/api/market`, async () => {
				await delay(80);
				return HttpResponse.json({
					data: [mockCoin],
					meta: { ...okMeta, provider: 'coingecko' },
					error: null,
				});
			})
		);

		const { container } = render(<MarketOverview />, { wrapper: Wrapper });

		expect(
			container.querySelector('[data-slot="section-skeleton"]')
		).toBeTruthy();

		await waitFor(() => {
			expect(screen.getByText('Bitcoin')).toBeTruthy();
		});
	});

	it('refetches when currency override changes', async () => {
		const vsSeen: string[] = [];

		server.use(
			http.get(`${apiBase()}/api/market`, ({ request }) => {
				const url = new URL(request.url);
				const vs = (url.searchParams.get('vs') ?? 'usd').toLowerCase();
				vsSeen.push(vs);
				const price = vs === 'eur' ? 60_000 : 65_000;
				return HttpResponse.json({
					data: [
						{
							...mockCoin,
							currency: vs,
							currentPrice: price,
							priceChangePct24h: vs === 'eur' ? -1.5 : 1.25,
						},
					],
					meta: { ...okMeta, provider: 'coingecko' },
					error: null,
				});
			})
		);

		render(<MarketOverview />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('Bitcoin')).toBeTruthy();
		});
		expect(screen.getByText(formatCurrency(65_000, 'USD'))).toBeTruthy();

		useUiStore.getState().setCurrencyOverride('eur');

		await waitFor(() => {
			expect(screen.getByText(formatCurrency(60_000, 'EUR'))).toBeTruthy();
		});
		expect(screen.getByText('EUR')).toBeTruthy();
		expect(screen.getByText(formatPercent(-1.5)).className).toContain(
			'text-loss'
		);
		expect(vsSeen.some((v) => v === 'eur')).toBe(true);
	});

	it('stops market interval when autoRefresh is disabled', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		let marketHits = 0;

		server.use(
			http.get(`${apiBase()}/api/market`, () => {
				marketHits += 1;
				return HttpResponse.json({
					data: [{ ...mockCoin, currentPrice: 65_000 + marketHits }],
					meta: { ...okMeta, requestId: `m-${marketHits}`, provider: 'coingecko' },
					error: null,
				});
			})
		);

		useUiStore.setState({ autoRefresh: false });

		render(<MarketOverview />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('Bitcoin')).toBeTruthy();
		});
		const hitsAfterLoad = marketHits;

		await vi.advanceTimersByTimeAsync(120_000);
		expect(marketHits).toBe(hitsAfterLoad);

		vi.useRealTimers();
	});
});
