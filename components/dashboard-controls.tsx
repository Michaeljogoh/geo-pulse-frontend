'use client';

import { RefreshCwIcon } from 'lucide-react';
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

const CURRENCY_OPTIONS = [
	{ value: 'auto', label: 'Auto' },
	{ value: 'usd', label: 'USD' },
	{ value: 'eur', label: 'EUR' },
	{ value: 'gbp', label: 'GBP' },
	{ value: 'ngn', label: 'NGN' },
	{ value: 'inr', label: 'INR' },
	{ value: 'jpy', label: 'JPY' },
] as const;

/**
 * Phase 5 — currency override + auto-refresh, wired to Zustand.
 * Fits the existing AppHeader control row.
 */
export function DashboardControls() {
	const currencyOverride = useUiStore((s) => s.currencyOverride);
	const autoRefresh = useUiStore((s) => s.autoRefresh);
	const setCurrencyOverride = useUiStore((s) => s.setCurrencyOverride);
	const toggleAutoRefresh = useUiStore((s) => s.toggleAutoRefresh);

	const selectValue = currencyOverride?.toLowerCase() ?? 'auto';

	return (
		<div className="flex items-center gap-3">
			<div className="flex items-center gap-2">
				<Label
					htmlFor="currency-switch"
					className="text-xs font-normal text-muted-foreground"
				>
					<span className="sm:hidden">FX</span>
					<span className="hidden sm:inline">Currency</span>
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
						size="sm"
						aria-label="Currency"
						className="min-w-18 sm:min-w-22"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent align="end">
						{CURRENCY_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-2">
				<RefreshCwIcon
					className="hidden size-3.5 text-muted-foreground sm:block"
					aria-hidden
				/>
				<Label
					htmlFor="auto-refresh"
					className="hidden text-xs font-normal text-muted-foreground sm:inline"
				>
					Auto-refresh
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
