'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { SidebarNavGroup } from '@/components/app-shared';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

function isNavItemActive(pathname: string, path: string) {
	if (path === '/') {
		return pathname === '/';
	}
	if (path === '/dashboard') {
		return pathname === '/dashboard';
	}
	return pathname === path || pathname.startsWith(`${path}/`);
}

export function NavGroup({ label, items }: SidebarNavGroup) {
	const pathname = usePathname();

	return (
		<SidebarGroup className="px-2 py-1">
			{label ? (
				<SidebarGroupLabel className="px-2.5 font-heading text-[10px] font-semibold tracking-[0.14em] text-sidebar-foreground/50 uppercase">
					{label}
				</SidebarGroupLabel>
			) : null}
			<SidebarMenu className="gap-1">
				{items.map((item) => {
					const isActive = isNavItemActive(pathname, item.path);

					return (
						<SidebarMenuItem key={item.path}>
							<SidebarMenuButton
								isActive={isActive}
								tooltip={item.title}
								render={<Link href={item.path} />}
								className={cn(
									'h-9 rounded-[12px] px-2.5 font-medium text-sidebar-foreground/80',
									'transition-[background-color,color,transform] duration-150 ease-out',
									'hover:bg-sidebar-accent hover:text-sidebar-foreground',
									'hover:[&_svg]:text-white',
									'active:scale-[0.98]',
									/* Active: cream swatch on aubergine sidebar */
									'data-active:bg-sidebar-active data-active:font-semibold',
									'data-active:text-sidebar-active-foreground',
									'data-active:[&_svg]:text-sidebar-active-foreground',
									'data-active:hover:bg-sidebar-active data-active:hover:text-sidebar-active-foreground',
									'data-active:hover:[&_svg]:text-sidebar-active-foreground'
								)}
							>
								{item.icon}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
