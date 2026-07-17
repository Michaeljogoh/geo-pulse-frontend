import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Client UI prefs only (currency override, auto-refresh, etc.).
 * Server data stays in TanStack Query. Theme is owned by next-themes.
 */
type UiState = {
	currencyOverride: string | null;
	autoRefresh: boolean;
	setCurrencyOverride: (currency: string | null) => void;
	toggleAutoRefresh: () => void;
};

export const useUiStore = create<UiState>()(
	persist(
		(set) => ({
			currencyOverride: null,
			autoRefresh: true,
			setCurrencyOverride: (currencyOverride) => set({ currencyOverride }),
			toggleAutoRefresh: () =>
				set((state) => ({ autoRefresh: !state.autoRefresh })),
		}),
		{ name: 'geopulse-ui' }
	)
);
