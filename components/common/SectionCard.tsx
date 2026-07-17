'use client';

import { useId, type ReactNode } from 'react';
import {
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { DashboardCard } from '@/components/dashboard-card';
import { cn } from '@/lib/utils';

/**
 * Section wrapper matched to the dashboard lattice.
 * Uses region + h2 for accessible section structure.
 */
export function SectionCard({
	title,
	meta,
	children,
	className,
	contentClassName,
}: {
	title?: ReactNode;
	meta?: ReactNode;
	children?: ReactNode;
	className?: string;
	contentClassName?: string;
}) {
	const titleId = useId();
	const labelledBy =
		typeof title === 'string' ? titleId : undefined;

	return (
		<DashboardCard
			role="region"
			aria-labelledby={labelledBy}
			className={cn('min-h-48', className)}
		>
			{(title || meta) && (
				<CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-border/60 [.border-b]:pb-3">
					{title ? (
						typeof title === 'string' ? (
							<h2
								id={titleId}
								className="font-heading text-xs leading-snug font-normal tracking-wide"
							>
								{title}
							</h2>
						) : (
							<CardTitle className="font-normal text-xs tracking-wide">
								{title}
							</CardTitle>
						)
					) : (
						<span />
					)}
					{meta ? (
						<div className="text-muted-foreground text-xs">{meta}</div>
					) : null}
				</CardHeader>
			)}
			<CardContent className={cn('pt-0', contentClassName)}>
				{children}
			</CardContent>
		</DashboardCard>
	);
}
