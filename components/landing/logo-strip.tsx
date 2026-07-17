"use client";

import { motion } from "motion/react";
import { CoinLogo, ProviderLogo } from "@/components/landing/asset-logos";
import { Stagger, StaggerItem } from "@/components/landing/motion-section";
import {
	CRYPTO_ASSETS,
	PROVIDER_ASSETS,
} from "@/lib/landing-assets";
import { easeEnter } from "@/lib/motion";

export function LogoStrip() {
	return (
		<section className="border-y border-border/80 bg-card/50 py-10 md:py-12">
			<div className="landing-shell space-y-10">
				{/* Crypto logos */}
				<div>
					<p className="mb-5 text-center text-caption-md font-semibold uppercase tracking-[0.16em] text-muted-foreground">
						Track the assets people care about
					</p>
					<Stagger className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
						{CRYPTO_ASSETS.map((coin) => (
							<StaggerItem key={coin.id}>
								<motion.div
									className="flex items-center gap-2.5 rounded-full border border-border bg-background px-3 py-2 shadow-[0_1px_0_rgb(0_0_0/0.03)]"
									whileHover={{ y: -2 }}
									transition={{ duration: 0.25, ease: easeEnter }}
								>
									<CoinLogo
										src={coin.image}
										alt={`${coin.name} logo`}
										size={28}
									/>
									<span className="pr-1 font-mono text-caption-sm font-semibold">
										{coin.symbol}
									</span>
								</motion.div>
							</StaggerItem>
						))}
					</Stagger>
				</div>

				{/* Third-party APIs */}
				<div>
					<p className="mb-5 text-center text-caption-md font-semibold uppercase tracking-[0.16em] text-muted-foreground">
						Powered by trusted market and data partners
					</p>
					<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
						{PROVIDER_ASSETS.map((provider, index) => (
							<li key={provider.id}>
								<motion.div
									className="flex h-full flex-col items-center gap-2.5 rounded-[var(--radius-md)] border border-border bg-background p-4 text-center"
									initial={{ opacity: 0, y: 12 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.3 }}
									transition={{
										delay: index * 0.04,
										duration: 0.4,
										ease: easeEnter,
									}}
									whileHover={{ y: -3 }}
								>
									<ProviderLogo
										src={provider.logo}
										alt={`${provider.name} logo`}
										size={40}
									/>
									<div>
										<p className="text-caption-sm font-semibold text-foreground">
											{provider.name}
										</p>
										<p className="mt-0.5 text-[10px] text-muted-foreground">
											{provider.role}
										</p>
									</div>
								</motion.div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
