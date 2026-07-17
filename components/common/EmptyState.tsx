/** Honest empty section — used when lists have no rows (Phase 12). */
export function EmptyState({
	title = 'Nothing here yet',
	description = 'No items to show.',
}: {
	title?: string;
	description?: string;
}) {
	return (
		<div
			className="flex min-h-24 flex-col items-start justify-center gap-1 py-3"
			data-slot="empty-state"
			role="status"
		>
			<p className="text-sm font-medium text-foreground">{title}</p>
			<p className="text-muted-foreground text-xs">{description}</p>
		</div>
	);
}
