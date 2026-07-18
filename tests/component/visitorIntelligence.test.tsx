import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('VisitorIntelligenceCard', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('hides sensitive fields by default and shows core geo details', async () => {
		render(<VisitorIntelligenceCard />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('United States')).toBeTruthy();
		});

		expect(screen.getByText(/Mountain View · California/)).toBeTruthy();
		expect(screen.getByText('Datacenter')).toBeTruthy();
		expect(screen.getByText('90%')).toBeTruthy();
		expect(screen.getByText(/90% conf/)).toBeTruthy();
		expect(screen.getByText(mockIpIntelligence.timezone!)).toBeTruthy();
		expect(screen.getByText(mockIpIntelligence.currency!)).toBeTruthy();
		expect(screen.getByText(mockIpIntelligence.isp!)).toBeTruthy();
		expect(screen.queryByText(mockIpIntelligence.ip)).toBeNull();
		expect(screen.queryByText('AS15169')).toBeNull();
		expect(
			screen.getByText(/IP, ASN, and coordinates stay hidden by default/i)
		).toBeTruthy();
		expect(
			screen.getByRole('button', { name: 'Show sensitive details' })
		).toBeTruthy();
		expect(screen.getByText('live')).toBeTruthy();
		expect(screen.getByText('ipapi')).toBeTruthy();
		expect(screen.getByText('12 ms')).toBeTruthy();
	});

	it('reveals sensitive fields when the eye toggle is pressed', async () => {
		const user = userEvent.setup();
		render(<VisitorIntelligenceCard />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('United States')).toBeTruthy();
		});

		await user.click(
			screen.getByRole('button', { name: 'Show sensitive details' })
		);

		expect(screen.getByText(mockIpIntelligence.ip)).toBeTruthy();
		expect(screen.getByText('AS15169')).toBeTruthy();
		expect(
			screen.getByText(/Sensitive details are visible/i)
		).toBeTruthy();
		expect(
			screen.getByRole('button', { name: 'Hide sensitive details' })
		).toBeTruthy();
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

		expect(screen.getByText(/Unknown · Unknown/)).toBeTruthy();
		expect(screen.getByText('Unknown')).toBeTruthy();
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
