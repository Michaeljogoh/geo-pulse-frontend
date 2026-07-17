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
	browserLocalPersistence,
	browserSessionPersistence,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	setPersistence,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut as firebaseSignOut,
	updateProfile,
	type User,
} from 'firebase/auth';

import { getFirebaseAuth } from '@/lib/firebase';
import { setAuthTokenProvider } from '@/lib/api/client';
import {
	clearAuthSessionCookie,
	setAuthSessionCookie,
} from '@/lib/auth-session-cookie';

export type AuthStatus = 'loading' | 'authed' | 'anon';

/** Client auth identity from Firebase (not the backend AuthUser). */
export type AuthSessionUser = {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
};

export type SignInOptions = {
	/** Persist session across browser restarts (default true). */
	persist?: boolean;
};

export type SignUpOptions = {
	displayName?: string;
	persist?: boolean;
};

export type AuthContextValue = {
	user: AuthSessionUser | null;
	status: AuthStatus;
	signInWithGoogle: (options?: SignInOptions) => Promise<void>;
	signInWithEmail: (
		email: string,
		password: string,
		options?: SignInOptions
	) => Promise<void>;
	signUpWithEmail: (
		email: string,
		password: string,
		options?: SignUpOptions
	) => Promise<void>;
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

async function applyPersistence(persist: boolean): Promise<void> {
	const auth = getFirebaseAuth();
	await setPersistence(
		auth,
		persist ? browserLocalPersistence : browserSessionPersistence
	);
}

/**
 * Firebase Auth + API token provider.
 * ID tokens are never stored in Zustand/localStorage; read on demand via getIdToken().
 * Backend sync happens via authenticated GET /api/me (upsertOnLogin).
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
					setAuthSessionCookie();
					setUser(mapUser(next));
					setStatus('authed');
				} else {
					clearAuthSessionCookie();
					setUser(null);
					setStatus('anon');
				}
			});
		} catch {
			// Missing Firebase env in some test/dev contexts → treat as anonymous.
			clearAuthSessionCookie();
			setUser(null);
			setStatus('anon');
			setAuthTokenProvider(null);
		}

		return () => {
			unsub();
			setAuthTokenProvider(null);
		};
	}, []);

	const signInWithGoogle = useCallback(async (options?: SignInOptions) => {
		await applyPersistence(options?.persist ?? true);
		const auth = getFirebaseAuth();
		await signInWithPopup(auth, new GoogleAuthProvider());
	}, []);

	const signInWithEmail = useCallback(
		async (email: string, password: string, options?: SignInOptions) => {
			await applyPersistence(options?.persist ?? true);
			const auth = getFirebaseAuth();
			await signInWithEmailAndPassword(auth, email.trim(), password);
		},
		[]
	);

	const signUpWithEmail = useCallback(
		async (email: string, password: string, options?: SignUpOptions) => {
			await applyPersistence(options?.persist ?? true);
			const auth = getFirebaseAuth();
			const credential = await createUserWithEmailAndPassword(
				auth,
				email.trim(),
				password
			);
			const name = options?.displayName?.trim();
			if (name) {
				await updateProfile(credential.user, { displayName: name });
			}
		},
		[]
	);

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
			signUpWithEmail,
			signOut,
		}),
		[
			user,
			status,
			signInWithGoogle,
			signInWithEmail,
			signUpWithEmail,
			signOut,
		]
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
