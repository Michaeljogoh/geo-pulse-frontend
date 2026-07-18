"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowUpRightIcon,
	GlobeIcon,
	RadioIcon,
	ShieldCheckIcon,
	TrendingUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoinLogo, ProviderLogo } from "@/components/landing/asset-logos";
import {
	MARKET_PREVIEW,
	PROVIDER_ASSETS,
	TRENDING_PREVIEW,
} from "@/lib/landing-assets";
import { cn } from "@/lib/utils";

function PreviewCard({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<div className={cn("landing-bezel-outer", className)}>
			<div className="landing-bezel-inner p-4 md:p-5">{children}</div>
		</div>
	);
}

/** Static marketing preview — no live geo, no IP/ISP/ASN. */
function VisitorIntelPreview() {
	return (
		<>
			<div className="mb-4 flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<GlobeIcon className="size-4 text-primary" />
					<span className="text-caption-md font-semibold uppercase tracking-[0.14em] text-muted-foreground">
						Visitor Intel
					</span>
				</div>
				<span className="font-mono text-caption-sm text-muted-foreground">
					preview
				</span>
			</div>
			<div className="space-y-3">
				<div>
					<p className="text-heading-lg font-semibold">Lagos, Nigeria</p>
					<p className="text-body-sm text-muted-foreground">
						Africa/Lagos · NGN
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<span className="rounded-full bg-gain-bg px-2.5 py-1 text-caption-sm font-semibold capitalize text-gain dark:text-gain-bg">
						mobile
					</span>
					<span className="rounded-full bg-muted px-2.5 py-1 font-mono text-caption-sm text-muted-foreground">
						confidence 98%
					</span>
				</div>
				{/* Same footprint as the old ISP/ASN block — product context only */}
				<div className="flex min-h-16 flex-col justify-center rounded-[var(--radius-md)] bg-muted/70 p-3 font-mono text-caption-sm text-muted-foreground">
					<p>Market · priced in NGN</p>
					<p className="mt-1">News · regional headlines</p>
				</div>
			</div>
		</>
	);
}

