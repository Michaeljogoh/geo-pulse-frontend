'use client';

import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Compact related-route strip under page bodies. */
export function PageRelatedLinks({
	links,
	className,
}: {
	links: { href: string; label: string; hint: string }[];
	className?: string;
}) {
	return (
		<nav
			aria-label="Related pages"
			className={cn(
				'flex flex-wrap gap-2 border-t border-hairline pt-4 dark:border-border',
				className
			)}
		>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className={cn(
						'group inline-flex items-center gap-2 rounded-full border border-hairline',
						'bg-surface-card px-3 py-1.5 text-sm font-medium text-foreground/80',
						'transition-[background-color,color,transform] duration-150 ease-out',
						'hover:bg-secondary hover:text-foreground active:scale-[0.98]',
						'dark:border-border dark:bg-muted/30'
					)}
				>
					<span>{link.label}</span>
					<span className="hidden text-caption-sm text-muted-foreground sm:inline">
						{link.hint}
					</span>
					<ArrowUpRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
				</Link>
			))}
		</nav>
	);
}

/** Soft insight callout — one idea per page. */
export function PageInsight({
	title,
	body,
	className,
}: {
	title: string;
	body: string;
	className?: string;
}) {
	return (
		<aside
			className={cn(
				'rounded-md border border-hairline bg-surface-card px-4 py-3',
				'dark:border-border dark:bg-muted/30',
				className
			)}
		>
			<p className="text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">
				{title}
			</p>
			<p className="mt-1 text-sm text-muted-foreground text-pretty">{body}</p>
		</aside>
	);
}
