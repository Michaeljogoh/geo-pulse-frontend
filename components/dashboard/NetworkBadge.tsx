import { Badge } from '@/components/ui/badge';
import { networkTypeColorClass } from '@/lib/network-type';
import { networkTypeLabel } from '@/lib/display';
import type { NetworkType } from '@/types/domain';
import { cn } from '@/lib/utils';

/** Phase 6 — colored badge per networkType. */
export function NetworkBadge({
	networkType,
	className,
}: {
	networkType: NetworkType;
	className?: string;
}) {
	return (
		<Badge
			variant="outline"
			className={cn(
				'border-transparent font-medium capitalize',
				networkTypeColorClass(networkType),
				className
			)}
		>
			{networkTypeLabel(networkType)}
		</Badge>
	);
}
