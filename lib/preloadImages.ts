/**
 * Preload image URLs in the background.
 * Resolves when every URL has loaded or failed, or when `timeoutMs` elapses.
 */
export function preloadImages(
	urls: readonly string[],
	timeoutMs = 8_000
): Promise<void> {
	const unique = [...new Set(urls.filter(Boolean))];
	if (unique.length === 0) {
		return Promise.resolve();
	}

	return Promise.all(
		unique.map((src) => preloadOne(src, timeoutMs))
	).then(() => undefined);
}

function preloadOne(src: string, timeoutMs: number): Promise<void> {
	return new Promise((resolve) => {
		if (typeof window === 'undefined') {
			resolve();
			return;
		}

		const img = new window.Image();
		let settled = false;

		const done = () => {
			if (settled) return;
			settled = true;
			window.clearTimeout(timer);
			resolve();
		};

		const timer = window.setTimeout(done, timeoutMs);
		img.onload = done;
		img.onerror = done;
		img.src = src;

		if (img.complete) {
			done();
		}
	});
}
