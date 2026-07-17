import { describe, expect, it } from 'vitest';

import { handlers } from '@/tests/msw/handlers';

/**
 * MSW must cover every backend surface the client uses.
 * Path strings are matched loosely (absolute URLs in handlers).
 */
describe('MSW endpoint coverage', () => {
	const serialized = handlers.map((h) => String(h.info.header));

	it.each([
		['GET', '/health'],
		['GET', '/api/geo'],
		['GET', '/api/market'],
		['GET', '/api/trending'],
		['GET', '/api/news'],
		['GET', '/api/dashboard'],
		['GET', '/api/status'],
		['GET', '/api/me'],
		['GET', '/api/watchlist'],
		['PUT', '/api/watchlist'],
		['DELETE', '/api/watchlist'],
	] as const)('registers %s %s', (method, path) => {
		const hit = serialized.some(
			(line) =>
				line.includes(method) &&
				(line.includes(path) || line.includes(path.replace('/api/', '')))
		);
		expect(hit, `missing MSW handler for ${method} ${path}`).toBe(true);
	});
});
