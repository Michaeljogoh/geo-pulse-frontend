import { describe, expect, it } from 'vitest';

import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/config/constants';
import {
	formatCompact,
	formatCurrency,
	formatHitRatio,
	formatLatency,
	formatPercent,
	formatUptime,
	resolveEffectiveCurrency,
} from '@/lib/format';
import { deriveLocale } from '@/lib/locale';

describe('Section 8.4 formatting', () => {
	it('formatCurrency uses Intl currency style', () => {
		const out = formatCurrency(1234.5, 'USD', 'en-US');
		expect(out).toContain('1,234.50');
		expect(out).toMatch(/\$|USD/);
	});

	it('formatCompact uses compact notation', () => {
		expect(formatCompact(1_500_000, 'en-US')).toMatch(/1\.5M|1.5M/);
	});

	it('formatPercent is signed with 2dp', () => {
		expect(formatPercent(1.234)).toBe('+1.23%');
		expect(formatPercent(-2)).toBe('-2.00%');
		expect(formatPercent(0)).toBe('0.00%');
	});

	it('formatLatency appends ms', () => {
		expect(formatLatency(42.2)).toBe('42 ms');
	});

	it('formatUptime and formatHitRatio', () => {
		expect(formatUptime(45)).toBe('45s');
		expect(formatUptime(120)).toBe('2m');
		expect(formatUptime(3660)).toBe('1h 1m');
		expect(formatHitRatio(0.5)).toBe('50%');
	});

	it('resolveEffectiveCurrency: override → geo → default', () => {
		expect(resolveEffectiveCurrency('ngn', 'eur')).toBe('EUR');
		expect(resolveEffectiveCurrency('ngn', null)).toBe('NGN');
		expect(resolveEffectiveCurrency(null, null)).toBe(DEFAULT_CURRENCY);
		expect(resolveEffectiveCurrency(undefined, undefined)).toBe(
			DEFAULT_CURRENCY
		);
	});

	it('deriveLocale falls back to DEFAULT_LOCALE', () => {
		expect(deriveLocale(null)).toBe(DEFAULT_LOCALE);
		expect(deriveLocale('NG')).toBe('en-NG');
	});
});
