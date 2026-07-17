'use client';

import Image from 'next/image';
import { memo } from 'react';
import { StarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { PercentChange } from '@/components/common/PercentChange';
import { displayValue } from '@/lib/display';
import { formatCompact, formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Coin } from '@/types/domain';

const CoinCell = memo(function CoinCell({ coin }: { coin: Coin }) {
	const alt = `${coin.name} (${coin.symbol}) logo`;

	return (
		<div className="flex min-w-0 items-center gap-2">
			{coin.image ? (
				<Image
					src={coin.image}
					alt={alt}
					width={24}
					height={24}
					className="size-6 shrink-0 rounded-full bg-muted"
					unoptimized={
						!coin.image.includes('coingecko.com') &&
						!coin.image.includes('cryptologos.cc')
					}
				/>
			) : (
				<span
					aria-hidden
					className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground"
				>
					{coin.symbol.slice(0, 1).toUpperCase()}
				</span>
			)}
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{coin.name}
				</p>
				<p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
					{coin.symbol}
				</p>
			</div>
		</div>
	);
});

export type MarketWatchlistControls = {
	watchedIds: Set<string>;
	onToggle: (coinId: string, nextWatched: boolean) => void;
	disabled?: boolean;
};

const MarketRow = memo(function MarketRow({
	coin,
	locale,
	watchlist,
}: {
	coin: Coin;
	locale: string;
	watchlist?: MarketWatchlistControls;
}) {
	const watched = watchlist?.watchedIds.has(coin.id) ?? false;

	return (
		<TableRow>
			{watchlist ? (
				<TableCell className="w-10">
					<Button
						type="button"
						size="icon-sm"
						variant="ghost"
						disabled={watchlist.disabled}
						aria-label={
							watched
								? `Remove ${coin.name} from watchlist`
								: `Add ${coin.name} to watchlist`
						}
						aria-pressed={watched}
						onClick={() => watchlist.onToggle(coin.id, !watched)}
					>
						<StarIcon
							className={cn(
								'size-4',
								watched && 'fill-warning text-warning'
							)}
						/>
					</Button>
				</TableCell>
			) : null}
			<TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
				{displayValue(coin.marketCapRank, '—')}
			</TableCell>
			<TableCell>
				<CoinCell coin={coin} />
			</TableCell>
			<TableCell className="text-right font-mono text-xs tabular-nums">
				{formatCurrency(coin.currentPrice, coin.currency, locale)}
			</TableCell>
			<TableCell className="text-right">
				<PercentChange value={coin.priceChangePct24h} />
			</TableCell>
			<TableCell className="hidden text-right font-mono text-xs tabular-nums sm:table-cell">
				{coin.marketCap == null
					? '—'
					: formatCompact(coin.marketCap, locale)}
			</TableCell>
			<TableCell className="hidden text-right font-mono text-xs tabular-nums md:table-cell">
				{coin.totalVolume == null
					? '—'
					: formatCompact(coin.totalVolume, locale)}
			</TableCell>
		</TableRow>
	);
});

/** Market table; optional watchlist star column when authed. */
export function MarketTable({
	coins,
	locale,
	className,
	watchlist,
}: {
	coins: Coin[];
	locale: string;
	className?: string;
	watchlist?: MarketWatchlistControls;
}) {
	if (coins.length === 0) {
		return (
			<p className="text-muted-foreground py-4 text-sm">
				No market data available.
			</p>
		);
	}

	return (
		<div
			className={cn(
				'w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]',
				className
			)}
			role="region"
			aria-label="Market overview table"
			tabIndex={0}
			data-slot="scroll-area"
		>
			<Table className="min-w-[36rem]">
				<TableHeader>
					<TableRow>
						{watchlist ? <TableHead className="w-10" /> : null}
						<TableHead className="w-10">#</TableHead>
						<TableHead>Coin</TableHead>
						<TableHead className="text-right">Price</TableHead>
						<TableHead className="text-right">24h</TableHead>
						<TableHead className="hidden text-right sm:table-cell">
							Market cap
						</TableHead>
						<TableHead className="hidden text-right md:table-cell">
							Volume
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{coins.map((coin) => (
						<MarketRow
							key={coin.id}
							coin={coin}
							locale={locale}
							watchlist={watchlist}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
