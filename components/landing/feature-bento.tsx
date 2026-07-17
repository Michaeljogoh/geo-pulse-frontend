"use client";

import Image from "next/image";
import {
	ActivityIcon,
	Globe2Icon,
	NewspaperIcon,
	ShieldAlertIcon,
	TrendingUpIcon,
	WalletIcon,
	type LucideIcon,
} from "lucide-react";
import { CoinLogo } from "@/components/landing/asset-logos";
import { MotionSection, Stagger, StaggerItem } from "@/components/landing/motion-section";
import { CRYPTO_ASSETS, MARKET_PREVIEW } from "@/lib/landing-assets";
import { cn } from "@/lib/utils";

type CardTone = "ink" | "brand" | "success" | "cream" | "muted" | "canvas";

const toneStyles: Record<
	CardTone,
	{
		outer: string;
		inner: string;
		icon: string;
		title: string;
		body: string;
		chip: string;
		inset: string;
	}
> = {
	/** Hero card: charcoal surface (DESIGN.md surface-dark) */
	ink: {
		outer: "bg-surface-dark ring-white/10",
		inner:
			"bg-surface-dark text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
		icon: "bg-primary text-white",
		title: "text-white",
		body: "text-white/70",
		chip: "border-white/15 bg-white/10 text-white/80",
		inset: "border-white/10 bg-white/5",
	},
	/** Soft brand wash: Pinterest red at low opacity */
	brand: {
		outer: "bg-[color-mix(in_srgb,var(--brand)_12%,white)] dark:bg-[color-mix(in_srgb,var(--brand)_22%,#262622)] ring-[color-mix(in_srgb,var(--brand)_25%,transparent)]",
		inner:
			"bg-[color-mix(in_srgb,var(--brand)_8%,white)] dark:bg-[color-mix(in_srgb,var(--brand)_18%,#33332e)]",
		icon: "bg-primary text-white",
		title: "text-foreground",
		body: "text-[color:var(--body)] dark:text-muted-foreground",
		chip: "border-primary/20 bg-white/70 text-foreground dark:bg-black/20 dark:text-white/85",
		inset: "border-primary/15 bg-white/60 dark:bg-black/20",
	},
	/** Success pale: gain / healthy markets */
	success: {
		outer:
			"bg-[color:var(--gain-bg)] dark:bg-[color-mix(in_srgb,var(--gain)_35%,#262622)] ring-[color-mix(in_srgb,var(--gain)_30%,transparent)]",
		inner:
			"bg-[color-mix(in_srgb,var(--gain-bg)_70%,white)] dark:bg-[color-mix(in_srgb,var(--gain)_28%,#33332e)]",
		icon: "bg-[color:var(--gain)] text-white dark:bg-gain-bg dark:text-gain",
		title: "text-foreground dark:text-white",
		body: "text-[color:var(--body)] dark:text-white/70",
		chip: "border-[color:var(--gain)]/25 bg-white/70 text-[color:var(--gain)] dark:bg-black/25 dark:text-gain-bg",
		inset: "border-[color:var(--gain)]/20 bg-white/50 dark:bg-black/20",
	},
	/** Warm cream card surface */
	cream: {
		outer: "bg-[color:var(--surface-card)] ring-border/80",
		inner: "bg-[color:var(--surface-card)] dark:bg-card",
		icon: "bg-primary/10 text-primary",
		title: "text-foreground",
		body: "text-[color:var(--body)] dark:text-muted-foreground",
		chip: "border-border bg-background text-muted-foreground",
		inset: "border-border bg-background/80",
	},
	/** Soft stone secondary */
	muted: {
		outer:
			"bg-[color:var(--secondary)] dark:bg-muted ring-border/70",
		inner: "bg-[color:var(--secondary)] dark:bg-muted",
		icon: "bg-foreground/10 text-foreground",
		title: "text-foreground",
		body: "text-[color:var(--body)] dark:text-muted-foreground",
		chip: "border-border/80 bg-background/80 text-muted-foreground",
		inset: "border-border/80 bg-background/70",
	},
	/** Default canvas white */
	canvas: {
		outer: "bg-muted/60 ring-border/80",
		inner: "bg-card",
		icon: "bg-primary/10 text-primary",
		title: "text-foreground",
		body: "text-[color:var(--body)] dark:text-muted-foreground",
		chip: "border-border bg-background text-muted-foreground",
		inset: "border-border bg-background/80",
	},
};

const features: {
	title: string;
	description: string;
	icon: LucideIcon;
	className: string;
	tone: CardTone;
	chips: string[];
	showMarketPreview?: boolean;
	showCoins?: boolean;
	showTrending?: boolean;
}[] = [
	{
		title: "Know your network",
		description:
			"See exactly where you are connecting from: country, city, timezone, ISP, and whether you are on home Wi‑Fi, mobile, or a VPN.",
		icon: Globe2Icon,
		className: "md:col-span-2 md:row-span-2",
		tone: "ink",
		chips: ["Home Wi‑Fi", "Mobile", "VPN aware", "Confidence"],
		showMarketPreview: true,
	},
	{
		title: "Prices in your currency",
		description:
			"Open the dashboard and Bitcoin already shows in Naira, Euros, or Dollars based on where you are. Switch currency anytime.",
		icon: WalletIcon,
		className: "md:col-span-1",
		tone: "brand",
		chips: ["Auto currency", "Live prices", "Easy switch"],
		showCoins: true,
	},
	{
		title: "Catch what is moving",
		description:
			"Spot trending coins, top gainers, and losers at a glance so you never miss the next breakout.",
		icon: TrendingUpIcon,
		className: "md:col-span-1",
		tone: "success",
		chips: ["Trending", "Gainers", "Losers"],
		showTrending: true,
	},
	{
		title: "News that matters here",
		description:
			"Crypto headlines filtered to your region, so you get context that actually applies to your market.",
		icon: NewspaperIcon,
		className: "md:col-span-1",
		tone: "cream",
		chips: ["Local news", "Market context"],
	},
	{
		title: "Always stays usable",
		description:
			"If one data source slows down, the rest of your dashboard keeps working. You still get answers when markets move fast.",
		icon: ShieldAlertIcon,
		className: "md:col-span-1",
		tone: "muted",
		chips: ["Reliable", "Fast fallback", "No blank screens"],
	},
	{
		title: "Trust what you see",
		description:
			"Live status for every data feed behind GeoPulse, so you know when numbers are fresh and when something is delayed.",
		icon: ActivityIcon,
		className: "md:col-span-1",
		tone: "canvas",
		chips: ["Fresh data", "Feed status", "Transparent"],
	},
];

