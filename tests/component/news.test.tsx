import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/components/providers';
import { NewsFeed } from '@/components/dashboard/NewsFeed';
import { useUiStore } from '@/store/uiStore';
import { server } from '@/tests/msw/server';
import { apiBase, mockNews, okMeta } from '@/tests/msw/handlers';

function Wrapper({ children }: { children: ReactNode }) {
	const client = createQueryClient();
	return createElement(QueryClientProvider, { client }, children);
}

describe('NewsFeed (Phase 9)', () => {
	beforeEach(() => {
		useUiStore.setState({ currencyOverride: null, autoRefresh: true });
		vi.clearAllMocks();
	});

	it('renders news with source, relative time, and sentiment', async () => {
		render(<NewsFeed />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText(mockNews[0]!.title)).toBeTruthy();
		});

		const link = screen.getByRole('link', {
			name: new RegExp(mockNews[0]!.title, 'i'),
		});
		expect(link.getAttribute('href')).toBe(mockNews[0]!.url);
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.getAttribute('rel')).toContain('noopener');

		expect(screen.getByText('TestWire')).toBeTruthy();
		expect(screen.getByText(/ago|just now|minute|second|hour/i)).toBeTruthy();
		expect(screen.getByText('neutral')).toBeTruthy();
	});

	it('handles missing image as text-only card', async () => {
		render(<NewsFeed />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText(mockNews[0]!.title)).toBeTruthy();
		});

		const card = screen.getByText(mockNews[0]!.title).closest('[data-slot="news-card"]');
		expect(card).toBeTruthy();
		expect(card!.querySelector('img')).toBeNull();
	});

	it('shows sentiment badge when present and omits when null', async () => {
		server.use(
			http.get(`${apiBase()}/api/news`, () =>
				HttpResponse.json({
					data: [
						{
							title: 'Bullish move',
							url: 'https://example.com/bull',
							source: 'WireA',
							publishedAt: new Date().toISOString(),
							sentiment: 'positive',
							imageUrl: 'https://example.com/img.png',
						},
						{
							title: 'No sentiment story',
							url: 'https://example.com/plain',
							source: 'WireB',
							publishedAt: new Date().toISOString(),
							sentiment: null,
							imageUrl: null,
						},
					],
					meta: { ...okMeta, provider: 'cryptopanic' },
					error: null,
				})
			)
		);

		render(<NewsFeed />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('Bullish move')).toBeTruthy();
		});

		expect(screen.getByText('positive')).toBeTruthy();
		expect(screen.queryByText('negative')).toBeNull();
		expect(screen.getByText('No sentiment story')).toBeTruthy();

		const withImage = screen
			.getByText('Bullish move')
			.closest('[data-slot="news-card"]');
		expect(withImage?.querySelector('img')).toBeTruthy();
	});

	it('shows EmptyState when there are no results', async () => {
		server.use(
			http.get(`${apiBase()}/api/news`, () =>
				HttpResponse.json({
					data: [],
					meta: { ...okMeta, provider: 'cryptopanic' },
					error: null,
				})
			)
		);

		render(<NewsFeed />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('No local news')).toBeTruthy();
		});
	});
});
