'use client';

import { toast } from 'sonner';
import { LogOutIcon } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useMe } from '@/hooks/useMe';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';

/** Phase 14 — authed account menu with avatar + sign-out. */
export function UserMenu() {
	const { user, signOut } = useAuth();
	const { data: me, isLoading } = useMe();

	const name = me?.name ?? user?.displayName ?? 'Account';
	const email = me?.email ?? user?.email ?? '';
	const picture = me?.picture ?? user?.photoURL;
	const initial = (name || email || '?').charAt(0).toUpperCase();

	async function handleSignOut() {
		try {
			await signOut();
			toast.success('Signed out');
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Could not sign out'
			);
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={`${name} account menu`}
				render={
					<button
						type="button"
						className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					/>
				}
			>
				<Avatar className="size-8">
					{picture ? <AvatarImage alt={name} src={picture} /> : null}
					<AvatarFallback>
						{isLoading ? <Spinner className="size-3" /> : initial}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<div className="flex items-center gap-3 px-2 py-1.5">
					<Avatar className="size-10">
						{picture ? <AvatarImage alt="" src={picture} /> : null}
						<AvatarFallback>{initial}</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<p className="truncate text-sm font-medium text-foreground">
							{name}
						</p>
						{email ? (
							<p className="truncate text-muted-foreground text-xs">{email}</p>
						) : null}
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					className="cursor-pointer"
					onClick={() => {
						void handleSignOut();
					}}
				>
					<LogOutIcon />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
