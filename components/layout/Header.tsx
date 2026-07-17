'use client';

import type { ReactNode } from 'react';

import { AuthHeaderControls } from '@/components/auth/AuthHeaderControls';
import { DashboardControls } from '@/components/dashboard-controls';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { GeoPulseLogo } from '@/components/brand/geopulse-logo';

/**
 * Layout Header — brand + currency + theme + auto-refresh + auth
 * (Section 10/11 map). Production chrome also uses `AppHeader`.
 */
export function Header(_props?: { children?: ReactNode }) {
	return (
		<header className="flex h-14 items-center justify-between gap-3 border-b border-border px-4">
			<GeoPulseLogo />
			<div className="flex items-center gap-3">
				<DashboardControls />
				<ThemeToggleButton />
				<AuthHeaderControls />
			</div>
		</header>
	);
}
