import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
	title: "GeoPulse: Crypto Markets Localized to You",
	description:
		"See live crypto prices in your currency, trending coins, and regional news the moment you open GeoPulse. Free to try. No setup required.",
	openGraph: {
		title: "GeoPulse: Crypto Markets Localized to You",
		description:
			"Personalized crypto intelligence: local prices, trending markets, and news that matches where you are.",
		type: "website",
	},
};

export default function HomePage() {
	return <LandingPage />;
}
