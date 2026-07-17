import {
	apiDeleteAuth,
	apiGet,
	apiGetAuth,
	ApiClientError,
	apiPutAuth,
	type ApiSuccess,
} from '@/lib/api/client';
import {
	authUserSchema,
	coinsSchema,
	dashboardPayloadSchema,
	ipIntelligenceSchema,
	newsItemsSchema,
	statusPayloadSchema,
	trendingResultSchema,
	watchlistItemsSchema,
} from '@/lib/api/schemas';
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
import type { ResponseMeta } from '@/types/envelope';
import type { z } from 'zod';

function parseData<T>(
	schema: z.ZodType<T>,
	data: unknown,
	meta: ResponseMeta
): T {
	const result = schema.safeParse(data);
	if (!result.success) {
		throw new ApiClientError(
			'INVALID_RESPONSE',
			'API response failed schema validation',
			{
				requestId: meta.requestId,
				status: 200,
				details: result.error.flatten(),
			}
		);
	}
	return result.data;
}

async function getValidated<T>(
	path: string,
	schema: z.ZodType<T>,
	params?: Record<string, string | number | boolean | null | undefined>
): Promise<ApiSuccess<T>> {
	const { data, meta } = await apiGet<unknown>(path, { params });
	return { data: parseData(schema, data, meta), meta };
}

async function getValidatedAuth<T>(
	path: string,
	schema: z.ZodType<T>,
	params?: Record<string, string | number | boolean | null | undefined>
): Promise<ApiSuccess<T>> {
	const { data, meta } = await apiGetAuth<unknown>(path, { params });
	return { data: parseData(schema, data, meta), meta };
}

/** GET /api/geo */
export function getGeo(ip?: string): Promise<ApiSuccess<IpIntelligence>> {
	return getValidated('/api/geo', ipIntelligenceSchema, { ip });
}

/** GET /api/market */
export function getMarket(
	vs: string,
	limit: number
): Promise<ApiSuccess<Coin[]>> {
	return getValidated('/api/market', coinsSchema, { vs, limit });
}

/** GET /api/trending */
export function getTrending(vs: string): Promise<ApiSuccess<TrendingResult>> {
	return getValidated('/api/trending', trendingResultSchema, { vs });
}

export type GetNewsParams = {
	country?: string;
	symbols?: string;
	lang?: string;
};

/** GET /api/news */
export function getNews(
	params: GetNewsParams = {}
): Promise<ApiSuccess<NewsItem[]>> {
	return getValidated('/api/news', newsItemsSchema, params);
}

/** GET /api/dashboard — preferred initial personalized payload */
export function getDashboard(
	ip?: string
): Promise<ApiSuccess<DashboardPayload>> {
	return getValidated('/api/dashboard', dashboardPayloadSchema, { ip });
}

/** GET /api/status */
export function getStatus(): Promise<ApiSuccess<StatusPayload>> {
	return getValidated('/api/status', statusPayloadSchema);
}

/** GET /api/me (auth) */
export function getMe(): Promise<ApiSuccess<AuthUser>> {
	return getValidatedAuth('/api/me', authUserSchema);
}

/** GET /api/watchlist (auth) */
export function getWatchlist(
	vs: string
): Promise<ApiSuccess<WatchlistItem[]>> {
	return getValidatedAuth('/api/watchlist', watchlistItemsSchema, { vs });
}

/** PUT /api/watchlist/:coinId (auth) */
export async function addWatchlist(
	coinId: string
): Promise<ApiSuccess<WatchlistItem[]>> {
	const { data, meta } = await apiPutAuth<unknown>(
		`/api/watchlist/${encodeURIComponent(coinId)}`
	);
	return { data: parseData(watchlistItemsSchema, data, meta), meta };
}

/** DELETE /api/watchlist/:coinId (auth) */
export async function removeWatchlist(
	coinId: string
): Promise<ApiSuccess<WatchlistItem[]>> {
	const { data, meta } = await apiDeleteAuth<unknown>(
		`/api/watchlist/${encodeURIComponent(coinId)}`
	);
	return { data: parseData(watchlistItemsSchema, data, meta), meta };
}
