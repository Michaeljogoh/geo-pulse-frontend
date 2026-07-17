"use client";

import Link from "next/link";
import { GeoPulseLogo } from "@/components/brand/geopulse-logo";

const footerLinks = [
	{
		title: "Product",
		links: [
			{ label: "Try GeoPulse", href: "/dashboard" },
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "Sign in", href: "/sign-in" },
			{ label: "Create account", href: "/sign-up" },
		],
	},
	{
		title: "Explore",
		links: [
			{ label: "Features", href: "#features" },
			{ label: "Product", href: "#product" },
			{ label: "How it works", href: "#how-it-works" },
			{ label: "Why GeoPulse", href: "#why" },
		],
	},
];

export function LandingFooter() {
	return (
		<footer className="border-t border-border py-10 md:py-16">
			<div className="landing-shell">
				<div className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
					<div className="flex flex-col items-center text-center md:items-start md:text-left">
						<GeoPulseLogo />
						<p className="mt-4 max-w-sm text-pretty text-body-sm text-muted-foreground">
							Crypto markets, news, and location context personalized to you.
							Decide faster with one clear dashboard.
						</p>
					</div>

					{/* 2-up on phones; joins the md grid as separate columns */}
					<div className="grid grid-cols-2 gap-x-6 gap-y-8 md:contents">
						{footerLinks.map((group) => (
							<div key={group.title} className="min-w-0">
								<h3 className="text-body-sm-strong">{group.title}</h3>
								<ul className="mt-3 space-y-2.5">
									{group.links.map((link) => (
										<li key={link.label}>
											<Link
												href={link.href}
												className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-6 text-center text-caption-sm text-muted-foreground md:flex-row md:justify-between md:text-left">
					<p>© {new Date().getFullYear()} GeoPulse. All rights reserved.</p>
					<p className="max-w-xs text-pretty md:max-w-none">
						Free to explore · Sign in to save a watchlist
					</p>
				</div>
			</div>
		</footer>
	);
}
