'use client';

import { memo, useState, type FormEvent } from 'react';
import { Trash2Icon } from 'lucide-react';

import { SignInButton } from '@/components/auth/SignInButton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { PercentChange } from '@/components/common/PercentChange';
import { SectionSkeletonBody } from '@/components/common/LoadingSkeletons';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useEffectiveCurrency } from '@/hooks/useEffectiveCurrency';
import { useGeo } from '@/hooks/useGeo';
import { useWatchlist } from '@/hooks/useWatchlist';
import { ApiClientError } from '@/lib/api/client';
import { displayValue } from '@/lib/display';
import { formatCurrency } from '@/lib/format';
import { deriveLocale } from '@/lib/locale';
import type { WatchlistItem } from '@/types/domain';

const WatchlistRow = memo(function WatchlistRow({
	item,
	locale,
	onRemove,
	disabled,
}: {
	item: WatchlistItem;
	locale: string;
	onRemove: (coinId: string) => void;
	disabled?: boolean;
}) {
	const unavailable = !item.available || !item.coin;

	return (
		<TableRow data-slot="watchlist-row" data-coin-id={item.coinId}>
			<TableCell>
				{unavailable ? (
					<div className="min-w-0">
						<p className="truncate text-sm font-medium text-foreground">
							{item.coinId}
						</p>
						<p className="text-muted-foreground text-xs">Price unavailable</p>
					</div>
				) : (
					<div className="min-w-0">
						<p className="truncate text-sm font-medium text-foreground">
							{item.coin!.name}
						</p>
						<p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
							{item.coin!.symbol}
						</p>
					</div>
				)}
			</TableCell>
			<TableCell className="text-right font-mono text-xs tabular-nums">
				{unavailable
					? '—'
					: formatCurrency(
							item.coin!.currentPrice,
							item.coin!.currency,
							locale
						)}
			</TableCell>
			<TableCell className="text-right">
				{unavailable ? (
					<span className="text-muted-foreground">—</span>
				) : (
					<PercentChange value={item.coin!.priceChangePct24h} />
				)}
			</TableCell>
			<TableCell className="text-right">
				<Button
					type="button"
					size="icon-sm"
					variant="ghost"
					disabled={disabled}
					aria-label={`Remove ${item.coinId} from watchlist`}
					onClick={() => onRemove(item.coinId)}
				>
					<Trash2Icon className="size-4" />
				</Button>
			</TableCell>
		</TableRow>
	);
});

/** Protected watchlist section. */
export function WatchlistPanel({ className }: { className?: string }) {
	const { status } = useAuth();
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const locale = deriveLocale(geo?.countryCode, geo?.timezone);
	const {
		data,
		isLoading,
		isError,
		error,
		refetch,
		addCoin,
		removeCoin,
		isMutating,
	} = useWatchlist(vs);

	const [coinId, setCoinId] = useState('');
	const [adding, setAdding] = useState(false);

	const errorMessage =
		error instanceof ApiClientError
			? error.message
			: error?.message ?? 'Watchlist is unavailable.';

	async function handleAdd(event: FormEvent) {
		event.preventDefault();
		const id = coinId.trim().toLowerCase();
		if (!id) return;
		setAdding(true);
		try {
			await addCoin(id);
			setCoinId('');
		} catch {
			// toast handled in hook
		} finally {
			setAdding(false);
		}
	}

	if (status === 'loading') {
		return (
			<SectionCard title="Watchlist" className={className}>
				<SectionSkeletonBody rows={3} />
			</SectionCard>
		);
	}

	if (status !== 'authed') {
		return (
			<SectionCard title="Watchlist" className={className}>
				<div className="flex flex-col items-start gap-3 py-2" data-slot="watchlist-gate">
					<EmptyState
						title="Sign in to track coins"
						description="Save coins to a private watchlist synced to your account."
					/>
					<SignInButton label="Sign in to track coins" />
				</div>
			</SectionCard>
		);
	}

	const items = data ?? [];

	return (
		<SectionCard
			title="Watchlist"
			className={className}
			meta={
				<span className="font-mono text-[10px] uppercase tracking-wide text-foreground/80">
					{vs}
				</span>
			}
		>
			{isLoading ? <SectionSkeletonBody rows={3} /> : null}

			{isError ? (
				<ErrorState
					title="Could not load watchlist"
					message={errorMessage}
					onRetry={refetch}
				/>
			) : null}

			{!isLoading && !isError ? (
				<div className="space-y-4">
					<form
						className="flex flex-wrap items-end gap-2"
						onSubmit={(event) => {
							void handleAdd(event);
						}}
					>
						<div className="min-w-40 flex-1 space-y-1">
							<Label htmlFor="watchlist-coin-id">Add coin</Label>
							<Input
								id="watchlist-coin-id"
								placeholder="bitcoin"
								value={coinId}
								onChange={(e) => setCoinId(e.target.value)}
								disabled={adding || isMutating}
								autoComplete="off"
								pattern="[a-z0-9-]{1,64}"
								title="CoinGecko id (lowercase letters, numbers, hyphens)"
							/>
						</div>
						<Button
							type="submit"
							size="sm"
							disabled={adding || isMutating || !coinId.trim()}
						>
							{adding ? 'Adding…' : 'Add'}
						</Button>
					</form>

					{items.length === 0 ? (
						<EmptyState
							title="No coins yet"
							description="Star a coin in Market overview or add a CoinGecko id above."
						/>
					) : (
						<div className="w-full overflow-x-auto" aria-live="polite">
							<Table aria-label="Watchlist">
								<TableHeader>
									<TableRow>
										<TableHead>Coin</TableHead>
										<TableHead className="text-right">Price</TableHead>
										<TableHead className="text-right">24h</TableHead>
										<TableHead className="w-10" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{items.map((item) => (
										<WatchlistRow
											key={item.coinId}
											item={item}
											locale={locale}
											disabled={isMutating}
											onRemove={(id) => {
												void removeCoin(id);
											}}
										/>
									))}
								</TableBody>
							</Table>
						</div>
					)}
					<p className="text-[10px] text-muted-foreground">
						{displayValue(items.length)} / 50 coins
					</p>
				</div>
			) : null}
		</SectionCard>
	);
}
