"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon, PlayIcon } from "lucide-react";
import { CoinLogo } from "@/components/landing/asset-logos";
import { MotionSection, Stagger, StaggerItem } from "@/components/landing/motion-section";
import { Button } from "@/components/ui/button";
import {
	CRYPTO_ASSETS,
	LANDING_IMAGES,
	MARKET_PREVIEW,
} from "@/lib/landing-assets";
import { springSoft } from "@/lib/motion";

const highlights = [
	{
		label: "Know your visitor",
		detail: "Location, ISP, device, and risk at a glance",
		tone: "bg-surface-dark text-white border-transparent [&_p:last-child]:text-white/65",
	},
	{
		label: "Track live markets",
		detail: "Prices and movers in your currency",
		tone: "border-primary/15 bg-[color-mix(in_srgb,var(--brand)_10%,white)] dark:bg-[color-mix(in_srgb,var(--brand)_20%,#33332e)]",
	},
	{
		label: "Follow local news",
		detail: "Headlines filtered to your country",
		tone: "border-[color:var(--gain)]/20 bg-[color:var(--gain-bg)] dark:bg-[color-mix(in_srgb,var(--gain)_30%,#33332e)]",
	},
	{
		label: "Stay confident",
		detail: "See when every feed is healthy",
		tone: "border-border bg-[color:var(--surface-card)] dark:bg-card",
	},
];

export function ProductShowcase() {
	const prefersReducedMotion = useReducedMotion();

	return (
		<MotionSection id="product" className="landing-section relative overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(74_21_75/0.08),transparent_55%)]"
			/>

			<div className="landing-shell relative">
				<div className="mx-auto max-w-2xl text-center">
					<p className="landing-pill mx-auto mb-4 border border-border bg-card text-muted-foreground">
						Inside the product
					</p>
					<h2 className="text-display-lg text-balance">
						Your personal crypto command center,{" "}
						<span className="text-primary">ready on day one.</span>
					</h2>
					<p className="mt-4 text-body-md text-[color:var(--body)] dark:text-muted-foreground">
						Visitor insights, live markets, trending sectors, news, and analytics
						in one place. Built for clarity when every second counts.
					</p>
				</div>

				{/* Floating crypto badges */}
				<div className="relative mt-12">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -left-2 top-8 z-20 hidden md:block lg:-left-6"
					>
						<motion.div
							className="flex flex-col gap-2"
							animate={
								prefersReducedMotion
									? undefined
									: { y: [0, -8, 0] }
							}
							transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
						>
							{MARKET_PREVIEW.map((coin) => (
								<div
									key={coin.id}
									className="flex items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-2 shadow-[0_12px_40px_rgb(0_0_0/0.12)] backdrop-blur-md"
								>
									<CoinLogo src={coin.image} alt={coin.name} size={24} />
									<span className="font-mono text-caption-sm font-semibold">
										{coin.symbol}
									</span>
									<span
										className={
											coin.up
												? "font-mono text-caption-sm text-gain dark:text-gain-bg"
												: "font-mono text-caption-sm text-loss"
										}
									>
										{coin.change}
									</span>
								</div>
							))}
						</motion.div>
					</div>

					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-2 top-16 z-20 hidden md:block lg:-right-4"
					>
						<motion.div
							className="rounded-[var(--radius-md)] border border-border bg-background/95 p-3 shadow-[0_12px_40px_rgb(0_0_0/0.12)] backdrop-blur-md"
							animate={
								prefersReducedMotion
									? undefined
									: { y: [0, 10, 0] }
							}
							transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
						>
							<p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
								Tracked assets
							</p>
							<div className="flex -space-x-2">
								{CRYPTO_ASSETS.slice(0, 6).map((coin) => (
									<span
										key={coin.id}
										className="relative size-8 overflow-hidden rounded-full ring-2 ring-background"
									>
										<Image
											src={coin.image}
											alt={coin.name}
											width={32}
											height={32}
											className="object-cover"
										/>
									</span>
								))}
							</div>
						</motion.div>
					</div>

					{/* Browser frame + dashboard screenshot */}
					<motion.div
						className="landing-bezel-outer mx-auto max-w-5xl"
						initial={prefersReducedMotion ? false : { opacity: 0, y: 36 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={springSoft}
					>
						<div className="landing-bezel-inner overflow-hidden">
							<div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
								<span className="size-2.5 rounded-full bg-[#ff5f57]" />
								<span className="size-2.5 rounded-full bg-[#febc2e]" />
								<span className="size-2.5 rounded-full bg-[#28c840]" />
								<div className="ml-3 flex flex-1 items-center justify-center">
									<span className="rounded-full bg-background px-4 py-1 font-mono text-caption-sm text-muted-foreground">
										app.geopulse.dev/dashboard
									</span>
								</div>
							</div>
							<div className="relative aspect-[16/10] bg-surface-dark">
								<Image
									src={LANDING_IMAGES.dashboard}
									alt="GeoPulse dashboard with visitor intelligence, live crypto markets, trending sectors, news, and analytics"
									fill
									priority
									loading="eager"
									sizes="(max-width: 1024px) 100vw, 1024px"
									className="object-cover object-top"
								/>
								<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-dark/80 to-transparent" />
							</div>
						</div>
					</motion.div>
				</div>

				<Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{highlights.map((item) => (
						<StaggerItem key={item.label}>
							<div
								className={`rounded-[var(--radius-md)] border p-4 ${item.tone}`}
							>
								<p className="text-heading-md">{item.label}</p>
								<p className="mt-1 text-body-sm text-muted-foreground">
									{item.detail}
								</p>
							</div>
						</StaggerItem>
					))}
				</Stagger>

				<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<Button
						render={<Link href="/dashboard" />}
						nativeButton={false}
						className="group h-11 rounded-full px-6 text-button-md text-white active:scale-[0.98]"
					>
						Open my dashboard
						<span className="ml-2 inline-flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-px">
							<ArrowUpRightIcon className="size-3.5 text-white" />
						</span>
					</Button>
					<a
						href="#how-it-works"
						className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-5 text-button-md font-semibold transition-colors hover:bg-muted"
					>
						<PlayIcon className="size-3.5 fill-current" />
						How GeoPulse works
					</a>
				</div>
			</div>
		</MotionSection>
	);
}
