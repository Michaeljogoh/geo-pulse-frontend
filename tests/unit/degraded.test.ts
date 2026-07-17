import { describe, expect, it } from 'vitest';

import {
	isResponseDegraded,
	isSectionMetaDegraded,
} from '@/lib/degraded';

describe('degraded helpers (Phase 11)', () => {
	it('isResponseDegraded respects degraded flag and fallback source', () => {
		expect(
			isResponseDegraded({
				requestId: '1',
				source: 'live',
				latencyMs: 1,
				cached: false,
				degraded: true,
			})
		).toBe(true);

		expect(
			isResponseDegraded({
				requestId: '1',
				source: 'fallback',
				latencyMs: 1,
				cached: true,
			})
		).toBe(true);

		expect(
			isResponseDegraded({
				requestId: '1',
				source: 'cache-l1',
				latencyMs: 1,
				cached: true,
			})
		).toBe(false);
	});

	it('isSectionMetaDegraded when ok is false', () => {
		expect(
			isSectionMetaDegraded({
				ok: false,
				source: 'error',
				latencyMs: 0,
				error: 'timeout',
			})
		).toBe(true);

		expect(
			isSectionMetaDegraded({
				ok: true,
				source: 'live',
				latencyMs: 10,
				error: null,
			})
		).toBe(false);
	});
});
