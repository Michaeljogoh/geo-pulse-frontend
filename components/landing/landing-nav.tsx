"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { GeoPulseLogo } from "@/components/brand/geopulse-logo";
import { Button } from "@/components/ui/button";
import { easeDrawer } from "@/lib/motion";

const navLinks = [
	{ href: "#features", label: "Features" },
	{ href: "#product", label: "Product" },
	{ href: "#how-it-works", label: "How it works" },
	{ href: "#why", label: "Why GeoPulse" },
];

function useIsClient() {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false
	);
}

export function LandingNav() {
	const [open, setOpen] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useIsClient();
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	return (
		<header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
			<div
				className="landing-shell pointer-events-auto mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-border/80 bg-background/85 px-3 pl-4 shadow-[0_8px_32px_rgb(0_0_0/0.06)] backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-500 dark:shadow-[0_8px_32px_rgb(0_0_0/0.35)] md:h-16 md:px-4 md:pl-5"
			>
				<Link href="/" aria-label="GeoPulse home" className="shrink-0">
					<GeoPulseLogo />
				</Link>

				<nav
					className="hidden items-center gap-1 md:flex"
					aria-label="Primary"
				>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="rounded-full px-3.5 py-2 text-sm font-semibold text-black transition-colors hover:bg-muted hover:text-black dark:text-white dark:hover:text-white"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="hidden items-center gap-2 md:flex">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="rounded-full"
						onClick={toggleTheme}
						aria-label="Toggle theme"
					>
						{mounted && resolvedTheme === "dark" ? (
							<SunIcon className="size-4" />
						) : (
							<MoonIcon className="size-4" />
						)}
					</Button>
					<Button render={<Link href="/sign-in" />} nativeButton={false} variant="ghost" className="rounded-full px-4 text-black dark:text-white">
						Sign in
					</Button>
					<Button
						render={<Link href="/dashboard" />}
						nativeButton={false}
						className="h-10 rounded-[var(--radius-md)] px-4 text-button-md text-white active:scale-[0.98]"
					>
						Try free
					</Button>
				</div>

				<div className="flex items-center gap-1 md:hidden">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="rounded-full"
						onClick={toggleTheme}
						aria-label="Toggle theme"
					>
						{mounted && resolvedTheme === "dark" ? (
							<SunIcon className="size-4" />
						) : (
							<MoonIcon className="size-4" />
						)}
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="rounded-full"
						onClick={() => setOpen((value) => !value)}
						aria-expanded={open}
						aria-label={open ? "Close menu" : "Open menu"}
					>
						<motion.span
							className="relative block size-4"
							animate={open ? "open" : "closed"}
						>
							<motion.span
								className="absolute left-0 top-[3px] block h-0.5 w-4 rounded-full bg-current"
								variants={{
									closed: { rotate: 0, y: 0 },
									open: { rotate: 45, y: 5 },
								}}
								transition={{ duration: 0.25, ease: easeDrawer }}
							/>
							<motion.span
								className="absolute left-0 top-[7px] block h-0.5 w-4 rounded-full bg-current"
								variants={{
									closed: { opacity: 1 },
									open: { opacity: 0 },
								}}
								transition={{ duration: 0.2 }}
							/>
							<motion.span
								className="absolute left-0 top-[11px] block h-0.5 w-4 rounded-full bg-current"
								variants={{
									closed: { rotate: 0, y: 0 },
									open: { rotate: -45, y: -5 },
								}}
								transition={{ duration: 0.25, ease: easeDrawer }}
							/>
						</motion.span>
					</Button>
				</div>
			</div>

			<AnimatePresence>
				{open ? (
					<motion.div
						className="pointer-events-auto fixed inset-0 z-40 bg-background/90 backdrop-blur-2xl md:hidden"
						initial={prefersReducedMotion ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
					>
						<nav
							className="flex min-h-[100dvh] flex-col justify-center gap-2 px-8"
							aria-label="Mobile"
						>
							{navLinks.map((link, index) => (
								<motion.div
									key={link.href}
									initial={
										prefersReducedMotion
											? false
											: { opacity: 0, y: 20 }
									}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 12 }}
									transition={{
										delay: prefersReducedMotion ? 0 : index * 0.06,
										duration: 0.35,
										ease: easeDrawer,
									}}
								>
									<Link
										href={link.href}
										onClick={() => setOpen(false)}
										className="block py-3 font-heading text-xl font-semibold tracking-tight text-black dark:text-white"
									>
										{link.label}
									</Link>
								</motion.div>
							))}
							<motion.div
								className="mt-8 flex flex-col gap-3"
								initial={
									prefersReducedMotion ? false : { opacity: 0, y: 20 }
								}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.35 }}
							>
								<Button
									render={<Link href="/sign-in" onClick={() => setOpen(false)} />}
									nativeButton={false}
									variant="secondary"
									className="h-11 rounded-[var(--radius-md)] bg-ink text-white hover:bg-ink/90"
								>
									Sign in
								</Button>
								<Button
									render={<Link href="/dashboard" onClick={() => setOpen(false)} />}
									nativeButton={false}
									className="h-11 rounded-[var(--radius-md)] text-white"
								>
									Try GeoPulse free
								</Button>
							</motion.div>
						</nav>
					</motion.div>
				) : null}
			</AnimatePresence>
		</header>
	);
}
