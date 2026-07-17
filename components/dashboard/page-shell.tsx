'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SummaryMetric = {
	label: string;
	value: ReactNode;
	hint?: ReactNode;
	icon?: ReactNode;
	tone?: 'default' | 'gain' | 'loss' | 'brand';
};

/** Premium top-of-page metric card (DESIGN.md surface-card + hairline). */
export function SummaryMetricCard({
	label,
	value,
	hint,
	icon,
	tone = 'default',
	className,
}: SummaryMetric & { className?: string }) {
	const toneClass =
		tone === 'gain'
			? 'text-gain'
			: tone === 'loss'
				? 'text-loss'
				: tone === 'brand'
					? 'text-primary'
					: 'text-foreground';

	return (
		<div
			className={cn(
				'flex min-h-[7.5rem] flex-col justify-between rounded-[var(--radius-md)] border border-hairline bg-surface-card p-4',
				'shadow-[0_1px_0_rgb(0_0_0/0.02)] transition-[transform,box-shadow] duration-150 ease-out',
				'hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.06)]',
				'dark:border-border dark:bg-muted/30',
				className
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<p className="text-[10px] font-semibold tracking-[0.14em] text-mute uppercase">
					{label}
				</p>
				{icon ? (
					<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:size-4">
						{icon}
					</span>
				) : null}
			</div>
			<div className="mt-3 space-y-1">
				<div
					className={cn(
						'font-heading text-2xl font-bold tracking-tight tabular-nums',
						toneClass
					)}
				>
					{value}
				</div>
				{hint ? (
					<p className="text-caption-sm text-muted-foreground text-pretty">
						{hint}
					</p>
				) : null}
			</div>
		</div>
	);
}

export function SummaryMetricGrid({
	metrics,
	className,
}: {
	metrics: SummaryMetric[];
	className?: string;
}) {
	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4',
				className
			)}
		>
			{metrics.map((metric) => (
				<SummaryMetricCard key={metric.label} {...metric} />
			))}
		</div>
	);
}

/** Shared premium page chrome for standalone dashboard routes. */
export function DashboardPageShell({
	title,
	description,
	actions,
	metrics,
	children,
	className,
}: {
	title?: string;
	description?: string;
	actions?: ReactNode;
	metrics?: SummaryMetric[];
	children: ReactNode;
	className?: string;
}) {
	const showHeader = Boolean(title || description || actions);

	return (
		<div
			className={cn('flex flex-col gap-6', className)}
			data-slot="dashboard-page"
		>
			{showHeader ? (
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					{(title || description) ? (
						<div className="space-y-1.5">
							<p className="text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
								GeoPulse
							</p>
							{title ? (
								<h1 className="font-heading text-heading-xl tracking-tight text-balance">
									{title}
								</h1>
							) : null}
							{description ? (
								<p className="max-w-2xl text-sm text-muted-foreground text-pretty">
									{description}
								</p>
							) : null}
						</div>
					) : null}
					{actions ? (
						<div className="flex shrink-0 flex-wrap items-center gap-2">
							{actions}
						</div>
					) : null}
				</div>
			) : null}

			{metrics && metrics.length > 0 ? (
				<SummaryMetricGrid metrics={metrics} />
			) : null}

			{children}
		</div>
	);
}
