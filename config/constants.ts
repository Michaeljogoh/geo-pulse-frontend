/**
 * Global configuration — single source of truth.
 * No magic numbers in components; import from here.
 * Values align with backend cache TTLs where applicable.
 */

/** Geo stale time (6h) — matches backend CACHE_TTL_GEO_S */
export const QUERY_STALE_GEO_MS = 21_600_000;

/** Market stale time (60s) — matches backend CACHE_TTL_MARKET_S */
export const QUERY_STALE_MARKET_MS = 60_000;

/** Auto-refetch prices every 60s */
export const QUERY_REFETCH_MARKET_MS = 60_000;

/** Trending stale time (5m) — matches backend CACHE_TTL_TRENDING_S */
export const QUERY_STALE_TRENDING_MS = 300_000;

/** News stale time (10m) — matches backend CACHE_TTL_NEWS_S */
export const QUERY_STALE_NEWS_MS = 600_000;

/** Status stale time */
export const QUERY_STALE_STATUS_MS = 15_000;

/** Status auto-refetch interval */
export const QUERY_REFETCH_STATUS_MS = 30_000;

/** TanStack Query retry count */
export const QUERY_RETRY = 2;

/** Fallback when geo has no currency */
export const DEFAULT_CURRENCY = "USD";

/** Fallback locale for Intl formatting */
export const DEFAULT_LOCALE = "en-US";

/** Coins requested for market table */
export const MARKET_LIMIT = 20;

/** Rows in gainers/losers panels */
export const GAINERS_LOSERS_COUNT = 7;

/** News cards per page (3×3 grid) */
export const NEWS_PAGE_SIZE = 9;

/** Debounce delay for news search input */
export const NEWS_SEARCH_DEBOUNCE_MS = 300;

/** Max wait for news card images before revealing the grid */
export const NEWS_IMAGE_PRELOAD_TIMEOUT_MS = 8_000;
