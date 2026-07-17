/** Keyboard skip link to main content. */
export function SkipToContent({
	href = '#main-content',
}: {
	href?: string;
}) {
	return (
		<a
			href={href}
			className="bg-primary text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:px-3 focus:py-2 focus:ring-2 focus:outline-none"
		>
			Skip to content
		</a>
	);
}
