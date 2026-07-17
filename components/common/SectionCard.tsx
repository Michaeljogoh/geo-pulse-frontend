import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Phase 5 — titled card with optional meta slot (Section 7 scaffold). */
export function SectionCard({
	title,
	meta,
	children,
	className,
}: {
	title?: ReactNode;
	meta?: ReactNode;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn(
				'rounded-[var(--radius-md)] border border-border bg-card text-card-foreground',
				className
			)}
		>
			{(title || meta) && (
				<header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
					{title ? (
						<h2 className="text-heading-md text-foreground">{title}</h2>
					) : (
						<span />
					)}
					{meta}
				</header>
			)}
			<div className="p-4">{children}</div>
		</section>
	);
}
