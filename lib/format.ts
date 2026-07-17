import { formatDistanceToNow } from 'date-fns';

import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/config/constants';

/**
 * Deterministic formatting helpers for prices, percents, and ratios.
 *
 * Locale: `deriveLocale(countryCode)` → `DEFAULT_LOCALE` fallback (`lib/locale.ts`).
 * Currency: `resolveEffectiveCurrency(geo.currency, currencyOverride)` →
 *   Zustand override ?? geo.currency ?? `DEFAULT_CURRENCY`.
 */

/** Effective vs-currency for market/trending/watchlist queries and display. */
export function resolveEffectiveCurrency(
	geoCurrency: string | null | undefined,
	currencyOverride: string | null | undefined = null
): string {
	const raw = currencyOverride ?? geoCurrency ?? DEFAULT_CURRENCY;
	return raw.trim().toUpperCase() || DEFAULT_CURRENCY;
}

export function formatCurrency(
	value: number,
	currency: string,
	locale: string = DEFAULT_LOCALE
): string {
	const code = currency.trim().toUpperCase() || DEFAULT_CURRENCY;
	try {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: code,
		}).format(value);
	} catch {
		return new Intl.NumberFormat(DEFAULT_LOCALE, {
			style: 'currency',
			currency: DEFAULT_CURRENCY,
		}).format(value);
	}
}

export function formatCompact(
	value: number,
	locale: string = DEFAULT_LOCALE
): string {
	return new Intl.NumberFormat(locale, {
		notation: 'compact',
		maximumFractionDigits: 2,
	}).format(value);
}

/** Signed, 2 decimal places, `+` / `-` prefix. */
export function formatPercent(value: number): string {
	const sign = value > 0 ? '+' : '';
	return `${sign}${value.toFixed(2)}%`;
}

export function formatRelativeTime(iso: string): string {
	return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function formatLatency(ms: number): string {
	return `${Math.round(ms)} ms`;
}

/** Uptime for API health panel. */
export function formatUptime(seconds: number): string {
	if (seconds < 60) return `${Math.round(seconds)}s`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	const rem = minutes % 60;
	return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

/** Cache hit ratio 0–1 → percent label. */
export function formatHitRatio(ratio: number): string {
	return `${Math.round(ratio * 100)}%`;
}
