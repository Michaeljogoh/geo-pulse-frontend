import { z } from 'zod';

import type {
	AuthUser,
	Coin,
	DashboardPayload,
	HealthResponse,
	IpIntelligence,
	NewsItem,
	ProviderHealth,
	SectionMeta,
	StatusPayload,
	TrendingCoin,
	TrendingResult,
	WatchlistItem,
} from '@/types/domain';
import type { ApiError, ResponseMeta } from '@/types/envelope';

/** Zod schemas mirroring backend domain + envelope contracts. */

export const networkTypeSchema = z.enum([
	'residential',
	'mobile',
	'datacenter',
	'proxy_vpn',
	'unknown',
]);

export const ipIntelligenceSchema: z.ZodType<IpIntelligence> = z.object({
	ip: z.string(),
	country: z.string().nullable(),
	countryCode: z.string().nullable(),
	city: z.string().nullable(),
	region: z.string().nullable(),
	latitude: z.number().nullable(),
	longitude: z.number().nullable(),
	timezone: z.string().nullable(),
	currency: z.string().nullable(),
	isp: z.string().nullable(),
	organization: z.string().nullable(),
	asn: z.string().nullable(),
	asnName: z.string().nullable(),
	isProxy: z.boolean().nullable(),
	isHosting: z.boolean().nullable(),
	isMobile: z.boolean().nullable(),
	networkType: networkTypeSchema,
	confidence: z.number(),
});

export const coinSchema: z.ZodType<Coin> = z.object({
	id: z.string(),
	symbol: z.string(),
	name: z.string(),
	image: z.string().nullable(),
	currentPrice: z.number(),
	currency: z.string(),
	marketCap: z.number().nullable(),
	marketCapRank: z.number().nullable(),
	priceChangePct24h: z.number().nullable(),
	totalVolume: z.number().nullable(),
	high24h: z.number().nullable(),
	low24h: z.number().nullable(),
	lastUpdated: z.string(),
});

export const trendingCoinSchema: z.ZodType<TrendingCoin> = z.object({
	id: z.string(),
	name: z.string(),
	symbol: z.string(),
	marketCapRank: z.number().nullable(),
	thumb: z.string().nullable(),
});

export const trendingResultSchema: z.ZodType<TrendingResult> = z.object({
	trending: z.array(trendingCoinSchema),
	gainers: z.array(coinSchema),
	losers: z.array(coinSchema),
});

export const newsItemSchema: z.ZodType<NewsItem> = z.object({
	title: z.string(),
	url: z.string(),
	source: z.string().nullable(),
	publishedAt: z.string(),
	sentiment: z.enum(['positive', 'negative', 'neutral']).nullable(),
	imageUrl: z.string().nullable(),
});

export const sectionMetaSchema: z.ZodType<SectionMeta> = z.object({
	ok: z.boolean(),
	source: z.enum(['live', 'cache-l1', 'cache-l2', 'fallback', 'error']),
	latencyMs: z.number(),
	error: z.string().nullable(),
});

export const dashboardPayloadSchema: z.ZodType<DashboardPayload> = z.object({
	visitor: ipIntelligenceSchema,
	market: z.array(coinSchema),
	trending: trendingResultSchema,
	news: z.array(newsItemSchema),
	sections: z.object({
		market: sectionMetaSchema,
		trending: sectionMetaSchema,
		news: sectionMetaSchema,
	}),
	degraded: z.boolean(),
});

export const authUserSchema: z.ZodType<AuthUser> = z.object({
	uid: z.string(),
	email: z.string().nullable(),
	name: z.string().nullable(),
	picture: z.string().nullable(),
});

export const watchlistItemSchema: z.ZodType<WatchlistItem> = z.object({
	coinId: z.string(),
	available: z.boolean(),
	coin: coinSchema.nullable(),
	addedAt: z.string(),
});

export const providerHealthSchema: z.ZodType<ProviderHealth> = z.object({
	provider: z.string(),
	state: z.enum(['closed', 'open', 'half_open']),
	lastSuccessAt: z.string().nullable(),
	lastFailureAt: z.string().nullable(),
	consecutiveFail: z.number(),
	successCount: z.number(),
	failureCount: z.number(),
	avgLatencyMs: z.number(),
});

export const statusPayloadSchema: z.ZodType<StatusPayload> = z.object({
	providers: z.array(providerHealthSchema),
	cache: z.object({
		l1Keys: z.number(),
		hitRatio: z.number(),
	}),
	uptimeSeconds: z.number(),
});

export const healthResponseSchema: z.ZodType<HealthResponse> = z.object({
	status: z.literal('ok'),
	uptimeSeconds: z.number(),
	version: z.string(),
	timestamp: z.string(),
	firestore: z.enum(['up', 'down', 'unknown']),
});

export const responseMetaSchema: z.ZodType<ResponseMeta> = z.object({
	requestId: z.string(),
	source: z.enum(['live', 'cache-l1', 'cache-l2', 'fallback']),
	provider: z.string().optional(),
	latencyMs: z.number(),
	cached: z.boolean(),
	confidence: z.number().nullable().optional(),
	lastUpdated: z.string().nullable().optional(),
	degraded: z.boolean().optional(),
});

export const apiErrorSchema: z.ZodType<ApiError> = z.object({
	code: z.enum([
		'VALIDATION_ERROR',
		'UNAUTHENTICATED',
		'FORBIDDEN',
		'NOT_FOUND',
		'RATE_LIMITED',
		'UPSTREAM_TIMEOUT',
		'UPSTREAM_ERROR',
		'CIRCUIT_OPEN',
		'INTERNAL',
	]),
	message: z.string(),
	details: z.unknown().optional(),
});

export const coinsSchema = z.array(coinSchema);
export const newsItemsSchema = z.array(newsItemSchema);
export const watchlistItemsSchema = z.array(watchlistItemSchema);
