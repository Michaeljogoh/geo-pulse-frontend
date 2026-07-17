'use client';

import {
	createContext,
	useContext,
	useMemo,
	type ReactNode,
} from 'react';

export type AuthStatus = 'loading' | 'authed' | 'anon';

export type AuthContextValue = {
	user: null;
	status: AuthStatus;
	signInWithGoogle: () => Promise<void>;
	signInWithEmail: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Phase 14 — scaffold (Section 7).
 * Wires Firebase onAuthStateChanged + setAuthTokenProvider when implemented.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
	const value = useMemo<AuthContextValue>(
		() => ({
			user: null,
			status: 'anon',
			signInWithGoogle: async () => {
				throw new Error('AuthProvider not implemented (Phase 14)');
			},
			signInWithEmail: async () => {
				throw new Error('AuthProvider not implemented (Phase 14)');
			},
			signOut: async () => {
				throw new Error('AuthProvider not implemented (Phase 14)');
			},
		}),
		[]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuthContext(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuthContext must be used within AuthProvider');
	}
	return ctx;
}
