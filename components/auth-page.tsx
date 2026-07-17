'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
	AtSignIcon,
	GlobeIcon,
	LockIcon,
	RadioIcon,
	UserIcon,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { queryKeys } from '@/hooks/query-keys';
import { getMe } from '@/lib/api/endpoints';
import { LANDING_IMAGES } from '@/lib/landing-assets';
import { cn } from '@/lib/utils';
import { safeAuthNextPath } from '@/lib/auth-session-cookie';
import { GeoPulseLogo } from '@/components/brand/geopulse-logo';
import { GoogleIcon } from '@/components/icons/google-icon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthMode = 'sign-in' | 'sign-up';

const copy: Record<
	AuthMode,
	{
		title: string;
		description: string;
		submitLabel: string;
		alternatePrompt: string;
		alternateHref: string;
		alternateLabel: string;
	}
> = {
	'sign-in': {
		title: 'Welcome back',
		description:
			'Sign in to track coins, sync your watchlist, and keep prices in your currency.',
		submitLabel: 'Sign in',
		alternatePrompt: "Don't have an account?",
		alternateHref: '/sign-up',
		alternateLabel: 'Create one',
	},
	'sign-up': {
		title: 'Create your account',
		description:
			'Start free. Save a watchlist and pick up your personalized dashboard anywhere.',
		submitLabel: 'Create account',
		alternatePrompt: 'Already have an account?',
		alternateHref: '/sign-in',
		alternateLabel: 'Sign in',
	},
};

function authErrorMessage(error: unknown): string {
	if (error && typeof error === 'object' && 'code' in error) {
		const code = String((error as { code?: string }).code);
		switch (code) {
			case 'auth/invalid-credential':
			case 'auth/wrong-password':
			case 'auth/user-not-found':
				return 'Invalid email or password.';
			case 'auth/email-already-in-use':
				return 'An account with this email already exists.';
			case 'auth/weak-password':
				return 'Password must be at least 6 characters.';
			case 'auth/invalid-email':
				return 'Enter a valid email address.';
			case 'auth/popup-closed-by-user':
				return 'Sign-in was cancelled.';
			case 'auth/too-many-requests':
				return 'Too many attempts. Try again later.';
			case 'auth/configuration-not-found':
			case 'auth/invalid-api-key':
				return 'Firebase is not configured. Check NEXT_PUBLIC_FIREBASE_* in .env.';
			default:
				break;
		}
	}
	if (error instanceof Error && error.message) return error.message;
	return 'Something went wrong. Please try again.';
}

function AuthPreviewPanel() {
	return (
		<div className="relative hidden h-full min-h-[100dvh] overflow-hidden bg-[color:var(--ink)] lg:flex lg:flex-col">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgb(255_255_255/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:40px_40px]"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(74_21_75/0.35),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgb(0_122_90/0.25),transparent_50%)]"
			/>

			<div className="relative z-10 flex flex-1 flex-col items-center justify-between p-10 text-center xl:p-12">
				<Link
					href="/"
					aria-label="GeoPulse home"
					className="w-fit"
				>
					<GeoPulseLogo className="[&_span]:text-white!" />
				</Link>

				<div className="mx-auto w-full max-w-lg space-y-8">
					<div className="space-y-3">
						<p className="text-caption-md font-semibold tracking-[0.14em] text-white/55 uppercase">
							Crypto intelligence, tailored to you
						</p>
						<h2 className="font-heading text-3xl font-bold tracking-tight text-balance text-white xl:text-4xl">
							Markets that know{' '}
							<span className="text-primary">where you are.</span>
						</h2>
						<p className="mx-auto max-w-md text-body-sm text-white/70">
							Live prices in your currency, trending coins, regional news, and a
							private watchlist — personalized from your IP the moment you
							arrive.
						</p>
					</div>

					<div className="relative overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm text-left">
						<div className="relative aspect-[16/11] w-full">
							<Image
								src={LANDING_IMAGES.network}
								alt="GeoPulse network personalization visualization"
								fill
								priority
								className="object-cover object-center"
								sizes="(min-width: 1024px) 40vw, 100vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)]/80 via-transparent to-transparent" />
						</div>

						<div className="absolute right-4 bottom-4 left-4 grid gap-2 sm:grid-cols-2">
							<div className="rounded-[12px] border border-white/10 bg-[color:var(--ink)]/75 p-3 backdrop-blur-md">
								<div className="mb-2 flex items-center gap-2 text-caption-sm text-white/60">
									<GlobeIcon className="size-3.5 text-primary" />
									Visitor intel
								</div>
								<p className="text-sm font-semibold text-white">Lagos · NGN</p>
								<p className="mt-0.5 font-mono text-[10px] text-white/55">
									residential · 94%
								</p>
							</div>
							<div className="rounded-[12px] border border-white/10 bg-[color:var(--ink)]/75 p-3 backdrop-blur-md">
								<div className="mb-2 flex items-center gap-2 text-caption-sm text-white/60">
									<RadioIcon className="size-3.5 text-primary" />
									API health
								</div>
								<p className="text-sm font-semibold text-white">Providers live</p>
								<p className="mt-0.5 font-mono text-[10px] text-white/55">
									socket · geo.resolved
								</p>
							</div>
						</div>
					</div>
				</div>

				<p className="text-caption-sm text-white/45">
					IP-personalized · Live prices · Sign in to save a watchlist
				</p>
			</div>
		</div>
	);
}

type AuthPageProps = {
	mode: AuthMode;
};

