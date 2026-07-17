"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/landing/motion-section";

export function FinalCta() {
	const prefersReducedMotion = useReducedMotion();

	return (
		<MotionSection className="landing-section">
			<div className="landing-shell">
				<motion.div
					className="relative overflow-hidden rounded-[var(--radius-lg)] bg-surface-dark px-6 py-14 text-white md:px-10 md:py-16"
					whileHover={
						prefersReducedMotion
							? undefined
							: { scale: 1.005, transition: { duration: 0.35 } }
					}
				>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgb(74_21_75/0.28),transparent_45%),radial-gradient(circle_at_90%_100%,rgb(0_122_90/0.35),transparent_40%)]"
					/>
					<div className="relative mx-auto max-w-3xl text-center">
						<p className="landing-pill mx-auto mb-5 border border-white/15 bg-white/5 text-white/70">
							Ready when you are
						</p>
						<h2 className="text-display-lg text-balance text-white">
							See crypto through your lens.
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-body-md text-white/70">
							Open GeoPulse free and get a personalized market view in seconds.
							Create an account later if you want a watchlist.
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Button
								render={<Link href="/dashboard" />}
								nativeButton={false}
								className="group h-11 rounded-full bg-primary px-6 text-button-md text-white hover:bg-[color:var(--brand-pressed)] active:scale-[0.98]"
							>
								Try GeoPulse free
								<span className="ml-2 inline-flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-px">
									<ArrowUpRightIcon className="size-3.5 text-white" />
								</span>
							</Button>
							<Button
								render={<Link href="/sign-up" />}
								nativeButton={false}
								variant="secondary"
								className="h-11 rounded-full border-white/10 bg-white/10 px-6 text-button-md text-white hover:bg-white/15"
							>
								Create free account
							</Button>
						</div>
					</div>
				</motion.div>
			</div>
		</MotionSection>
	);
}
