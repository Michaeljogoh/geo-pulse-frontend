'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut as firebaseSignOut,
	type User,
} from 'firebase/auth';

import { getFirebaseAuth } from '@/lib/firebase';
import { setAuthTokenProvider } from '@/lib/api/client';

export type AuthStatus = 'loading' | 'authed' | 'anon';

/** Client auth identity from Firebase (not the backend AuthUser). */
export type AuthSessionUser = {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
};

export type AuthContextValue = {
	user: AuthSessionUser | null;
	status: AuthStatus;
	signInWithGoogle: () => Promise<void>;
	signInWithEmail: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: User): AuthSessionUser {
	return {
		uid: user.uid,
		email: user.email,
		displayName: user.displayName,
		photoURL: user.photoURL,
	};
}

/**
 * Phase 14 — Firebase Auth + API token provider.
 * ID tokens are never stored in Zustand/localStorage; read on demand via getIdToken().
 */
export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthSessionUser | null>(null);
	const [status, setStatus] = useState<AuthStatus>('loading');

	useEffect(() => {
		let unsub = () => {};

		try {
			const auth = getFirebaseAuth();

			setAuthTokenProvider(async () => {
				const current = auth.currentUser;
				if (!current) return null;
				return current.getIdToken();
			});

			unsub = onAuthStateChanged(auth, (next) => {
				if (next) {
					setUser(mapUser(next));
					setStatus('authed');
				} else {
					setUser(null);
					setStatus('anon');
				}
			});
		} catch {
			// Missing Firebase env in some test/dev contexts → treat as anonymous.
			setUser(null);
			setStatus('anon');
			setAuthTokenProvider(null);
		}

		return () => {
			unsub();
			setAuthTokenProvider(null);
		};
	}, []);

	const signInWithGoogle = useCallback(async () => {
		const auth = getFirebaseAuth();
		await signInWithPopup(auth, new GoogleAuthProvider());
	}, []);

	const signInWithEmail = useCallback(async (email: string, password: string) => {
		const auth = getFirebaseAuth();
		await signInWithEmailAndPassword(auth, email.trim(), password);
	}, []);

	const signOut = useCallback(async () => {
		const auth = getFirebaseAuth();
		await firebaseSignOut(auth);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			status,
			signInWithGoogle,
			signInWithEmail,
			signOut,
		}),
		[user, status, signInWithGoogle, signInWithEmail, signOut]
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
