'use client';

import { useSearchParams } from 'next/navigation';
import { DegradedNotice } from '@/components/common/DegradedNotice';
import { SectionCard } from '@/components/common/SectionCard';
import { VisitorSkeleton } from '@/components/common/LoadingSkeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { NetworkBadge } from '@/components/dashboard/NetworkBadge';
import { MetaFooterBadge } from '@/components/dashboard/MetaFooterBadge';
import { useGeo } from '@/hooks/useGeo';
import { countryFlagEmoji, displayValue } from '@/lib/display';
import { ApiClientError } from '@/lib/api/client';
import { isResponseDegraded } from '@/lib/degraded';
import { cn } from '@/lib/utils';

function Field({
	label,
	value,
	mono = false,
}: {
	label: string;
	value: string;
	mono?: boolean;
}) {
	return (
		<div className="min-w-0 space-y-0.5">
			<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
				{label}
			</p>
			<p
				className={cn(
					'truncate text-sm text-foreground',
					mono && 'font-mono text-xs tabular-nums'
				)}
			>
				{value}
			</p>
		</div>
	);
}

function ConfidenceMeter({ confidence }: { confidence: number }) {
	const pct = Math.max(0, Math.min(100, Math.round(confidence * 100)));
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between gap-2">
				<p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
					Confidence
				</p>
				<span className="font-mono text-xs tabular-nums text-foreground">
					{pct}%
				</span>
			</div>
			<div
				className="h-1.5 overflow-hidden rounded-full bg-muted"
				role="meter"
				aria-label="IP confidence"
				aria-valuenow={pct}
				aria-valuemin={0}
				aria-valuemax={100}
			>
				<div
					className="h-full rounded-full bg-primary transition-[width]"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

/** Phase 6 — visitor geo / network intelligence. */
export function VisitorIntelligenceCard({
	className,
}: {
	className?: string;
}) {
	const searchParams = useSearchParams();
	const demoIp = searchParams.get('ip') ?? undefined;
	const { data, meta, isLoading, isError, error, refetch } = useGeo(demoIp);

	const errorMessage =
		error instanceof ApiClientError
			? error.message
			: error?.message ?? 'Live geo data is unavailable.';

	return (
		<SectionCard
			title="Visitor intelligence"
			className={className}
			meta={
				!isLoading && !isError ? (
					<MetaFooterBadge meta={meta} confidence={data?.confidence} />
				) : null
			}
		>
			{isLoading ? <VisitorSkeleton /> : null}

			{isError ? (
				<ErrorState
					title="Could not load visitor data"
					message={errorMessage}
					onRetry={refetch}
				/>
			) : null}

			{!isLoading && !isError && data ? (
				<div className="space-y-4">
					{isResponseDegraded(meta) ? <DegradedNotice /> : null}
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div className="min-w-0 space-y-1">
							<p className="flex items-center gap-2 text-base font-semibold tracking-tight">
								{countryFlagEmoji(data.countryCode) ? (
									<span aria-hidden>{countryFlagEmoji(data.countryCode)}</span>
								) : null}
								<span className="truncate">
									{displayValue(data.country, 'Unknown')}
								</span>
							</p>
							<p className="text-muted-foreground text-xs">
								{displayValue(data.city, 'Unknown')}
								{' · '}
								{displayValue(data.region, 'Unknown')}
							</p>
						</div>
						<NetworkBadge networkType={data.networkType} />
					</div>

					<ConfidenceMeter confidence={data.confidence} />

					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						<Field label="IP" value={displayValue(data.ip)} mono />
						<Field label="Timezone" value={displayValue(data.timezone, 'Unknown')} />
						<Field
							label="Currency"
							value={displayValue(data.currency, 'Unknown')}
							mono
						/>
						<Field label="ISP" value={displayValue(data.isp, 'Unknown')} />
						<Field
							label="Organization"
							value={displayValue(data.organization, 'Unknown')}
						/>
						<Field label="ASN" value={displayValue(data.asn, 'Unknown')} mono />
						<Field
							label="ASN name"
							value={displayValue(data.asnName, 'Unknown')}
						/>
						<Field
							label="Latitude"
							value={displayValue(data.latitude, '—')}
							mono
						/>
						<Field
							label="Longitude"
							value={displayValue(data.longitude, '—')}
							mono
						/>
					</div>
				</div>
			) : null}
		</SectionCard>
	);
}
