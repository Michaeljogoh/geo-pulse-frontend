"use client";

import Link from "next/link";
import { GeoPulseLogo } from "@/components/brand/geopulse-logo";

const footerLinks = [
	{
		title: "Product",
		links: [
			{ label: "Try GeoPulse", href: "/dashboard" },
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
	{
		title: "Account",
		links: [
			{ label: "Sign in", href: "/sign-in" },
			{ label: "Sign up", href: "/sign-up" },
			{ label: "Dashboard", href: "/dashboard" },
		],
	},
];

export function LandingFooter() {
	return (
		<footer className="border-t border-border py-12 md:py-16">
			<div className="landing-shell">
				<div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
					<div>
						<GeoPulseLogo />
						<p className="mt-4 max-w-sm text-body-sm text-muted-foreground">
							Crypto markets, news, and location context personalized to you.
							Decide faster with one clear dashboard.
						</p>
					</div>

					{footerLinks.map((group) => (
						<div key={group.title}>
							<h3 className="text-body-sm-strong">{group.title}</h3>
							<ul className="mt-4 space-y-3">
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

				<div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-caption-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
					<p>© {new Date().getFullYear()} GeoPulse. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
