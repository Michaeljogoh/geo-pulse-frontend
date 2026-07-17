import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/components/providers';
import { GainersLosers } from '@/components/dashboard/GainersLosers';
import { TrendingPanel } from '@/components/dashboard/TrendingPanel';
import { formatPercent } from '@/lib/format';
import { useUiStore } from '@/store/uiStore';
import { server } from '@/tests/msw/server';
import { apiBase, okMeta } from '@/tests/msw/handlers';

function Wrapper({ children }: { children: ReactNode }) {
	const client = createQueryClient();
	return createElement(QueryClientProvider, { client }, children);
}

describe('Trending & Gainers/Losers (Phase 8)', () => {
	beforeEach(() => {
		useUiStore.setState({ currencyOverride: null, autoRefresh: true });
		vi.clearAllMocks();
	});

	it('renders trending coins with rank', async () => {
		render(<TrendingPanel />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('Bitcoin')).toBeTruthy();
		});

		expect(screen.getByText('BTC')).toBeTruthy();
		expect(screen.getByText('#1')).toBeTruthy();
	});

	it('renders gainers and losers with color-coded %', async () => {
		render(<GainersLosers />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('Gainers')).toBeTruthy();
		});

		expect(screen.getByText('Losers')).toBeTruthy();
		expect(screen.getByText('Ethereum')).toBeTruthy();

		const gainerPct = screen.getByText(formatPercent(8));
		expect(gainerPct.className).toContain('text-gain');

		const loserPct = screen.getByText(formatPercent(-3));
		expect(loserPct.className).toContain('text-loss');
	});

	it('shows EmptyState for empty trending', async () => {
		server.use(
			http.get(`${apiBase()}/api/trending`, () =>
				HttpResponse.json({
					data: { trending: [], gainers: [], losers: [] },
					meta: { ...okMeta, provider: 'coingecko' },
					error: null,
				})
			)
		);

		render(<TrendingPanel />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('No trending coins')).toBeTruthy();
		});
	});

	it('shows EmptyState for empty gainers and losers', async () => {
		server.use(
			http.get(`${apiBase()}/api/trending`, () =>
				HttpResponse.json({
					data: { trending: [], gainers: [], losers: [] },
					meta: { ...okMeta, provider: 'coingecko' },
					error: null,
				})
			)
		);

		render(<GainersLosers />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('No gainers')).toBeTruthy();
			expect(screen.getByText('No losers')).toBeTruthy();
		});
	});
});
