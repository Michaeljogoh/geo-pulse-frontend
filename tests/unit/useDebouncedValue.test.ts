import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';

describe('useDebouncedValue', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('updates after the debounce delay', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 300),
			{ initialProps: { value: 'btc' } }
		);

		expect(result.current).toBe('btc');

		rerender({ value: 'eth' });
		expect(result.current).toBe('btc');

		act(() => {
			vi.advanceTimersByTime(299);
		});
		expect(result.current).toBe('btc');

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(result.current).toBe('eth');
	});

	it('resets the timer when the value changes quickly', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 300),
			{ initialProps: { value: 'a' } }
		);

		rerender({ value: 'ab' });
		act(() => {
			vi.advanceTimersByTime(200);
		});
		rerender({ value: 'abc' });
		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(result.current).toBe('a');

		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current).toBe('abc');
	});
});
