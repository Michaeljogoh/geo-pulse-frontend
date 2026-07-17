import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/components/auth/AuthProvider';
import { WatchlistPanel } from '@/components/dashboard/WatchlistPanel';
import { createQueryClient } from '@/components/providers';
import { useUiStore } from '@/store/uiStore';
import { server } from '@/tests/msw/server';
import {
	apiBase,
	mockAuthUser,
	mockCoin,
	okMeta,
	resetWatchlistStore,
} from '@/tests/msw/handlers';

type MockUser = {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
	getIdToken: () => Promise<string>;
};

const authListeners = new Set<(user: MockUser | null) => void>();
let currentUser: MockUser | null = null;

function emitAuth(user: MockUser | null) {
	currentUser = user;
	authListeners.forEach((listener) => listener(user));
}

const mockUser: MockUser = {
	uid: mockAuthUser.uid,
	email: mockAuthUser.email,
	displayName: mockAuthUser.name,
	photoURL: null,
	getIdToken: async () => 'test-id-token',
};

vi.mock('@/lib/firebase', () => ({
	getFirebaseAuth: () => ({
		get currentUser() {
			return currentUser;
		},
	}),
}));

vi.mock('firebase/auth', () => ({
	GoogleAuthProvider: class GoogleAuthProvider {},
	onAuthStateChanged: (
		_auth: unknown,
		callback: (user: MockUser | null) => void
	) => {
		authListeners.add(callback);
		callback(currentUser);
		return () => {
			authListeners.delete(callback);
		};
	},
	signInWithPopup: async () => {
		emitAuth(mockUser);
		return { user: mockUser };
	},
	signInWithEmailAndPassword: async () => {
		emitAuth(mockUser);
		return { user: mockUser };
	},
	signOut: async () => {
		emitAuth(null);
	},
}));

const toastError = vi.fn((_message?: string) => undefined);

vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: (message: string) => toastError(message),
		loading: vi.fn(() => 't'),
	},
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

describe('WatchlistPanel', () => {
	beforeEach(() => {
		currentUser = null;
		authListeners.clear();
		resetWatchlistStore();
		useUiStore.setState({ currencyOverride: null, autoRefresh: true });
		toastError.mockClear();
	});

	it('shows gated sign-in state for anonymous users', async () => {
		render(<WatchlistPanel />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(
				document.querySelector('[data-slot="watchlist-gate"]')
			).toBeTruthy();
		});
		expect(
			screen.getByRole('button', { name: /sign in to track coins/i })
		).toBeTruthy();
	});

	it('authed user can add and remove coins with optimistic UI', async () => {
		const user = userEvent.setup();
		emitAuth(mockUser);

		render(<WatchlistPanel />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByLabelText(/add coin/i)).toBeTruthy();
		});

		await user.type(screen.getByLabelText(/add coin/i), 'bitcoin');
		await user.click(screen.getByRole('button', { name: /^add$/i }));

		await waitFor(() => {
			expect(screen.getByText('Bitcoin')).toBeTruthy();
		});
		expect(screen.getByText(/BTC/i)).toBeTruthy();

		await user.click(
			screen.getByRole('button', { name: /remove bitcoin from watchlist/i })
		);

		await waitFor(() => {
			expect(screen.getByText('No coins yet')).toBeTruthy();
		});
	});

	it('renders price unavailable for available:false items', async () => {
		emitAuth(mockUser);
		resetWatchlistStore([
			{
				coinId: 'obscure-coin',
				available: false,
				coin: null,
				addedAt: new Date().toISOString(),
			},
		]);

		render(<WatchlistPanel />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('obscure-coin')).toBeTruthy();
		});
		expect(screen.getByText('Price unavailable')).toBeTruthy();
	});

	it('rolls back optimistic add and toasts on cap-exceeded error', async () => {
		const user = userEvent.setup();
		emitAuth(mockUser);
		resetWatchlistStore([
			{
				coinId: 'bitcoin',
				available: true,
				coin: mockCoin,
				addedAt: new Date().toISOString(),
			},
		]);

		server.use(
			http.put(`${apiBase()}/api/watchlist/:coinId`, () =>
				HttpResponse.json(
					{
						data: null,
						meta: { ...okMeta, requestId: 'cap' },
						error: {
							code: 'VALIDATION_ERROR',
							message: 'Watchlist cap exceeded (max 50 coins)',
						},
					},
					{ status: 400 }
				)
			)
		);

		render(<WatchlistPanel />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.getByText('Bitcoin')).toBeTruthy();
		});

		await user.type(screen.getByLabelText(/add coin/i), 'solana');
		await user.click(screen.getByRole('button', { name: /^add$/i }));

		await waitFor(() => {
			expect(toastError).toHaveBeenCalled();
		});

		expect(screen.queryByText('solana')).toBeNull();
		expect(screen.getByText('Bitcoin')).toBeTruthy();
	});
});
