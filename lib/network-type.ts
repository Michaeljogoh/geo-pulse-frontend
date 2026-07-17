import type { NetworkType } from '@/types/domain';

/** Map networkType → Tailwind token class (Section 8.2 semantic colors). */
export function networkTypeColorClass(networkType: NetworkType): string {
	switch (networkType) {
		case 'residential':
			return 'bg-network-residential text-white';
		case 'mobile':
			return 'bg-network-mobile text-white';
		case 'datacenter':
			return 'bg-network-datacenter text-white';
		case 'proxy_vpn':
			return 'bg-network-proxy text-white';
		case 'unknown':
		default:
			return 'bg-network-unknown text-white';
	}
}
