/** Honest empty/unknown display — never fabricate values. */
export function displayValue(
	value: string | number | null | undefined,
	fallback: '—' | 'Unknown' = '—'
): string {
	if (value === null || value === undefined || value === '') {
		return fallback;
	}
	return String(value);
}

/** ISO 3166-1 alpha-2 → regional indicator flag emoji (or empty). */
export function countryFlagEmoji(countryCode: string | null | undefined): string {
	if (!countryCode || countryCode.length !== 2) return '';
	const code = countryCode.toUpperCase();
	if (!/^[A-Z]{2}$/.test(code)) return '';
	return String.fromCodePoint(
		...[...code].map((char) => 127397 + char.charCodeAt(0))
	);
}

export function networkTypeLabel(networkType: string): string {
	switch (networkType) {
		case 'residential':
			return 'Residential';
		case 'mobile':
			return 'Mobile';
		case 'datacenter':
			return 'Datacenter';
		case 'proxy_vpn':
			return 'Proxy / VPN';
		default:
			return 'Unknown';
	}
}
