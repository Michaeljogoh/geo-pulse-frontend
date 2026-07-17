import type { GetNewsParams } from '@/lib/api/endpoints';

/** TanStack Query keys — keep stable and typed. */
export const queryKeys = {
	geo: (ip?: string) => ['geo', ip ?? null] as const,
	market: (vs: string, limit: number) => ['market', vs.toLowerCase(), limit] as const,
	trending: (vs: string) => ['trending', vs.toLowerCase()] as const,
	news: (params: GetNewsParams) =>
		[
			'news',
			{
				country: params.country ?? null,
				symbols: params.symbols ?? null,
				lang: params.lang ?? 'en',
			},
		] as const,
	dashboard: (ip?: string) => ['dashboard', ip ?? null] as const,
	status: ['status'] as const,
	me: ['me'] as const,
	watchlist: (vs: string) => ['watchlist', vs.toLowerCase()] as const,
};
