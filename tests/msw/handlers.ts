import { http, HttpResponse, delay } from 'msw';

import type {
	AuthUser,
	Coin,
	DashboardPayload,
	IpIntelligence,
	NewsItem,
	StatusPayload,
	TrendingResult,
	WatchlistItem,
} from '@/types/domain';

export const apiBase = () =>
	(process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080').replace(
		/\/$/,
		''
	);

export const okMeta = {
	requestId: 'test-request-id',
	source: 'live' as const,
	latencyMs: 12,
	cached: false,
	provider: 'ipapi',
	confidence: 0.9,
};

export const mockIpIntelligence: IpIntelligence = {
	ip: '8.8.8.8',
	country: 'United States',
	countryCode: 'US',
	city: 'Mountain View',
	region: 'California',
	latitude: 37.386,
	longitude: -122.0838,
	timezone: 'America/Los_Angeles',
	currency: 'USD',
	isp: 'Google LLC',
	organization: 'Google Public DNS',
	asn: 'AS15169',
	asnName: 'GOOGLE',
	isProxy: false,
	isHosting: true,
	isMobile: false,
	networkType: 'datacenter',
	confidence: 0.9,
};

export const mockCoin: Coin = {
	id: 'bitcoin',
	symbol: 'BTC',
	name: 'Bitcoin',
	image: null,
	currentPrice: 65000,
	currency: 'usd',
	marketCap: 1_200_000_000_000,
	marketCapRank: 1,
	priceChangePct24h: 1.25,
	totalVolume: 30_000_000_000,
	high24h: 66000,
	low24h: 64000,
	lastUpdated: new Date().toISOString(),
};

export const mockTrending: TrendingResult = {
	trending: [
		{
			id: 'bitcoin',
			name: 'Bitcoin',
			symbol: 'BTC',
			marketCapRank: 1,
			thumb: null,
		},
	],
	gainers: [{ ...mockCoin, priceChangePct24h: 8 }],
	losers: [{ ...mockCoin, id: 'ethereum', symbol: 'ETH', name: 'Ethereum', priceChangePct24h: -3 }],
};

export const mockNews: NewsItem[] = [
	{
		title: 'Bitcoin holds steady',
		url: 'https://example.com/news/1',
		source: 'TestWire',
		publishedAt: new Date().toISOString(),
		sentiment: 'neutral',
		imageUrl: null,
	},
];

export const mockDashboard: DashboardPayload = {
	visitor: mockIpIntelligence,
	market: [mockCoin],
	trending: mockTrending,
	news: mockNews,
	sections: {
		market: { ok: true, source: 'live', latencyMs: 10, error: null },
		trending: { ok: true, source: 'live', latencyMs: 10, error: null },
		news: { ok: true, source: 'live', latencyMs: 10, error: null },
	},
	degraded: false,
};

export const mockStatus: StatusPayload = {
	providers: [
		{
			provider: 'coingecko',
			state: 'closed',
			lastSuccessAt: new Date().toISOString(),
			lastFailureAt: null,
			consecutiveFail: 0,
			successCount: 10,
			failureCount: 0,
			avgLatencyMs: 40,
		},
	],
	cache: { l1Keys: 3, hitRatio: 0.5 },
	uptimeSeconds: 120,
};

export const mockAuthUser: AuthUser = {
	uid: 'firebase-uid-1',
	email: 'ada@example.com',
	name: 'Ada Lovelace',
	picture: null,
};

/** Mutable watchlist fixture for Phase 15 tests. */
let watchlistStore: WatchlistItem[] = [];

export function resetWatchlistStore(items: WatchlistItem[] = []) {
	watchlistStore = items.map((item) => ({ ...item }));
}

export function getWatchlistStore() {
	return watchlistStore;
}

function requireBearer(request: Request): boolean {
	const auth = request.headers.get('Authorization');
	return Boolean(auth?.startsWith('Bearer '));
}

function unauthenticatedResponse() {
	return HttpResponse.json(
		{
			data: null,
			meta: { ...okMeta, requestId: 'wl-unauth' },
			error: {
				code: 'UNAUTHENTICATED',
				message: 'Authentication required',
			},
		},
		{ status: 401 }
	);
}

