import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ExternalLinkProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	'rel' | 'target'
> & {
	href: string;
	children: ReactNode;
};

/** External anchors always open safely (`noopener noreferrer`). */
export function ExternalLink({
	href,
	children,
	className,
	...props
}: ExternalLinkProps) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(className)}
			{...props}
		>
			{children}
			<span className="sr-only"> (opens in a new tab)</span>
		</a>
	);
}
