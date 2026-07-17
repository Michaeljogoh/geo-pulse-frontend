import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/components/providers';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { AppShell } from '@/components/app-shell';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { SkipToContent } from '@/components/common/SkipToContent';
import { useUiStore } from '@/store/uiStore';

vi.mock('@/lib/firebase', () => ({
	getFirebaseAuth: () => {
		throw new Error('Firebase disabled in a11y tests');
	},
}));

vi.mock('next/navigation', () => ({
	useSearchParams: () => new URLSearchParams(),
	usePathname: () => '/dashboard',
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
	}),
}));

vi.mock('next/image', () => ({
	default: (props: { alt?: string; src?: string }) =>
		createElement('img', { alt: props.alt ?? '', src: props.src }),
}));

function Wrapper({ children }: { children: ReactNode }) {
	const client = createQueryClient();
	return createElement(
		QueryClientProvider,
		{ client },
		createElement(AuthProvider, null, children)
	);
}

describe('a11y smoke', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	});

	it('exposes a skip link to main content', () => {
		render(<SkipToContent />);
		const link = screen.getByRole('link', { name: /skip to content/i });
		expect(link.getAttribute('href')).toBe('#main-content');
	});

	it('AppShell provides main landmark and skip link', () => {
		render(
			<AppShell>
				<p>Child</p>
			</AppShell>,
			{ wrapper: Wrapper }
		);

		expect(screen.getByRole('link', { name: /skip to content/i })).toBeTruthy();
		const main = document.getElementById('main-content');
		expect(main).toBeTruthy();
		expect(main?.tagName).toBe('MAIN');
	});

	it('Dashboard uses a single page heading', () => {
		useUiStore.setState({ currencyOverride: null, autoRefresh: true });
		render(<Dashboard />, { wrapper: Wrapper });
		expect(
			screen.getByRole('heading', { level: 1, name: 'Overview' })
		).toBeTruthy();
	});

	it('live price regions expose aria-live polite', async () => {
		useUiStore.setState({ currencyOverride: null, autoRefresh: true });
		render(<Dashboard />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getAllByText('Bitcoin').length).toBeGreaterThanOrEqual(1);
		});

		const liveRegions = document.querySelectorAll('[aria-live="polite"]');
		expect(liveRegions.length).toBeGreaterThanOrEqual(1);
	});
});