/**
 * MSW handlers for backend endpoints (Phases 2–3).
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

	http.get(`${apiBase()}/api/geo`, ({ request }) => {
		const url = new URL(request.url);
		const ip = url.searchParams.get('ip') ?? mockIpIntelligence.ip;
		return HttpResponse.json({
			data: { ...mockIpIntelligence, ip },
			meta: okMeta,
			error: null,
		});
	}),

	http.get(`${apiBase()}/api/market`, ({ request }) => {
		const url = new URL(request.url);
		const vs = (url.searchParams.get('vs') ?? 'usd').toLowerCase();
		return HttpResponse.json({
			data: [{ ...mockCoin, currency: vs }],
			meta: { ...okMeta, provider: 'coingecko' },
			error: null,
		});
	}),

	http.get(`${apiBase()}/api/trending`, () =>
		HttpResponse.json({
			data: mockTrending,
			meta: { ...okMeta, provider: 'coingecko' },
			error: null,
		})
	),

	http.get(`${apiBase()}/api/news`, () =>
		HttpResponse.json({
			data: mockNews,
			meta: { ...okMeta, provider: 'cryptopanic' },
			error: null,
		})
	),

	http.get(`${apiBase()}/api/dashboard`, () =>
		HttpResponse.json({
			data: mockDashboard,
			meta: { ...okMeta, degraded: false },
			error: null,
		})
	),

	http.get(`${apiBase()}/api/status`, () =>
		HttpResponse.json({
			data: mockStatus,
			meta: { ...okMeta, provider: undefined, confidence: undefined },
			error: null,
		})
	),

	http.get(`${apiBase()}/api/me`, ({ request }) => {
		const auth = request.headers.get('Authorization');
		if (!auth?.startsWith('Bearer ')) {
			return HttpResponse.json(
				{
					data: null,
					meta: { ...okMeta, requestId: 'me-unauth' },
					error: {
						code: 'UNAUTHENTICATED',
						message: 'Authentication required',
					},
				},
				{ status: 401 }
			);
		}
		return HttpResponse.json({
			data: mockAuthUser,
			meta: { ...okMeta, requestId: 'me-ok' },
			error: null,
		});
	}),

	http.get(`${apiBase()}/api/watchlist`, ({ request }) => {
		if (!requireBearer(request)) return unauthenticatedResponse();
		const url = new URL(request.url);
		const vs = (url.searchParams.get('vs') ?? 'usd').toLowerCase();
		const data = watchlistStore.map((item) => {
			if (!item.available || !item.coin) return item;
			return {
				...item,
				coin: { ...item.coin, currency: vs },
			};
		});
		return HttpResponse.json({
			data,
			meta: { ...okMeta, provider: 'coingecko' },
			error: null,
		});
	}),

	http.put(`${apiBase()}/api/watchlist/:coinId`, ({ request, params }) => {
		if (!requireBearer(request)) return unauthenticatedResponse();
		const coinId = String(params.coinId ?? '').toLowerCase();
		if (!/^[a-z0-9-]{1,64}$/.test(coinId)) {
			return HttpResponse.json(
				{
					data: null,
					meta: { ...okMeta, requestId: 'wl-invalid' },
					error: {
						code: 'VALIDATION_ERROR',
						message: 'Invalid coin id',
					},
				},
				{ status: 400 }
			);
		}
		if (
			!watchlistStore.some((item) => item.coinId === coinId) &&
			watchlistStore.length >= 50
		) {
			return HttpResponse.json(
				{
					data: null,
					meta: { ...okMeta, requestId: 'wl-cap' },
					error: {
						code: 'VALIDATION_ERROR',
						message: 'Watchlist cap exceeded (max 50 coins)',
					},
				},
				{ status: 400 }
			);
		}
		if (!watchlistStore.some((item) => item.coinId === coinId)) {
			const available = coinId === mockCoin.id || coinId === 'ethereum';
			watchlistStore = [
				...watchlistStore,
				{
					coinId,
					available,
					coin: available
						? {
								...mockCoin,
								id: coinId,
								name: coinId === 'ethereum' ? 'Ethereum' : mockCoin.name,
								symbol: coinId === 'ethereum' ? 'ETH' : mockCoin.symbol,
							}
						: null,
					addedAt: new Date().toISOString(),
				},
			];
		}
		return HttpResponse.json({
			data: watchlistStore,
			meta: { ...okMeta, provider: 'coingecko' },
			error: null,
		});
	}),

	http.delete(`${apiBase()}/api/watchlist/:coinId`, ({ request, params }) => {
		if (!requireBearer(request)) return unauthenticatedResponse();
		const coinId = String(params.coinId ?? '').toLowerCase();
		watchlistStore = watchlistStore.filter((item) => item.coinId !== coinId);
		return HttpResponse.json({
			data: watchlistStore,
			meta: { ...okMeta, provider: 'coingecko' },
			error: null,
		});
	}),
];

/** Override helpers for unit tests. */
export const testHandlers = {
	geoEnvelopeError: http.get(`${apiBase()}/api/geo`, () =>
		HttpResponse.json(
			{
				data: null,
				meta: { ...okMeta, requestId: 'err-1' },
				error: {
					code: 'UPSTREAM_ERROR',
					message: 'Provider failed',
				},
			},
			{ status: 502 }
		)
	),
	geoInvalidShape: http.get(`${apiBase()}/api/geo`, () =>
		HttpResponse.json({ unexpected: true })
	),
	geoSlow: http.get(`${apiBase()}/api/geo`, async () => {
		await delay(500);
		return HttpResponse.json({
			data: mockIpIntelligence,
			meta: okMeta,
			error: null,
		});
	}),
	geoValidationError: http.get(`${apiBase()}/api/geo`, () =>
		HttpResponse.json(
			{
				data: null,
				meta: { ...okMeta, requestId: 'val-1' },
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Invalid IP',
				},
			},
			{ status: 400 }
		)
	),
};
