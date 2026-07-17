import { http, HttpResponse } from 'msw';

const apiBase = () =>
	(process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080').replace(
		/\/$/,
		''
	);

/**
 * MSW handlers for backend endpoints (Section 7 scaffold).
 * Fixtures expand in Phase 16.
 */
export const handlers = [
	http.get(`${apiBase()}/health`, () =>
		HttpResponse.json({
			status: 'ok',
			uptimeSeconds: 1,
			version: '1.0.0',
			timestamp: new Date().toISOString(),
			firestore: 'up',
		})
	),
];
