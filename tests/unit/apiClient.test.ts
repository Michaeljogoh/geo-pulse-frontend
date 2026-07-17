import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import {
	apiGet,
	apiGetAuth,
	ApiClientError,
	setAuthTokenProvider,
} from '@/lib/api/client';
import { getGeo, getMe } from '@/lib/api/endpoints';
import { server } from '@/tests/msw/server';
import {
	apiBase,
	mockAuthUser,
	mockIpIntelligence,
	okMeta,
	testHandlers,
} from '@/tests/msw/handlers';

describe('api client (Phase 2)', () => {
	beforeEach(() => {
		setAuthTokenProvider(null);
		process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080';
		process.env.NEXT_PUBLIC_API_TIMEOUT_MS = '10000';
	});

	afterEach(() => {
		setAuthTokenProvider(null);
		delete process.env.NEXT_PUBLIC_API_TIMEOUT_MS;
	});

	it('success returns { data, meta }', async () => {
		const result = await getGeo('8.8.8.8');
		expect(result.data.ip).toBe('8.8.8.8');
		expect(result.data.networkType).toBe(mockIpIntelligence.networkType);
		expect(result.meta.requestId).toBe('test-request-id');
		expect(result.meta.source).toBe('live');
		expect(result.meta.cached).toBe(false);
	});

	it('envelope error throws ApiClientError with code', async () => {
		server.use(testHandlers.geoEnvelopeError);
		await expect(apiGet('/api/geo')).rejects.toMatchObject({
			name: 'ApiClientError',
			code: 'UPSTREAM_ERROR',
			requestId: 'err-1',
			status: 502,
		} satisfies Partial<ApiClientError>);
	});

	it('invalid shape throws INVALID_RESPONSE', async () => {
		server.use(testHandlers.geoInvalidShape);
		await expect(apiGet('/api/geo')).rejects.toMatchObject({
			code: 'INVALID_RESPONSE',
		});
	});

	it('timeout throws TIMEOUT', async () => {
		process.env.NEXT_PUBLIC_API_TIMEOUT_MS = '50';
		server.use(testHandlers.geoSlow);
		await expect(apiGet('/api/geo')).rejects.toMatchObject({
			code: 'TIMEOUT',
		});
	}, 10_000);

	it('auth:true without token throws UNAUTHENTICATED before request', async () => {
		await expect(apiGetAuth('/api/me')).rejects.toMatchObject({
			code: 'UNAUTHENTICATED',
			status: 401,
		});
	});

	it('auth:true attaches Authorization Bearer header', async () => {
		setAuthTokenProvider(() => 'test-id-token');
		let authorization: string | null = null;

		server.use(
			http.get(`${apiBase()}/api/me`, ({ request }) => {
				authorization = request.headers.get('Authorization');
				return HttpResponse.json({
					data: mockAuthUser,
					meta: okMeta,
					error: null,
				});
			})
		);

		const result = await getMe();
		expect(authorization).toBe('Bearer test-id-token');
		expect(result.data.uid).toBe(mockAuthUser.uid);
	});
});