function FeatureCard({
	title,
	description,
	icon: Icon,
	className,
	tone,
	chips,
	showMarketPreview,
	showCoins,
	showTrending,
}: (typeof features)[number]) {
	const styles = toneStyles[tone];

	return (
		<article
			className={cn(
				"h-full rounded-[var(--radius-lg)] p-1.5 ring-1 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5",
				styles.outer,
				className
			)}
		>
			<div
				className={cn(
					"flex h-full flex-col rounded-[calc(var(--radius-lg)-6px)] p-6 md:p-8",
					styles.inner
				)}
			>
				<div
					className={cn(
						"mb-5 flex size-11 items-center justify-center rounded-[var(--radius-md)]",
						styles.icon
					)}
				>
					<Icon className="size-5" strokeWidth={1.75} />
				</div>
				<h3 className={cn("text-heading-lg", styles.title)}>{title}</h3>
				<p className={cn("mt-3 max-w-prose text-body-sm", styles.body)}>
					{description}
				</p>

				{showMarketPreview ? (
					<div
						className={cn(
							"mt-6 space-y-2 rounded-[var(--radius-md)] border p-3",
							styles.inset
						)}
					>
						<p
							className={cn(
								"text-[10px] font-semibold uppercase tracking-[0.14em]",
								tone === "ink" ? "text-white/50" : "text-muted-foreground"
							)}
						>
							Live market snapshot
						</p>
						{MARKET_PREVIEW.map((coin) => (
							<div
								key={coin.id}
								className="flex items-center justify-between gap-3 py-1"
							>
								<span className="flex items-center gap-2">
									<CoinLogo src={coin.image} alt={coin.name} size={22} />
									<span
										className={cn(
											"font-mono text-caption-sm font-semibold",
											tone === "ink" ? "text-white" : "text-foreground"
										)}
									>
										{coin.symbol}
									</span>
								</span>
								<span
									className={cn(
										"font-mono text-caption-sm",
										tone === "ink" ? "text-white/90" : "text-foreground"
									)}
								>
									{coin.price}
								</span>
								<span
									className={cn(
										"font-mono text-caption-sm",
										coin.up
											? tone === "ink"
												? "text-[#7ddea8]"
												: "text-gain dark:text-gain-bg"
											: "text-loss"
									)}
								>
									{coin.change}
								</span>
							</div>
						))}
					</div>
				) : null}

				{showCoins ? (
					<div className="mt-5 flex -space-x-2">
						{CRYPTO_ASSETS.slice(0, 5).map((coin) => (
							<span
								key={coin.id}
								className="relative size-9 overflow-hidden rounded-full ring-2 ring-white/80 dark:ring-black/40"
								title={coin.name}
							>
								<Image
									src={coin.image}
									alt={coin.name}
									width={36}
									height={36}
									className="object-cover"
								/>
							</span>
						))}
					</div>
				) : null}

				{showTrending ? (
					<div className="mt-5 flex flex-wrap gap-2">
						{CRYPTO_ASSETS.slice(6, 10).map((coin) => (
							<span
								key={coin.id}
								className={cn(
									"inline-flex items-center gap-1.5 rounded-full border px-2 py-1",
									styles.chip
								)}
							>
								<CoinLogo src={coin.image} alt={coin.name} size={16} />
								<span className="font-mono text-caption-sm">{coin.symbol}</span>
							</span>
						))}
					</div>
				) : null}

				<div className="mt-auto flex flex-wrap gap-2 pt-6">
					{chips.map((chip) => (
						<span
							key={chip}
							className={cn(
								"rounded-full border px-3 py-1 font-mono text-caption-sm",
								styles.chip
							)}
						>
							{chip}
						</span>
					))}
				</div>
			</div>
		</article>
	);
}

export function FeatureBento() {
	return (
		<MotionSection id="features" className="landing-section">
			<div className="landing-shell">
				<div className="mx-auto max-w-2xl text-center">
					<p className="landing-pill mx-auto mb-4 border border-border bg-card text-muted-foreground">
						Why people use GeoPulse
					</p>
					<h2 className="text-display-lg text-balance">
						Everything you need to read crypto from{" "}
						<span className="text-primary">your corner of the world.</span>
					</h2>
					<p className="mt-4 text-body-md text-[color:var(--body)] dark:text-muted-foreground">
						Stop switching between five tabs. GeoPulse brings location context,
						live markets, and regional news together so you can decide faster.
					</p>
				</div>

				<Stagger className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
					{features.map((feature) => (
						<StaggerItem key={feature.title} className={feature.className}>
							<FeatureCard {...feature} />
						</StaggerItem>
					))}
				</Stagger>
			</div>
		</MotionSection>
	);
}
