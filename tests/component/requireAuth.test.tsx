import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RequireAuth } from '@/components/auth/RequireAuth';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { createQueryClient } from '@/components/providers';
import { safeAuthNextPath } from '@/lib/auth-session-cookie';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
	usePathname: () => '/dashboard/market',
	useRouter: () => ({
		replace,
		push: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
	}),
}));

vi.mock('@/lib/firebase', () => ({
	getFirebaseAuth: () => {
		throw new Error('Firebase disabled in RequireAuth tests');
	},
}));

function Wrapper({ children }: { children: ReactNode }) {
	const client = createQueryClient();
	return createElement(
		QueryClientProvider,
		{ client },
		createElement(AuthProvider, null, children)
	);
}

describe('safeAuthNextPath', () => {
	it('defaults and rejects open redirects', () => {
		expect(safeAuthNextPath(null)).toBe('/dashboard');
		expect(safeAuthNextPath('https://evil.com')).toBe('/dashboard');
		expect(safeAuthNextPath('//evil.com')).toBe('/dashboard');
		expect(safeAuthNextPath('/sign-in')).toBe('/dashboard');
		expect(safeAuthNextPath('/dashboard/market')).toBe('/dashboard/market');
	});
});

describe('RequireAuth', () => {
	beforeEach(() => {
		replace.mockClear();
		document.cookie = 'gp_auth=; Path=/; Max-Age=0';
	});

	it('redirects anonymous users to sign-in with next', async () => {
		render(
			<RequireAuth>
				<p>Secret dashboard</p>
			</RequireAuth>,
			{ wrapper: Wrapper }
		);

		await waitFor(() => {
			expect(replace).toHaveBeenCalledWith(
				'/sign-in?next=%2Fdashboard%2Fmarket'
			);
		});

		expect(screen.queryByText('Secret dashboard')).toBeNull();
	});
});
