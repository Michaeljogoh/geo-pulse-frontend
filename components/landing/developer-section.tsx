"use client";

import Link from "next/link";
import {
	ArrowUpRightIcon,
	BellRingIcon,
	ShieldCheckIcon,
	SparklesIcon,
} from "lucide-react";
import { MotionSection, Stagger, StaggerItem } from "@/components/landing/motion-section";
import { Button } from "@/components/ui/button";

const bullets = [
	{
		icon: SparklesIcon,
		title: "Personalized in seconds",
		description:
			"Land on GeoPulse and your currency, timezone, and local market context are already set. No forms. No setup wizard.",
	},
	{
		icon: ShieldCheckIcon,
		title: "Honest when data is incomplete",
		description:
			"We show unknown when a field is missing instead of guessing. You always know what is live, cached, or delayed.",
	},
	{
		icon: BellRingIcon,
		title: "Built for real decisions",
		description:
			"Track coins on a personal watchlist, follow movers, and skim regional news without leaving one screen.",
	},
];

export function DeveloperSection() {
	return (
		<MotionSection
			id="why"
			className="landing-section border-y border-border/80 bg-card/40"
		>
			<div className="landing-shell">
				<div className="grid gap-10 lg:grid-cols-2 lg:items-center">
					<div>
						<p className="landing-pill mb-4 border border-border bg-background text-muted-foreground">
							Why GeoPulse
						</p>
						<h2 className="text-display-lg text-balance">
							Made for people who trade with context, not noise.
						</h2>
						<p className="mt-4 max-w-xl text-body-md text-[color:var(--body)] dark:text-muted-foreground">
							Most crypto apps show the same global feed to everyone. GeoPulse
							starts with you: where you are, what currency you use, and which
							stories matter in your region.
						</p>

						<Stagger className="mt-8 grid gap-4">
							{bullets.map((item) => (
								<StaggerItem key={item.title}>
									<div className="flex gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary">
											<item.icon className="size-4" strokeWidth={1.75} />
										</div>
										<div>
											<h3 className="text-heading-md">{item.title}</h3>
											<p className="mt-1 text-body-sm text-muted-foreground">
												{item.description}
											</p>
										</div>
									</div>
								</StaggerItem>
							))}
						</Stagger>
					</div>

					<div className="landing-bezel-outer bg-[color-mix(in_srgb,var(--brand)_10%,white)] dark:bg-[color-mix(in_srgb,var(--brand)_18%,#33332e)] ring-primary/20">
						<div className="flex h-full flex-col justify-between rounded-[calc(var(--radius-lg)-6px)] p-6 md:p-8">
							<div>
								<p className="text-caption-md font-semibold uppercase tracking-[0.16em] text-muted-foreground">
									What you get today
								</p>
								<ul className="mt-5 space-y-4">
									{[
										"Live market prices in your local currency",
										"Visitor and network context on first load",
										"Trending coins, gainers, and losers",
										"Regional crypto news in one feed",
										"A private watchlist when you sign in",
									].map((line) => (
										<li
											key={line}
											className="flex items-start gap-3 text-body-md"
										>
											<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
											{line}
										</li>
									))}
								</ul>
							</div>
							<div className="mt-8 flex flex-col gap-3 sm:flex-row">
								<Button
									render={<Link href="/dashboard" />}
									nativeButton={false}
									className="h-11 rounded-full px-5 text-button-md text-white"
								>
									Start exploring
									<ArrowUpRightIcon className="size-4 text-white" data-icon="inline-end" />
								</Button>
								<Button
									render={<Link href="/sign-up" />}
									nativeButton={false}
									variant="secondary"
									className="h-11 rounded-full bg-ink px-5 text-button-md text-white hover:bg-ink/90"
								>
									Create free account
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MotionSection>
	);
}
