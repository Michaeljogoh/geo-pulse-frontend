import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/components/providers';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { useUiStore } from '@/store/uiStore';
import { server } from '@/tests/msw/server';
import { apiBase, mockCoin, mockNews, okMeta } from '@/tests/msw/handlers';

vi.mock('next/navigation', () => ({
	useSearchParams: () => new URLSearchParams(),
}));

function Wrapper({ children }: { children: ReactNode }) {
	const client = createQueryClient();
	return createElement(
		QueryClientProvider,
		{ client },
		createElement(AuthProvider, null, children)
	);
}

describe('Dashboard degraded composition (Phase 11)', () => {
	beforeEach(() => {
		useUiStore.setState({ currencyOverride: null, autoRefresh: true });
		vi.clearAllMocks();
	});

	it('keeps the page usable when news fails and other sections succeed', async () => {
		server.use(
			http.get(`${apiBase()}/api/news`, () =>
				HttpResponse.json(
					{
						data: null,
						meta: { ...okMeta, requestId: 'news-fail', provider: 'cryptopanic' },
						error: {
							code: 'UPSTREAM_ERROR',
							message: 'News provider down',
						},
					},
					{ status: 400 }
				)
			)
		);

		render(<Dashboard />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('United States')).toBeTruthy();
		});

		await waitFor(() => {
			expect(screen.getAllByText('Bitcoin').length).toBeGreaterThanOrEqual(1);
		});

		expect(screen.getAllByText('coingecko').length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText('Ethereum')).toBeTruthy();
		expect(screen.getByText('Could not load news')).toBeTruthy();
		expect(screen.getByText('News provider down')).toBeTruthy();
		expect(screen.queryByText(mockNews[0]!.title)).toBeNull();

		// Grid shell still present — page did not blank
		expect(
			document.querySelector('[data-slot="geopulse-dashboard"]')
		).toBeTruthy();
	});

	it('shows a non-blocking degraded notice while still rendering cached data', async () => {
		server.use(
			http.get(`${apiBase()}/api/market`, () =>
				HttpResponse.json({
					data: [{ ...mockCoin, currency: 'usd' }],
					meta: {
						...okMeta,
						source: 'cache-l1',
						cached: true,
						degraded: true,
						provider: 'coingecko',
					},
					error: null,
				})
			)
		);

		render(<MarketOverview />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getAllByText('Bitcoin').length).toBeGreaterThanOrEqual(1);
		});

		expect(
			screen.getByText(/Live data unavailable — showing cached\/last-known/i)
		).toBeTruthy();
		expect(document.querySelector('[data-slot="degraded-notice"]')).toBeTruthy();
	});

	it('shows a global degraded banner when the dashboard aggregate is degraded', async () => {
		server.use(
			http.get(`${apiBase()}/api/dashboard`, () =>
				HttpResponse.json({
					data: {
						visitor: {
							ip: '8.8.8.8',
							country: 'United States',
							countryCode: 'US',
							city: 'Mountain View',
							region: 'California',
							latitude: 37.386,
							longitude: -122.0838,
							timezone: 'America/Los_Angeles',
							currency: 'USD',
							isp: 'Google LLC',
							organization: 'Google Public DNS',
							asn: 'AS15169',
							asnName: 'GOOGLE',
							isProxy: false,
							isHosting: true,
							isMobile: false,
							networkType: 'datacenter',
							confidence: 0.9,
						},
						market: [mockCoin],
						trending: {
							trending: [],
							gainers: [],
							losers: [],
						},
						news: [],
						sections: {
							market: { ok: true, source: 'cache-l1', latencyMs: 10, error: null },
							trending: { ok: false, source: 'fallback', latencyMs: 10, error: 'down' },
							news: { ok: true, source: 'live', latencyMs: 10, error: null },
						},
						degraded: true,
					},
					meta: { ...okMeta, degraded: true, source: 'fallback' },
					error: null,
				})
			)
		);

		render(<Dashboard />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(
				document.querySelector('[data-slot="dashboard-degraded-banner"]')
			).toBeTruthy();
		});

		expect(
			screen.getByText(/cached or degraded upstream data/i)
		).toBeTruthy();
		// Page shell still present
		expect(
			document.querySelector('[data-slot="geopulse-dashboard"]')
		).toBeTruthy();
	});
});
