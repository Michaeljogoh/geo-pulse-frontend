import { beforeEach, describe, expect, it } from 'vitest';

import { useUiStore } from '@/store/uiStore';

describe('uiStore (Phase 4)', () => {
	beforeEach(() => {
		localStorage.clear();
		useUiStore.persist.clearStorage();
		useUiStore.setState({
			currencyOverride: null,
			autoRefresh: true,
		});
	});

	it('defaults currencyOverride to null and autoRefresh to true', () => {
		const state = useUiStore.getState();
		expect(state.currencyOverride).toBeNull();
		expect(state.autoRefresh).toBe(true);
	});

	it('setCurrencyOverride updates currency', () => {
		useUiStore.getState().setCurrencyOverride('eur');
		expect(useUiStore.getState().currencyOverride).toBe('eur');
		useUiStore.getState().setCurrencyOverride(null);
		expect(useUiStore.getState().currencyOverride).toBeNull();
	});

	it('toggleAutoRefresh flips the flag', () => {
		expect(useUiStore.getState().autoRefresh).toBe(true);
		useUiStore.getState().toggleAutoRefresh();
		expect(useUiStore.getState().autoRefresh).toBe(false);
		useUiStore.getState().toggleAutoRefresh();
		expect(useUiStore.getState().autoRefresh).toBe(true);
	});

	it('persists currency override across rehydrate', async () => {
		useUiStore.getState().setCurrencyOverride('ngn');
		await useUiStore.persist.rehydrate();
		expect(useUiStore.getState().currencyOverride).toBe('ngn');
	});
});
