'use client';

import { BanknoteIcon, RefreshCwIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const CURRENCY_OPTIONS = [
	{ value: 'auto', label: 'Auto', hint: 'From location' },
	{ value: 'usd', label: 'USD', hint: 'US Dollar' },
	{ value: 'eur', label: 'EUR', hint: 'Euro' },
	{ value: 'gbp', label: 'GBP', hint: 'British Pound' },
	{ value: 'ngn', label: 'NGN', hint: 'Nigerian Naira' },
	{ value: 'inr', label: 'INR', hint: 'Indian Rupee' },
	{ value: 'jpy', label: 'JPY', hint: 'Japanese Yen' },
] as const;

/**
 * Dashboard header controls — currency + live refresh.
 * Nested inside the header toolbar cluster (DESIGN-slack.md lavender chrome).
 */
export function DashboardControls() {
	const currencyOverride = useUiStore((s) => s.currencyOverride);
	const autoRefresh = useUiStore((s) => s.autoRefresh);
	const setCurrencyOverride = useUiStore((s) => s.setCurrencyOverride);
	const toggleAutoRefresh = useUiStore((s) => s.toggleAutoRefresh);

	const selectValue = currencyOverride?.toLowerCase() ?? 'auto';
	const activeLabel =
		CURRENCY_OPTIONS.find((option) => option.value === selectValue)?.label ??
		'Auto';

	return (
		<div className="flex items-center gap-1">
			<div className="flex items-center">
				<Label htmlFor="currency-switch" className="sr-only">
					Currency
				</Label>
				<Select
					value={selectValue}
					onValueChange={(value) => {
						if (value == null || value === 'auto') {
							setCurrencyOverride(null);
							return;
						}
						setCurrencyOverride(String(value));
					}}
				>
					<SelectTrigger
						id="currency-switch"
						aria-label={`Currency: ${activeLabel}`}
						className={cn(
							'h-8 min-w-[4.5rem] gap-1.5 rounded-[10px] border-0 bg-canvas px-2.5 pr-2 shadow-none',
							'font-heading text-sm font-semibold text-foreground',
							'hover:bg-canvas/80 transition-[background-color,transform] duration-150 ease-out',
							'active:scale-[0.98]',
							'focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary/25',
							'dark:bg-background/60 dark:hover:bg-background/80',
							'data-[size=sm]:h-8 data-[size=sm]:rounded-[10px]'
						)}
					>
						<span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
							<BanknoteIcon className="size-3" aria-hidden />
						</span>
						<span className="font-mono text-[11px] tracking-wide uppercase">
							{activeLabel}
						</span>
						<span className="sr-only">
							<SelectValue />
						</span>
					</SelectTrigger>
					<SelectContent
						align="end"
						alignItemWithTrigger={false}
						className="min-w-52 rounded-[12px] border-hairline p-1.5 shadow-[0_8px_24px_rgb(0_0_0/0.08)]"
					>
						{CURRENCY_OPTIONS.map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
								title={option.hint}
								className={cn(
									'rounded-[10px] py-2.5 pr-8 pl-2.5 font-mono text-xs font-semibold tracking-wide uppercase',
									'focus:bg-primary/8 focus:text-foreground'
								)}
							>
								{option.label}
								<span className="ml-2 font-sans text-[11px] font-normal tracking-normal text-muted-foreground normal-case">
									{option.hint}
								</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div
				className={cn(
					'flex h-8 items-center gap-1.5 rounded-[10px] bg-canvas px-2',
					'dark:bg-background/60'
				)}
			>
				<span className="relative flex size-2 shrink-0" aria-hidden>
					<span
						className={cn(
							'absolute inset-0 rounded-full',
							autoRefresh
								? 'animate-ping bg-gain/40'
								: 'bg-transparent'
						)}
					/>
					<span
						className={cn(
							'relative size-2 rounded-full',
							autoRefresh ? 'bg-gain' : 'bg-stone'
						)}
					/>
				</span>
				<RefreshCwIcon
					className={cn(
						'hidden size-3.5 sm:block',
						autoRefresh ? 'text-primary' : 'text-mute'
					)}
					aria-hidden
				/>
				<Label
					htmlFor="auto-refresh"
					className="hidden cursor-pointer text-[11px] font-semibold tracking-wide text-foreground sm:inline"
				>
					Live
				</Label>
				<Switch
					id="auto-refresh"
					size="sm"
					checked={autoRefresh}
					onCheckedChange={() => toggleAutoRefresh()}
					aria-label="Toggle auto-refresh"
				/>
			</div>
		</div>
	);
}
