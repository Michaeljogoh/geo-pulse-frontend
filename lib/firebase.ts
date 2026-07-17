import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

/**
 * Firebase Web app + Auth init (Section 7 / Phase 14).
 * Client-only — guard against SSR. No Firestore client access.
 */

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseConfig() {
	return {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	};
}

export function getFirebaseApp(): FirebaseApp {
	if (typeof window === 'undefined') {
		throw new Error('Firebase must only be initialized in the browser');
	}

	if (app) return app;

	const config = getFirebaseConfig();
	if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
		throw new Error('Missing NEXT_PUBLIC_FIREBASE_* environment variables');
	}

	app = getApps().length > 0 ? getApps()[0]! : initializeApp(config);
	return app;
}

export function getFirebaseAuth(): Auth {
	if (auth) return auth;
	auth = getAuth(getFirebaseApp());
	return auth;
}
