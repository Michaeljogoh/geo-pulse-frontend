'use client';

import { DegradedNotice } from '@/components/common/DegradedNotice';
import { useDashboard } from '@/hooks/useDashboard';
import { isResponseDegraded } from '@/lib/degraded';

/**
 * Global, non-blocking degraded signal from the aggregate dashboard payload.
 * Individual sections still show their own DegradedNotice; this never blanks the page.
 */
export function DashboardDegradedBanner() {
	const { data, meta, isLoading, isError } = useDashboard();

	if (isLoading || isError || !data) return null;

	const degraded = Boolean(data.degraded) || isResponseDegraded(meta);

	if (!degraded) return null;

	return (
		<div data-slot="dashboard-degraded-banner" role="status">
			<DegradedNotice message="Some sections may be using cached or degraded upstream data. Live sections continue to update independently." />
		</div>
	);
}