export function HeroPreview() {
	const healthProviders = PROVIDER_ASSETS.filter((p) =>
		["coingecko", "ip-api", "cryptocompare", "firestore"].includes(p.id)
	);

	return (
		<div className="relative mx-auto w-full max-w-xl lg:max-w-none">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_30%_20%,rgb(74_21_75/0.12),transparent_55%),radial-gradient(circle_at_80%_0%,rgb(0_122_90/0.12),transparent_45%)]"
			/>

			{/* Floating crypto logos behind the cards */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -left-4 top-8 hidden opacity-90 lg:block"
			>
				<div className="flex -space-x-2">
					{MARKET_PREVIEW.map((coin) => (
						<span
							key={coin.id}
							className="relative size-9 overflow-hidden rounded-full ring-2 ring-background"
						>
							<Image
								src={coin.image}
								alt=""
								width={36}
								height={36}
								className="object-cover"
							/>
						</span>
					))}
				</div>
			</div>

			<div className="relative grid gap-3 md:grid-cols-2 md:gap-4">
				<PreviewCard className="md:col-span-1">
					<VisitorIntelPreview />
				</PreviewCard>

				<PreviewCard className="md:col-span-1">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<TrendingUpIcon className="size-4 text-primary" />
							<span className="text-caption-md font-semibold uppercase tracking-[0.14em] text-muted-foreground">
								Market · NGN
							</span>
						</div>
						<span className="font-mono text-caption-sm text-muted-foreground">
							refresh 60s
						</span>
					</div>
					<div className="space-y-2">
						{MARKET_PREVIEW.map((row) => (
							<div
								key={row.symbol}
								className="flex items-center justify-between rounded-[12px] px-2 py-2 transition-colors hover:bg-muted/60"
							>
								<div className="flex items-center gap-2.5">
									<CoinLogo
										src={row.image}
										alt={`${row.name} logo`}
										size={28}
									/>
									<div>
										<p className="text-body-sm-strong">{row.symbol}</p>
										<p className="text-caption-sm text-muted-foreground">
											{row.name}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="font-mono text-body-sm-strong">{row.price}</p>
									<p
										className={cn(
											"font-mono text-caption-sm",
											row.up ? "text-gain dark:text-gain-bg" : "text-loss"
										)}
									>
										{row.change}
									</p>
								</div>
							</div>
						))}
					</div>
				</PreviewCard>

				<PreviewCard className="md:col-span-2">
					<div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
						<div>
							<div className="mb-3 flex items-center gap-2">
								<RadioIcon className="size-4 text-primary" />
								<span className="text-caption-md font-semibold uppercase tracking-[0.14em] text-muted-foreground">
									Trending
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{TRENDING_PREVIEW.map((coin) => (
									<span
										key={coin.id}
										className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5"
									>
										<CoinLogo
											src={coin.image}
											alt={`${coin.name} logo`}
											size={20}
										/>
										<span className="font-mono text-caption-sm font-semibold">
											{coin.symbol}
										</span>
									</span>
								))}
							</div>
						</div>
						<div>
							<div className="mb-3 flex items-center gap-2">
								<ShieldCheckIcon className="size-4 text-primary" />
								<span className="text-caption-md font-semibold uppercase tracking-[0.14em] text-muted-foreground">
									API Health
								</span>
							</div>
							<div className="grid grid-cols-2 gap-2">
								{healthProviders.map((provider) => (
									<div
										key={provider.id}
										className="flex items-center justify-between gap-2 rounded-[12px] bg-muted/70 px-2.5 py-2"
									>
										<span className="flex min-w-0 items-center gap-2">
											<ProviderLogo
												src={provider.logo}
												alt={`${provider.name} logo`}
												size={22}
											/>
											<span className="truncate text-caption-sm font-medium">
												{provider.name}
											</span>
										</span>
										<span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
											<span className="size-1.5 rounded-full bg-gain" />
											closed
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</PreviewCard>
			</div>
		</div>
	);
}

export function HeroSection() {
	return (
		<section className="relative overflow-hidden pt-28 md:pt-32">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,rgb(246_246_243/0.9),transparent)] dark:bg-[linear-gradient(180deg,rgb(51_51_46/0.55),transparent)]"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] dark:[background-image:linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)]"
			/>

			<div className="landing-shell landing-section relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
				<div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
					<p className="landing-pill mb-5 mx-auto border border-border bg-card text-muted-foreground lg:mx-0">
						Crypto intelligence, tailored to you
					</p>
					<h1 className="text-display-lg md:text-display-xl mx-auto max-w-[14ch] text-balance lg:mx-0">
						Markets that know{" "}
						<span className="text-primary">where you are.</span>
					</h1>
					<p className="mt-5 mx-auto max-w-xl text-pretty text-body-md text-[color:var(--body)] dark:text-muted-foreground lg:mx-0">
						GeoPulse detects your location and currency the moment you arrive,
						then shows live prices, trending coins, and local crypto news in one
						clear dashboard. Start free. No sign-up needed.
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
						<Button
							render={<Link href="/dashboard" />}
							nativeButton={false}
							className="group h-11 rounded-full px-5 text-button-md text-white active:scale-[0.98]"
						>
							Try GeoPulse free
							<span className="ml-2 inline-flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-px">
								<ArrowUpRightIcon className="size-3.5 text-white" />
							</span>
						</Button>
						<Button
							render={<Link href="#product" />}
							nativeButton={false}
							variant="secondary"
							className="h-11 rounded-full bg-ink px-5 text-button-md text-white hover:bg-ink/90"
						>
							See how it works
						</Button>
					</div>
					<p className="mt-5 text-caption-sm text-muted-foreground">
						Free to explore · Instant personalization · Sign in to save a watchlist
					</p>
				</div>

				<HeroPreview />
			</div>
		</section>
	);
}
