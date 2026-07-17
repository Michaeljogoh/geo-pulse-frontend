'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOutIcon } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useMe } from '@/hooks/useMe';
import { clearAuthSessionCookie } from '@/lib/auth-session-cookie';
import { cn } from '@/lib/utils';
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

/** Authed account menu — Slack-style identity block + quiet sign-out. */
export function UserMenu() {
	const router = useRouter();
	const { user, signOut } = useAuth();
	const { data: me, isLoading } = useMe();

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
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={`${name} account menu`}
				render={
					<button
						type="button"
						className={cn(
							'rounded-full outline-none',
							'ring-offset-canvas transition-[box-shadow,transform] duration-150 ease-out',
							'hover:ring-2 hover:ring-primary/20',
							'focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2',
							'active:scale-[0.97]',
							'dark:ring-offset-background'
						)}
					/>
				}
			>
				<Avatar className="size-8 after:border-primary/20">
					{picture ? <AvatarImage alt={name} src={picture} /> : null}
					<AvatarFallback className="bg-primary font-semibold text-primary-foreground">
						{isLoading ? (
							<Spinner className="size-3 text-primary-foreground" />
						) : (
							initial
						)}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				sideOffset={8}
				className={cn(
					'w-64 rounded-[12px] border border-hairline bg-canvas p-1.5',
					'shadow-[0_12px_32px_rgb(74_21_75/0.12)]',
					'dark:border-border dark:bg-popover dark:shadow-[0_12px_32px_rgb(0_0_0/0.35)]'
				)}
			>
				<div className="flex items-center gap-3 rounded-[10px] bg-secondary/80 px-2.5 py-2.5 dark:bg-muted/50">
					<Avatar className="size-10 after:border-primary/15">
						{picture ? <AvatarImage alt="" src={picture} /> : null}
						<AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
							{initial}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<p className="text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">
							Signed in
						</p>
						<p className="mt-0.5 truncate text-sm font-semibold text-foreground">
							{name}
						</p>
						{email ? (
							<p className="truncate text-[11px] text-mute">{email}</p>
						) : null}
					</div>
				</div>
				<DropdownMenuSeparator className="my-1.5 bg-hairline dark:bg-border" />
				<DropdownMenuItem
					variant="destructive"
					className={cn(
						'cursor-pointer rounded-[10px] px-2.5 py-2.5',
						'text-loss focus:bg-loss-bg focus:text-loss',
						'dark:focus:bg-loss/15'
					)}
					onClick={() => {
						void handleSignOut();
					}}
				>
					<LogOutIcon className="size-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
