'use client';

import { resolveEffectiveCurrency } from '@/lib/format';
import { useUiStore } from '@/store/uiStore';

/**
 * Effective display/query currency:
 * Zustand `currencyOverride` ?? geo currency ?? `DEFAULT_CURRENCY`.
 */
export function useEffectiveCurrency(
	geoCurrency?: string | null
): string {
	const currencyOverride = useUiStore((s) => s.currencyOverride);
	return resolveEffectiveCurrency(geoCurrency, currencyOverride);
}
