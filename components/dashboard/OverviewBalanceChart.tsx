'use client';

import { useEffect, useMemo, useState } from 'react';
import {
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

import {
	formatChartTooltipDate,
	formatDate,
} from '@/components/formater';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from '@/components/ui/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { OverviewChartSkeleton } from '@/components/dashboard/page-skeletons';
import { useEffectiveCurrency } from '@/hooks/useEffectiveCurrency';
import { useGeo } from '@/hooks/useGeo';
import { useMarket } from '@/hooks/useMarket';
import { MARKET_LIMIT } from '@/config/constants';
import { formatCurrency, formatPercent } from '@/lib/format';
import { deriveLocale } from '@/lib/locale';
import { cn } from '@/lib/utils';
import type { Coin } from '@/types/domain';

const RANGES = ['D', 'W', 'M', '6M', 'Y', 'ALL'] as const;
type RangeKey = (typeof RANGES)[number];

const RANGE_DAYS: Record<RangeKey, number> = {
	D: 1,
	W: 7,
	M: 30,
	'6M': 180,
	Y: 365,
	ALL: 720,
};

const RANGE_POINTS: Record<RangeKey, number> = {
	D: 12,
	W: 7,
	M: 14,
	'6M': 18,
	Y: 12,
	ALL: 24,
};

type ChartRow = {
	date: string;
	value: number;
	pct: number;
};

const chartConfig = {
	value: {
		label: 'Value',
		color: 'var(--foreground)',
	},
} satisfies ChartConfig;

/** Deterministic pseudo-random in [0, 1) from a string seed. */
function seededUnit(seed: string): number {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return ((h >>> 0) % 10_000) / 10_000;
}

/**
 * Build a smooth series that ends at `endValue`.
 * Shape is illustrative (no historical API yet) but seeded by live price + range.
 */
function buildSeries(
	endValue: number,
	changePct: number,
	range: RangeKey,
	coinId: string
): ChartRow[] {
	const points = RANGE_POINTS[range];
	const days = RANGE_DAYS[range];
	const stepMs = (days * 86_400_000) / Math.max(points - 1, 1);
	const end = Date.now();
	const startValue = endValue / (1 + changePct / 100);
	const rows: ChartRow[] = [];

	for (let i = 0; i < points; i++) {
		const t = points === 1 ? 1 : i / (points - 1);
		const ease = t * t * (3 - 2 * t);
		const drift = startValue + (endValue - startValue) * ease;
		const wobble =
			(seededUnit(`${coinId}-${range}-${i}-${Math.round(endValue)}`) - 0.5) *
			endValue *
			0.06 *
			(1 - Math.abs(t - 0.5) * 0.4);
		const value = Math.max(0, drift + wobble);
		const date = new Date(end - (points - 1 - i) * stepMs)
			.toISOString()
			.slice(0, 10);
		rows.push({ date, value, pct: 0 });
	}

	const min = Math.min(...rows.map((r) => r.value));
	const max = Math.max(...rows.map((r) => r.value));
	const span = max - min || 1;

	return rows.map((r) => ({
		...r,
		pct: ((r.value - min) / span) * 100,
	}));
}

function BalanceTooltip({
	active,
	payload,
	currency,
	locale,
}: {
	active?: boolean;
	payload?: Array<{ payload?: ChartRow }>;
	currency: string;
	locale: string;
}) {
	if (!active || !payload?.length) return null;
	const row = payload[0]?.payload;
	if (!row) return null;

	return (
		<div className="rounded-lg border border-hairline bg-surface-dark px-3 py-2 shadow-[rgba(0,0,0,0.2)_0_1px_10px_0] dark:border-white/10">
			<p className="font-heading text-sm font-bold tracking-tight text-white tabular-nums">
				{formatCurrency(row.value, currency, locale)}
			</p>
			<p className="mt-0.5 text-[11px] text-(--on-aubergine-mute)">
				{formatChartTooltipDate(row.date, 'long')}
			</p>
		</div>
	);
}

function CoinPicker({
	coins,
	value,
	onChange,
	disabled,
}: {
	coins: Coin[];
	value: string;
	onChange: (coinId: string) => void;
	disabled?: boolean;
}) {
	const selected = coins.find((c) => c.id === value);

	return (
		<Select
			value={value || undefined}
			onValueChange={(next) => {
				if (next) onChange(String(next));
			}}
			disabled={disabled || coins.length === 0}
		>
			<SelectTrigger
				aria-label="Select coin"
				className={cn(
					'h-8 w-auto min-w-[7.5rem] gap-1.5 rounded-full border-hairline bg-secondary px-3',
					'font-heading text-xs font-semibold shadow-none',
					'hover:bg-secondary/80 transition-[background-color,transform] duration-150 ease-out',
					'active:scale-[0.97]',
					'focus-visible:ring-2 focus-visible:ring-primary/25',
					'dark:border-border'
				)}
			>
				{selected?.image ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={selected.image}
						alt=""
						width={16}
						height={16}
						className="size-4 rounded-full"
					/>
				) : null}
				<span className="font-mono text-[11px] tracking-wide uppercase">
					{selected?.symbol ?? 'Coin'}
				</span>
				<span className="sr-only">
					<SelectValue />
				</span>
			</SelectTrigger>
			<SelectContent
				align="start"
				alignItemWithTrigger={false}
				className="max-h-72 min-w-56 rounded-[12px] border-hairline p-1.5 shadow-[0_8px_24px_rgb(0_0_0/0.08)]"
			>
				{coins.map((coin) => (
					<SelectItem
						key={coin.id}
						value={coin.id}
						className="rounded-[10px] py-2 pr-8 pl-2.5 focus:bg-primary/8 focus:text-foreground"
					>
						<span className="flex items-center gap-2">
							{coin.image ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={coin.image}
									alt=""
									width={18}
									height={18}
									className="size-[18px] rounded-full"
								/>
							) : null}
							<span className="font-mono text-xs font-semibold tracking-wide uppercase">
								{coin.symbol}
							</span>
							<span className="truncate text-[11px] text-muted-foreground">
								{coin.name}
							</span>
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export function OverviewBalanceChart() {
	const [range, setRange] = useState<RangeKey>('M');
	const [selectedCoinId, setSelectedCoinId] = useState('');
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data: market, isLoading } = useMarket(vs, MARKET_LIMIT);
	const locale = deriveLocale(geo?.countryCode, geo?.timezone);
	const coins = market ?? [];

	useEffect(() => {
		if (coins.length === 0) return;
		const stillValid = coins.some((c) => c.id === selectedCoinId);
		if (!stillValid) {
			setSelectedCoinId(coins[0]!.id);
		}
	}, [coins, selectedCoinId]);

	const selected =
		coins.find((c) => c.id === selectedCoinId) ?? coins[0] ?? null;
	const endValue = selected?.currentPrice ?? 0;
	const changePct = selected?.priceChangePct24h ?? 0;
	const currency = selected?.currency ?? vs;
	const coinId = selected?.id ?? 'market';

	const series = useMemo(
		() => buildSeries(endValue, changePct, range, coinId),
		[endValue, changePct, range, coinId]
	);

	const isUp = changePct >= 0;

	if (isLoading) {
		return <OverviewChartSkeleton />;
	}

	return (
		<section
			aria-label="Market value chart"
			className={cn(
				'rounded-md border border-hairline bg-surface-card p-5 sm:p-6',
				'shadow-[0_1px_0_rgb(0_0_0/0.02)]',
				'dark:border-border dark:bg-muted/30'
			)}
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0 space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-sm text-muted-foreground">Market value</p>
						<CoinPicker
							coins={coins}
							value={selected?.id ?? ''}
							onChange={setSelectedCoinId}
						/>
					</div>
					<div className="flex flex-wrap items-baseline gap-2.5">
						<p className="font-heading text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-[2rem]">
							{selected
								? formatCurrency(endValue, currency, locale)
								: '—'}
						</p>
						{selected ? (
							<span
								className={cn(
									'inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums',
									isUp ? 'text-gain' : 'text-loss'
								)}
							>
								{isUp ? (
									<ArrowUpIcon className="size-3.5" aria-hidden />
								) : (
									<ArrowDownIcon className="size-3.5" aria-hidden />
								)}
								{formatPercent(changePct).replace(/^[+-]/, '')}
							</span>
						) : null}
					</div>
					{selected ? (
						<p className="text-caption-sm text-muted-foreground">
							{selected.name}
						</p>
					) : (
						<p className="text-caption-sm text-muted-foreground">
							Market data unavailable
						</p>
					)}
				</div>

				<div
					role="tablist"
					aria-label="Chart range"
					className="flex shrink-0 flex-wrap items-center gap-0.5 self-start"
				>
					{RANGES.map((key) => {
						const active = key === range;
						return (
							<button
								key={key}
								type="button"
								role="tab"
								aria-selected={active}
								onClick={() => setRange(key)}
								disabled={!selected}
								className={cn(
									'rounded-full px-2.5 py-1.5 text-xs font-bold tracking-wide transition-[color,background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]',
									'active:scale-[0.97]',
									active
										? 'bg-secondary text-foreground'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{key}
							</button>
						);
					})}
				</div>
			</div>

			{selected ? (
				<ChartContainer
					className="mt-6 aspect-auto h-[240px] w-full p-0 sm:h-[280px]"
					config={chartConfig}
				>
					<LineChart
						accessibilityLayer
						data={series}
						margin={{ left: 4, right: 8, top: 12, bottom: 0 }}
					>
						<CartesianGrid
							horizontal
							vertical={false}
							stroke="var(--hairline)"
							strokeDasharray="0"
							className="opacity-80 dark:opacity-40"
						/>
						<YAxis
							dataKey="pct"
							domain={[0, 100]}
							ticks={[0, 20, 40, 60, 80, 100]}
							tickFormatter={(v) => `${String(v).padStart(2, '0')}%`}
							axisLine={false}
							tickLine={false}
							width={40}
							tick={{ fill: 'var(--mute)', fontSize: 11 }}
						/>
						<XAxis
							dataKey="date"
							axisLine={false}
							tickLine={false}
							tickMargin={10}
							minTickGap={28}
							tickFormatter={(value) =>
								formatDate(String(value), 'day-month')
							}
							tick={{ fill: 'var(--mute)', fontSize: 11 }}
						/>
						<ChartTooltip
							cursor={{
								stroke: 'var(--gain)',
								strokeWidth: 1,
								strokeDasharray: '4 4',
							}}
							content={
								<BalanceTooltip currency={currency} locale={locale} />
							}
						/>
						<Line
							type="monotone"
							dataKey="pct"
							stroke="var(--color-value)"
							strokeWidth={2}
							dot={false}
							activeDot={{
								r: 6,
								fill: 'var(--gain)',
								stroke: 'var(--gain)',
								strokeWidth: 0,
								filter: 'drop-shadow(0 0 6px rgb(0 122 90 / 0.55))',
							}}
							isAnimationActive
							animationDuration={280}
							animationEasing="ease-out"
						/>
					</LineChart>
				</ChartContainer>
			) : (
				<div className="mt-6 flex h-[240px] items-center justify-center rounded-md bg-muted/40 sm:h-[280px]">
					<p className="text-sm text-muted-foreground">No chart data yet</p>
				</div>
			)}
		</section>
	);
}
