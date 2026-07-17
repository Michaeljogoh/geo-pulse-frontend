import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthHeaderControls } from '@/components/auth/AuthHeaderControls';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { createQueryClient } from '@/components/providers';
import { apiGetAuth, setAuthTokenProvider } from '@/lib/api/client';
import { getMe } from '@/lib/api/endpoints';
import { mockAuthUser } from '@/tests/msw/handlers';

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
	uid: 'firebase-uid-1',
	email: 'ada@example.com',
	displayName: 'Ada Lovelace',
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
	browserLocalPersistence: { type: 'LOCAL' },
	browserSessionPersistence: { type: 'SESSION' },
	setPersistence: async () => {},
	createUserWithEmailAndPassword: async () => {
		emitAuth(mockUser);
		return { user: mockUser };
	},
	updateProfile: async () => {},
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

vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
		loading: vi.fn(() => 't'),
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

describe('Auth', () => {
	beforeEach(() => {
		currentUser = null;
		authListeners.clear();
		setAuthTokenProvider(null);
		vi.clearAllMocks();
	});

	it('renders nothing when anonymous', async () => {
		const { container } = render(<AuthHeaderControls />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(screen.queryByRole('button', { name: /sign in/i })).toBeNull();
		});
		expect(container.querySelector('[aria-label="Loading account"]')).toBeNull();
	});

	it('when signed in shows UserMenu and GET /api/me with Bearer token', async () => {
		emitAuth(mockUser);
		render(<AuthHeaderControls />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(
				screen.getByRole('button', { name: /ada lovelace account menu/i })
			).toBeTruthy();
		});

		const me = await getMe();
		expect(me.data.uid).toBe(mockAuthUser.uid);
		expect(me.data.email).toBe(mockAuthUser.email);
	});

	it('sign-out clears the header auth slot', async () => {
		const user = userEvent.setup();
		emitAuth(mockUser);

		render(<AuthHeaderControls />, { wrapper: Wrapper });

		await waitFor(() => {
			expect(
				screen.getByRole('button', { name: /ada lovelace account menu/i })
			).toBeTruthy();
		});

		await user.click(
			screen.getByRole('button', { name: /ada lovelace account menu/i })
		);
		await user.click(await screen.findByRole('menuitem', { name: /sign out/i }));

		await waitFor(() => {
			expect(screen.queryByRole('button', { name: /sign in/i })).toBeNull();
			expect(
				screen.queryByRole('button', { name: /account menu/i })
			).toBeNull();
		});
	});

	it('authed API calls without a token throw UNAUTHENTICATED', async () => {
		setAuthTokenProvider(null);
		await expect(apiGetAuth('/api/me')).rejects.toMatchObject({
			code: 'UNAUTHENTICATED',
		});
	});
});
