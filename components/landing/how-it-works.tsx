"use client";

import { MotionSection, Stagger, StaggerItem } from "@/components/landing/motion-section";

const steps = [
	{
		step: "01",
		title: "Open GeoPulse",
		description:
			"Visit the dashboard from any device. We recognize your location automatically so everything feels local from the first second.",
		tone: "bg-[color-mix(in_srgb,var(--brand)_10%,white)] dark:bg-[color-mix(in_srgb,var(--brand)_18%,#33332e)] ring-primary/20",
	},
	{
		step: "02",
		title: "Get your personal market view",
		description:
			"Prices appear in your currency. News leans toward your region. Network details help you understand the quality of your connection.",
		tone: "bg-[color:var(--surface-card)] dark:bg-card ring-border/80",
	},
	{
		step: "03",
		title: "Act with confidence",
		description:
			"Follow movers, skim headlines, and save coins to your watchlist when you are ready. One place for the full picture.",
		tone: "bg-surface-dark text-white ring-white/10 [&_h3]:text-white",
	},
];

export function HowItWorks() {
	return (
		<MotionSection
			id="how-it-works"
			className="landing-section border-y border-border/80 bg-card/40"
		>
			<div className="landing-shell">
				<div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
					<div className="max-w-lg">
						<p className="landing-pill mb-4 border border-border bg-background text-muted-foreground">
							How it works
						</p>
						<h2 className="text-display-lg text-balance">
							From first visit to a dashboard that feels yours.
						</h2>
						<p className="mt-4 text-body-md text-[color:var(--body)] dark:text-muted-foreground">
							Other apps ask you to configure everything. GeoPulse figures out
							your context, then shows the markets that matter to you.
						</p>
					</div>

					<Stagger className="grid gap-4">
						{steps.map((item) => (
							<StaggerItem key={item.step}>
								<div
									className={`rounded-[var(--radius-lg)] p-1.5 ring-1 ${item.tone}`}
								>
									<div className="grid gap-4 rounded-[calc(var(--radius-lg)-6px)] p-6 md:grid-cols-[auto_1fr] md:items-start md:gap-6">
										<span className="font-mono text-heading-xl text-primary">
											{item.step}
										</span>
										<div>
											<h3 className="text-heading-lg">{item.title}</h3>
											<p
												className={
													item.step === "03"
														? "mt-2 text-body-sm text-white/70"
														: "mt-2 text-body-sm text-[color:var(--body)] dark:text-muted-foreground"
												}
											>
												{item.description}
											</p>
										</div>
									</div>
								</div>
							</StaggerItem>
						))}
					</Stagger>
				</div>

				<div className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-dark p-6 text-white md:p-8">
					<p className="text-caption-md font-semibold uppercase tracking-[0.16em] text-white/60">
						In one visit you unlock
					</p>
					<div className="mt-5 grid gap-4 sm:grid-cols-3">
						{[
							{ label: "Your location context", value: "City, currency, network" },
							{ label: "Live market board", value: "Prices that match your region" },
							{ label: "Local crypto news", value: "Stories relevant to you" },
						].map((item) => (
							<div key={item.label}>
								<p className="text-heading-md text-white">{item.label}</p>
								<p className="mt-1 text-body-sm text-white/65">{item.value}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</MotionSection>
	);
}
