import { DEFAULT_LOCALE } from '@/config/constants';

/**
 * Derive a BCP 47 locale from geo fields.
 * Falls back to DEFAULT_LOCALE when country is unknown.
 */
export function deriveLocale(
	countryCode: string | null | undefined,
	_timezone?: string | null
): string {
	if (!countryCode) return DEFAULT_LOCALE;

	const code = countryCode.toUpperCase();
	const map: Record<string, string> = {
		US: 'en-US',
		GB: 'en-GB',
		NG: 'en-NG',
		ZA: 'en-ZA',
		KE: 'en-KE',
		GH: 'en-GH',
		CA: 'en-CA',
		AU: 'en-AU',
		IN: 'en-IN',
		DE: 'de-DE',
		FR: 'fr-FR',
		ES: 'es-ES',
		BR: 'pt-BR',
		MX: 'es-MX',
		JP: 'ja-JP',
		KR: 'ko-KR',
		CN: 'zh-CN',
		AE: 'ar-AE',
		SA: 'ar-SA',
	};

	return map[code] ?? `en-${code}`;
}
