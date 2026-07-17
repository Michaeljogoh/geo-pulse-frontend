import { describe, expect, it } from 'vitest';

import {
	countryFlagEmoji,
	displayValue,
	networkTypeLabel,
} from '@/lib/display';

describe('display helpers (Section 11)', () => {
	it('displayValue never fabricates — null/empty → — or Unknown', () => {
		expect(displayValue(null)).toBe('—');
		expect(displayValue(undefined)).toBe('—');
		expect(displayValue('')).toBe('—');
		expect(displayValue(null, 'Unknown')).toBe('Unknown');
		expect(displayValue('Lagos', 'Unknown')).toBe('Lagos');
		expect(displayValue(0)).toBe('0');
	});

	it('countryFlagEmoji returns empty for invalid codes', () => {
		expect(countryFlagEmoji(null)).toBe('');
		expect(countryFlagEmoji('USA')).toBe('');
		expect(countryFlagEmoji('ng')).toMatch(/./);
	});

	it('networkTypeLabel maps known types and falls back to Unknown', () => {
		expect(networkTypeLabel('proxy_vpn')).toBe('Proxy / VPN');
		expect(networkTypeLabel('weird')).toBe('Unknown');
	});
});
