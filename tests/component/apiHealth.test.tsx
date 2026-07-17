import { QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/components/providers';
import { ApiHealthPanel } from '@/components/dashboard/ApiHealthPanel';
import { QUERY_REFETCH_STATUS_MS } from '@/config/constants';
import { formatLatency } from '@/lib/format';
import { server } from '@/tests/msw/server';
import { apiBase, mockStatus, okMeta } from '@/tests/msw/handlers';

function Wrapper({ children }: { children: ReactNode }) {
	const client = createQueryClient();
	return createElement(QueryClientProvider, { client }, children);
}

describe('ApiHealthPanel (Phase 10)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders provider rows with circuit colors, latency, cache, and uptime', async () => {
		render(<ApiHealthPanel />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('coingecko')).toBeTruthy();
		});

		expect(screen.getByText('closed')).toBeTruthy();
		expect(screen.getByText(formatLatency(40))).toBeTruthy();
		expect(screen.getByText('50%')).toBeTruthy();
		expect(screen.getByText('3')).toBeTruthy();
		expect(screen.getByText('2m')).toBeTruthy();

		const row = screen
			.getByText('coingecko')
			.closest('[data-slot="provider-row"]');
		expect(row?.getAttribute('data-state')).toBe('closed');
		const dot = row?.querySelector('[data-slot="circuit-dot"]');
		expect(dot?.className).toContain('bg-gain');
	});

	it('shows warning state for open / half_open providers', async () => {
		server.use(
			http.get(`${apiBase()}/api/status`, () =>
				HttpResponse.json({
					data: {
						providers: [
							{
								...mockStatus.providers[0]!,
								provider: 'cryptopanic',
								state: 'open',
								avgLatencyMs: 900,
							},
							{
								...mockStatus.providers[0]!,
								provider: 'ipapi',
								state: 'half_open',
								avgLatencyMs: 120,
							},
						],
						cache: { l1Keys: 1, hitRatio: 0.1 },
						uptimeSeconds: 45,
					},
					meta: { ...okMeta },
					error: null,
				})
			)
		);

		render(<ApiHealthPanel />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(
				document.querySelector('[data-slot="provider-row"][data-state="open"]')
			).toBeTruthy();
		});

		expect(
			document.querySelector('[data-slot="provider-row"][data-state="half_open"]')
		).toBeTruthy();
		expect(document.querySelector('[data-slot="degraded-warning"]')).toBeTruthy();
		expect(screen.getByText(/providers are degraded/i)).toBeTruthy();

		const openRow = document.querySelector(
			'[data-slot="provider-row"][data-state="open"]'
		);
		expect(openRow?.textContent).toContain('cryptopanic');
		expect(
			openRow?.querySelector('[data-slot="circuit-dot"]')?.className
		).toContain('bg-loss');

		const halfRow = document.querySelector(
			'[data-slot="provider-row"][data-state="half_open"]'
		);
		expect(halfRow?.textContent).toContain('ipapi');
		expect(
			halfRow?.querySelector('[data-slot="circuit-dot"]')?.className
		).toContain('bg-warning');

		expect(screen.getByText('45s')).toBeTruthy();
		expect(screen.getByText('10%')).toBeTruthy();
	});

	it('auto-refreshes on the status interval', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		let hits = 0;

		server.use(
			http.get(`${apiBase()}/api/status`, () => {
				hits += 1;
				return HttpResponse.json({
					data: {
						...mockStatus,
						uptimeSeconds: 100 + hits,
						cache: { l1Keys: hits, hitRatio: 0.5 },
					},
					meta: { ...okMeta, requestId: `status-${hits}` },
					error: null,
				});
			})
		);

		render(<ApiHealthPanel />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('coingecko')).toBeTruthy();
		});
		expect(hits).toBe(1);

		await act(async () => {
			await vi.advanceTimersByTimeAsync(QUERY_REFETCH_STATUS_MS + 50);
		});

		await waitFor(() => expect(hits).toBeGreaterThanOrEqual(2));
	});
});
