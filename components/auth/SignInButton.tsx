'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function authErrorMessage(error: unknown): string {
	if (error && typeof error === 'object' && 'code' in error) {
		const code = String((error as { code?: string }).code);
		switch (code) {
			case 'auth/invalid-credential':
			case 'auth/wrong-password':
			case 'auth/user-not-found':
				return 'Invalid email or password.';
			case 'auth/popup-closed-by-user':
				return 'Sign-in was cancelled.';
			case 'auth/too-many-requests':
				return 'Too many attempts. Try again later.';
			default:
				break;
		}
	}
	if (error instanceof Error && error.message) return error.message;
	return 'Sign-in failed. Please try again.';
}

/** Phase 14 — opens dialog for Google + email/password sign-in. */
export function SignInButton({
	label = 'Sign in',
	className,
}: {
	label?: string;
	className?: string;
}) {
	const { signInWithGoogle, signInWithEmail } = useAuth();
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [pending, setPending] = useState(false);

	async function handleGoogle() {
		setPending(true);
		try {
			await signInWithGoogle();
			toast.success('Signed in');
			setOpen(false);
		} catch (error) {
			toast.error(authErrorMessage(error));
		} finally {
			setPending(false);
		}
	}

	async function handleEmail(event: FormEvent) {
		event.preventDefault();
		setPending(true);
		try {
			await signInWithEmail(email, password);
			toast.success('Signed in');
			setOpen(false);
			setPassword('');
		} catch (error) {
			toast.error(authErrorMessage(error));
		} finally {
			setPending(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button type="button" size="sm" variant="outline" className={className} />
				}
			>
				{label}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Sign in to GeoPulse</DialogTitle>
					<DialogDescription>
						Track a watchlist and sync preferences across devices.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Button
						type="button"
						className="w-full"
						disabled={pending}
						onClick={() => {
							void handleGoogle();
						}}
					>
						Continue with Google
					</Button>

					<div className="relative py-1 text-center text-[10px] tracking-wide text-muted-foreground uppercase">
						<span className="bg-popover relative z-10 px-2">or email</span>
						<span
							aria-hidden
							className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border"
						/>
					</div>

					<form className="space-y-3" onSubmit={handleEmail}>
						<div className="space-y-1.5">
							<Label htmlFor="auth-email">Email</Label>
							<Input
								id="auth-email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={pending}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="auth-password">Password</Label>
							<Input
								id="auth-password"
								type="password"
								autoComplete="current-password"
								required
								minLength={6}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={pending}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={pending}>
							{pending ? 'Signing in…' : 'Sign in with email'}
						</Button>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
