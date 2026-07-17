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
	inverted = false,
}: {
	label: string;
	value: string;
	mono?: boolean;
	inverted?: boolean;
}) {
	return (
		<div className="min-w-0 space-y-0.5">
			<p
				className={cn(
					'text-[10px] font-medium tracking-wide uppercase',
					inverted
						? 'text-[var(--on-aubergine-mute)]'
						: 'text-muted-foreground'
				)}
			>
				{label}
			</p>
			<p
				className={cn(
					'truncate text-sm',
					inverted ? 'text-primary-foreground' : 'text-foreground',
					mono && 'font-mono text-xs tabular-nums'
				)}
			>
				{value}
			</p>
		</div>
	);
}

function ConfidenceMeter({
	confidence,
	inverted = false,
}: {
	confidence: number;
	inverted?: boolean;
}) {
	const pct = Math.max(0, Math.min(100, Math.round(confidence * 100)));
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between gap-2">
				<p
					className={cn(
						'text-[10px] font-medium tracking-wide uppercase',
						inverted
							? 'text-[var(--on-aubergine-mute)]'
							: 'text-muted-foreground'
					)}
				>
					Confidence
				</p>
				<span
					className={cn(
						'font-mono text-xs tabular-nums',
						inverted ? 'text-primary-foreground' : 'text-foreground'
					)}
				>
					{pct}%
				</span>
			</div>
			<div
				className={cn(
					'h-1.5 overflow-hidden rounded-full',
					inverted ? 'bg-white/20' : 'bg-muted'
				)}
				role="meter"
				aria-label="IP confidence"
				aria-valuenow={pct}
				aria-valuemin={0}
				aria-valuemax={100}
			>
				<div
					className={cn(
						'h-full rounded-full transition-[width]',
						inverted ? 'bg-white' : 'bg-primary'
					)}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

/** Visitor geo / network intelligence. */
export function VisitorIntelligenceCard({
	className,
	tone = 'default',
}: {
	className?: string;
	tone?: 'default' | 'aubergine';
}) {
	const searchParams = useSearchParams();
	const demoIp = searchParams.get('ip') ?? undefined;
	const { data, meta, isLoading, isError, error, refetch } = useGeo(demoIp);
	const inverted = tone === 'aubergine';

	const errorMessage =
		error instanceof ApiClientError
			? error.message
			: error?.message ?? 'Live geo data is unavailable.';

	return (
		<SectionCard
			title="Visitor intelligence"
			className={cn(
				inverted &&
					'rounded-md border-0 bg-primary text-primary-foreground ring-0 [&_[data-slot=card-header]]:border-b [&_[data-slot=card-header]]:border-white/15',
				className
			)}
			meta={
				!isLoading && !isError ? (
					<MetaFooterBadge
						meta={meta}
						confidence={data?.confidence}
						className={
							inverted
								? 'text-primary-foreground/80 [&_span]:bg-white/15 [&_span]:text-primary-foreground'
								: undefined
						}
					/>
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
							<p
								className={cn(
									'text-xs',
									inverted
										? 'text-[var(--on-aubergine-mute)]'
										: 'text-muted-foreground'
								)}
							>
								{displayValue(data.city, 'Unknown')}
								{' · '}
								{displayValue(data.region, 'Unknown')}
							</p>
						</div>
						<NetworkBadge
							networkType={data.networkType}
							className={
								inverted
									? 'bg-white/15 text-primary-foreground'
									: undefined
							}
						/>
					</div>

					<ConfidenceMeter
						confidence={data.confidence}
						inverted={inverted}
					/>

					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						<Field
							label="IP"
							value={displayValue(data.ip)}
							mono
							inverted={inverted}
						/>
						<Field
							label="Timezone"
							value={displayValue(data.timezone, 'Unknown')}
							inverted={inverted}
						/>
						<Field
							label="Currency"
							value={displayValue(data.currency, 'Unknown')}
							mono
							inverted={inverted}
						/>
						<Field
							label="ISP"
							value={displayValue(data.isp, 'Unknown')}
							inverted={inverted}
						/>
						<Field
							label="Organization"
							value={displayValue(data.organization, 'Unknown')}
							inverted={inverted}
						/>
						<Field
							label="ASN"
							value={displayValue(data.asn, 'Unknown')}
							mono
							inverted={inverted}
						/>
						<Field
							label="ASN name"
							value={displayValue(data.asnName, 'Unknown')}
							inverted={inverted}
						/>
						<Field
							label="Latitude"
							value={displayValue(data.latitude, '—')}
							mono
							inverted={inverted}
						/>
						<Field
							label="Longitude"
							value={displayValue(data.longitude, '—')}
							mono
							inverted={inverted}
						/>
					</div>
				</div>
			) : null}
		</SectionCard>
	);
}
