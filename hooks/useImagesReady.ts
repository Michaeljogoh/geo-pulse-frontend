'use client';

import { useEffect, useMemo, useState } from 'react';

import { preloadImages } from '@/lib/preloadImages';

/**
 * Returns true once every URL has finished loading (or failed / timed out).
 * Resets to false whenever the URL set changes.
 */
export function useImagesReady(
	urls: readonly string[],
	timeoutMs = 8_000
): boolean {
	const key = useMemo(
		() =>
			[...new Set(urls.filter(Boolean))]
				.sort()
				.join('\0'),
		[urls]
	);

	const [ready, setReady] = useState(() => key.length === 0);

	useEffect(() => {
		const list = key.length === 0 ? [] : key.split('\0');
		let cancelled = false;

		if (list.length === 0) {
			setReady(true);
			return;
		}

		setReady(false);
		void preloadImages(list, timeoutMs).then(() => {
			if (!cancelled) setReady(true);
		});

		return () => {
			cancelled = true;
		};
	}, [key, timeoutMs]);

	return ready;
}
