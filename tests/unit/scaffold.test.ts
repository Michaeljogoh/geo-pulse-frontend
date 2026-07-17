import { describe, expect, it } from 'vitest';

import { DEFAULT_CURRENCY, MARKET_LIMIT } from '@/config/constants';
import { formatLatency, formatPercent } from '@/lib/format';

describe('scaffold smoke', () => {
	it('exposes shared constants', () => {
		expect(DEFAULT_CURRENCY).toBe('USD');
		expect(MARKET_LIMIT).toBe(20);
	});

	it('formats percent and latency', () => {
		expect(formatPercent(1.234)).toBe('+1.23%');
		expect(formatPercent(-2)).toBe('-2.00%');
		expect(formatLatency(42.2)).toBe('42 ms');
	});
});
