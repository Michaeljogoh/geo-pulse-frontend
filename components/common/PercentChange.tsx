import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/format';

/** Honest percent cell — null/undefined → "—", never fabricated. */
export function PercentChange({
	value,
	className,
}: {
	value: number | null | undefined;
	className?: string;
}) {
	if (value === null || value === undefined) {
		return (
			<span className={cn('text-muted-foreground', className)}>—</span>
		);
	}

	const tone =
		value > 0 ? 'text-gain' : value < 0 ? 'text-loss' : 'text-muted-foreground';

	return (
		<span
			className={cn('font-mono text-xs tabular-nums', tone, className)}
		>
			{formatPercent(value)}
		</span>
	);
}
