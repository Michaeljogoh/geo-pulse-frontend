'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronDownIcon, LogOutIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { clearAuthSessionCookie } from '@/lib/auth-session-cookie';
import { useAuth } from '@/hooks/useAuth';
import { useMe } from '@/hooks/useMe';
import { GeoPulseIcon } from '@/components/brand/geopulse-logo';
import { navGroups } from '@/components/app-shared';
import { NavGroup } from '@/components/nav-group';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from '@/components/ui/sidebar';

/**
 * GeoPulse dashboard sidebar — Slack aubergine chrome,
 * cream active nav, workspace-style brand header.
 */
export function AppSidebar() {
	const router = useRouter();
	const { status, user, signOut } = useAuth();
	const { data: me, isLoading: meLoading } = useMe();

	const name = me?.name ?? user?.displayName ?? 'Account';
	const email = me?.email ?? user?.email ?? '';
	const picture = me?.picture ?? user?.photoURL;
	const initial = (name || email || '?').charAt(0).toUpperCase();

	async function handleSignOut() {
		try {
			router.replace('/sign-in');
			await signOut();
			clearAuthSessionCookie();
			toast.success('Signed out');
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Could not sign out'
			);
		}
	}

	return (
		<Sidebar
			className={cn(
				'*:data-[slot=sidebar-inner]:border-r *:data-[slot=sidebar-inner]:border-sidebar-border',
				'*:data-[slot=sidebar-inner]:bg-sidebar'
			)}
			collapsible="icon"
			variant="sidebar"
			aria-label="Primary"
		>
			<SidebarHeader className="gap-0 border-b border-white/10 p-0">
				<Link
					href="/dashboard"
					aria-label="GeoPulse workspace"
					className={cn(
						'group/brand flex h-[3.75rem] w-full items-center gap-2.5 px-3',
						'transition-[background-color] duration-150 ease-out',
						'hover:bg-white/5',
						'focus-visible:bg-white/5 focus-visible:outline-none',
						'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25'
					)}
				>
					<span
						className={cn(
							'relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px]',
							'bg-sidebar-active shadow-[0_1px_0_rgb(255_255_255/0.12)]',
							'transition-[transform,box-shadow] duration-150 ease-out',
							'group-hover/brand:scale-[1.03] group-hover/brand:shadow-[0_4px_12px_rgb(0_0_0/0.25)]',
							'group-active/brand:scale-[0.98]'
						)}
					>
						<GeoPulseIcon tone="inverse" className="size-9" />
					</span>

					<div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
						<p className="truncate font-heading text-[15px] font-bold tracking-tight text-white">
							GeoPulse
						</p>
						<p className="truncate text-[10px] font-semibold tracking-[0.12em] text-[#d9bdde]/70 uppercase">
							Workspace
						</p>
					</div>

					<ChevronDownIcon
						aria-hidden
						className={cn(
							'size-4 shrink-0 text-white/45',
							'transition-[color,transform] duration-150 ease-out',
							'group-hover/brand:text-white group-hover/brand:translate-y-px',
							'group-data-[collapsible=icon]:hidden'
						)}
					/>
				</Link>
			</SidebarHeader>

			<SidebarContent className="gap-2 py-3">
				{navGroups.map((group) => (
					<NavGroup key={group.label ?? 'nav'} {...group} />
				))}
			</SidebarContent>

			<SidebarFooter className="gap-2 border-t border-sidebar-border p-2">
				{status === 'loading' ? (
					<div className="flex h-12 items-center gap-2 rounded-[12px] bg-sidebar-accent px-2">
						<Spinner className="size-4 text-sidebar-foreground" />
						<span className="text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
							Loading…
						</span>
					</div>
				) : null}

				{status === 'authed' ? (
					<div className="space-y-1.5">
						<div
							className={cn(
								'flex items-center gap-2.5 rounded-[12px] border border-sidebar-border bg-sidebar-accent px-2.5 py-2',
								'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0'
							)}
						>
							<Avatar className="size-8 shrink-0">
								{picture ? <AvatarImage alt={name} src={picture} /> : null}
								<AvatarFallback className="bg-sidebar-active text-xs font-semibold text-sidebar-active-foreground">
									{meLoading ? <Spinner className="size-3" /> : initial}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
								<p className="truncate text-sm font-semibold text-sidebar-foreground">
									{name}
								</p>
								{email ? (
									<p className="truncate text-[11px] text-sidebar-foreground/60">
										{email}
									</p>
								) : null}
							</div>
						</div>

						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									tooltip="Sign out"
									onClick={() => {
										void handleSignOut();
									}}
									className={cn(
										'h-9 rounded-[12px] text-sidebar-foreground/70',
										'transition-[background-color,color,transform] duration-150 ease-out',
										'hover:bg-destructive/10 hover:text-destructive',
										'hover:[&_svg]:text-white',
										'active:scale-[0.98]'
									)}
								>
									<LogOutIcon />
									<span>Sign out</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</div>
				) : null}

				<SidebarSeparator className="mx-0 bg-sidebar-border group-data-[collapsible=icon]:hidden" />
				<p className="px-2 pb-1 text-[10px] text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
					© {new Date().getFullYear()} GeoPulse
				</p>
			</SidebarFooter>
		</Sidebar>
	);
}
