import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/components/providers';
import { VisitorIntelligenceCard } from '@/components/dashboard/VisitorIntelligenceCard';
import { server } from '@/tests/msw/server';
import { apiBase, mockIpIntelligence } from '@/tests/msw/handlers';
import { http, HttpResponse } from 'msw';

vi.mock('next/navigation', () => ({
	useSearchParams: () => new URLSearchParams(),
}));

function Wrapper({ children }: { children: ReactNode }) {
	const client = createQueryClient();
	return createElement(QueryClientProvider, { client }, children);
}

describe('VisitorIntelligenceCard (Phase 6)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders geo fields, network badge, confidence, and latency', async () => {
		render(<VisitorIntelligenceCard />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('United States')).toBeTruthy();
		});

		expect(screen.getByText(/Mountain View · California/)).toBeTruthy();
		expect(screen.getByText('Datacenter')).toBeTruthy();
		expect(screen.getByText('90%')).toBeTruthy();
		expect(screen.getByText(/90% conf/)).toBeTruthy();
		expect(screen.getByText('AS15169')).toBeTruthy();
		expect(screen.getByText('live')).toBeTruthy();
		expect(screen.getByText('ipapi')).toBeTruthy();
		expect(screen.getByText('12 ms')).toBeTruthy();
		expect(screen.getByText(mockIpIntelligence.ip)).toBeTruthy();
	});

	it('shows Unknown for null fields', async () => {
		server.use(
			http.get(`${apiBase()}/api/geo`, () =>
				HttpResponse.json({
					data: {
						...mockIpIntelligence,
						city: null,
						region: null,
						isp: null,
						organization: null,
						asnName: null,
					},
					meta: {
						requestId: 'null-fields',
						source: 'live',
						latencyMs: 8,
						cached: false,
						provider: 'ipapi',
						confidence: 0.5,
					},
					error: null,
				})
			)
		);

		render(<VisitorIntelligenceCard />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('United States')).toBeTruthy();
		});

		const unknowns = screen.getAllByText('Unknown');
		expect(unknowns.length).toBeGreaterThanOrEqual(2);
	});

	it('shows Proxy / VPN badge for proxy_vpn networkType', async () => {
		server.use(
			http.get(`${apiBase()}/api/geo`, () =>
				HttpResponse.json({
					data: {
						...mockIpIntelligence,
						isProxy: true,
						isHosting: false,
						networkType: 'proxy_vpn',
					},
					meta: {
						requestId: 'vpn',
						source: 'live',
						latencyMs: 20,
						cached: false,
						provider: 'ipapi',
						confidence: 0.8,
					},
					error: null,
				})
			)
		);

		render(<VisitorIntelligenceCard />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('Proxy / VPN')).toBeTruthy();
		});
	});
});
