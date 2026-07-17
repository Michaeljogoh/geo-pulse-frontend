'use client';

import { usePathname } from 'next/navigation';
import { BellIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getActiveNavItem } from '@/components/app-shared';
import { AppBreadcrumbs } from '@/components/app-breadcrumbs';
import { AuthHeaderControls } from '@/components/auth/AuthHeaderControls';
import { CustomSidebarTrigger } from '@/components/custom-sidebar-trigger';
import { DashboardControls } from '@/components/dashboard-controls';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { Button } from '@/components/ui/button';

/** Slack-adjacent header icon chrome — quiet lavender ghost, not bordered white pills. */
export const headerChromeBtn =
	'h-8 w-8 shrink-0 rounded-[10px] border-0 bg-transparent text-mute shadow-none ' +
	'hover:bg-secondary hover:text-foreground ' +
	'transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97] ' +
	'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground';

export function AppHeader() {
	const pathname = usePathname();
	const activeItem = getActiveNavItem(pathname);

	return (
		<header
			className={cn(
				'sticky top-0 z-50 flex h-14 shrink-0 items-center gap-3 border-b border-hairline px-3 md:px-4',
				'bg-canvas/90 backdrop-blur-md supports-backdrop-filter:bg-canvas/75',
				'dark:border-border dark:bg-background/90'
			)}
		>
			<div className="flex min-w-0 flex-1 items-center gap-2">
				<CustomSidebarTrigger className={headerChromeBtn} />
				<div
					aria-hidden
					className="hidden h-4 w-px shrink-0 bg-hairline sm:block dark:bg-border"
				/>
				<div className="min-w-0 truncate">
					<AppBreadcrumbs page={activeItem} />
				</div>
			</div>

			<div
				className={cn(
					'flex shrink-0 items-center gap-1 rounded-[12px] border border-hairline bg-secondary/70 p-1',
					'dark:border-border dark:bg-muted/40'
				)}
			>
				<DashboardControls />
				<div
					aria-hidden
					className="mx-0.5 hidden h-5 w-px shrink-0 bg-hairline sm:block dark:bg-border"
				/>
				<div className="flex items-center gap-0.5">
					<ThemeToggleButton className={headerChromeBtn} />
					<Button
						aria-label="Notifications"
						size="icon-sm"
						variant="ghost"
						className={headerChromeBtn}
					>
						<BellIcon className="size-4" />
					</Button>
					<AuthHeaderControls />
				</div>
			</div>
		</header>
	);
}