/**
 * ShiftSync-inspired split auth layout for GeoPulse.
 * Firebase client auth → backend GET /api/me upserts the user profile.
 */
export function AuthPage({ mode }: AuthPageProps) {
	const content = copy[mode];
	const router = useRouter();
	const searchParams = useSearchParams();
	const nextPath = safeAuthNextPath(searchParams.get('next'));
	const queryClient = useQueryClient();
	const {
		status,
		signInWithGoogle,
		signInWithEmail,
		signUpWithEmail,
	} = useAuth();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [persist, setPersist] = useState(true);
	const [pending, setPending] = useState(false);

	useEffect(() => {
		if (status === 'authed') {
			router.replace(nextPath);
		}
	}, [status, router, nextPath]);

	async function syncBackendProfile() {
		try {
			await getMe();
			await queryClient.invalidateQueries({ queryKey: queryKeys.me });
		} catch {
			// Auth succeeded; backend upsert is best-effort (fail-open on API).
		}
	}

	async function finishAuth(successMessage: string) {
		await syncBackendProfile();
		toast.success(successMessage);
		router.replace(nextPath);
	}

	async function handleGoogle() {
		setPending(true);
		try {
			await signInWithGoogle({ persist });
			await finishAuth('Signed in');
		} catch (error) {
			toast.error(authErrorMessage(error));
		} finally {
			setPending(false);
		}
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setPending(true);
		try {
			if (mode === 'sign-up') {
				await signUpWithEmail(email, password, {
					displayName: name,
					persist: true,
				});
				await finishAuth('Account created');
			} else {
				await signInWithEmail(email, password, { persist });
				await finishAuth('Signed in');
			}
		} catch (error) {
			toast.error(authErrorMessage(error));
		} finally {
			setPending(false);
		}
	}

	return (
		<div className="grid min-h-[100dvh] bg-background lg:grid-cols-2">
			<AuthPreviewPanel />

			<div className="relative flex min-h-[100dvh] flex-col justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 opacity-[0.35] lg:hidden [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:40px_40px] dark:[background-image:linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)]"
				/>

				<div className="relative mx-auto w-full max-w-md space-y-8">
					<div className="space-y-6">
						<Link href="/" aria-label="GeoPulse home" className="inline-flex lg:hidden">
							<GeoPulseLogo />
						</Link>
						<div className="space-y-2">
							<h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
								{content.title}
							</h1>
							<p className="text-body-sm text-muted-foreground text-pretty">
								{content.description}
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<Button
							type="button"
							variant="outline"
							disabled={pending}
							onClick={() => {
								void handleGoogle();
							}}
							className={cn(
								'h-11 w-full rounded-md border-hairline bg-surface-card font-semibold shadow-none',
								'hover:bg-surface-card hover:text-foreground dark:hover:bg-surface-card',
								'active:scale-[0.99]'
							)}
						>
							<GoogleIcon data-icon="inline-start" />
							Continue with Google
						</Button>

						<div className="relative py-1 text-center text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
							<span className="relative z-10 bg-background px-3">
								or continue with email
							</span>
							<span
								aria-hidden
								className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border"
							/>
						</div>

						<form className="space-y-3.5" onSubmit={handleSubmit}>
							{mode === 'sign-up' ? (
								<div className="space-y-1.5">
									<Label htmlFor="auth-name">Full name</Label>
									<div className="relative">
										<UserIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
										<Input
											id="auth-name"
											name="name"
											autoComplete="name"
											required
											value={name}
											onChange={(e) => setName(e.target.value)}
											disabled={pending}
											placeholder="Ada Lovelace"
											className="h-11 rounded-md pl-10"
										/>
									</div>
								</div>
							) : null}

							<div className="space-y-1.5">
								<Label htmlFor="auth-email">
									{mode === 'sign-in' ? 'Work email' : 'Email'}
								</Label>
								<div className="relative">
									<AtSignIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="auth-email"
										name="email"
										type="email"
										autoComplete="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={pending}
										placeholder="you@example.com"
										className="h-11 rounded-md pl-10"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="auth-password">Password</Label>
								<div className="relative">
									<LockIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="auth-password"
										name="password"
										type="password"
										autoComplete={
											mode === 'sign-in' ? 'current-password' : 'new-password'
										}
										required
										minLength={6}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										disabled={pending}
										placeholder="Enter your password"
										className="h-11 rounded-md pl-10"
									/>
								</div>
							</div>

							{mode === 'sign-in' ? (
								<div className="flex items-start gap-3 rounded-md border border-hairline bg-surface-card/80 px-3 py-3 dark:bg-muted/30">
									<Checkbox
										id="keep-signed-in"
										checked={persist}
										onCheckedChange={(checked) =>
											setPersist(checked === true)
										}
										disabled={pending}
										className="mt-0.5"
									/>
									<div className="min-w-0 space-y-0.5">
										<Label
											htmlFor="keep-signed-in"
											className="cursor-pointer text-sm font-semibold"
										>
											Keep me signed in
										</Label>
										<p className="text-caption-sm text-muted-foreground">
											Extends how long your session stays active on this device.
										</p>
									</div>
								</div>
							) : null}

							<Button
								type="submit"
								disabled={pending}
								className="h-11 w-full rounded-md font-bold text-white hover:bg-(--brand)/90 active:scale-[0.98]"
							>
								{pending ? 'Please wait…' : content.submitLabel}
							</Button>
						</form>
					</div>

					<p className="text-center text-sm text-muted-foreground">
						{content.alternatePrompt}{' '}
						<Link
							href={content.alternateHref}
							className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
						>
							{content.alternateLabel}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
