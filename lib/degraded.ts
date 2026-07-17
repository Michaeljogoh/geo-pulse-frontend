import type { SectionMeta } from '@/types/domain';
import type { ResponseMeta } from '@/types/envelope';

/** True when the API marked the response as degraded or fell back. */
export function isResponseDegraded(meta?: ResponseMeta | null): boolean {
	if (!meta) return false;
	if (meta.degraded) return true;
	return meta.source === 'fallback';
}

/** True when a dashboard section meta reports failure or fallback. */
export function isSectionMetaDegraded(section?: SectionMeta | null): boolean {
	if (!section) return false;
	return (
		!section.ok ||
		section.source === 'error' ||
		section.source === 'fallback'
	);
}
