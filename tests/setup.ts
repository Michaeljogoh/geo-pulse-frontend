import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { resetWatchlistStore } from '@/tests/msw/handlers';
import { server } from '@/tests/msw/server';

vi.mock('@/lib/firebase', () => ({
	getFirebaseAuth: () => ({
		currentUser: null,
	}),
}));

vi.mock('firebase/auth', () => ({
	GoogleAuthProvider: class GoogleAuthProvider {},
	browserLocalPersistence: { type: 'LOCAL' },
	browserSessionPersistence: { type: 'SESSION' },
	setPersistence: async () => {},
	createUserWithEmailAndPassword: async () => {
		throw new Error('createUserWithEmailAndPassword not mocked for this test');
	},
	updateProfile: async () => {},
	onAuthStateChanged: (
		_auth: unknown,
		callback: (user: null) => void
	) => {
		callback(null);
		return () => {};
	},
	signInWithPopup: async () => {
		throw new Error('signInWithPopup not mocked for this test');
	},
	signInWithEmailAndPassword: async () => {
		throw new Error('signInWithEmailAndPassword not mocked for this test');
	},
	signOut: async () => {},
}));

beforeAll(() => {
	server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
	server.resetHandlers();
	resetWatchlistStore();
});

afterAll(() => {
	server.close();
});
