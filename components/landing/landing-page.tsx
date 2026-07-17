import { DeveloperSection } from "@/components/landing/developer-section";
import { FeatureBento } from "@/components/landing/feature-bento";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { LogoStrip } from "@/components/landing/logo-strip";
import { ProductShowcase } from "@/components/landing/product-showcase";

export function LandingPage() {
	return (
		<div className="relative min-h-[100dvh] overflow-x-clip bg-background text-foreground">
			<LandingNav />
			<main>
				<HeroSection />
				<LogoStrip />
				<ProductShowcase />
				<FeatureBento />
				<HowItWorks />
				<DeveloperSection />
				<FinalCta />
			</main>
			<LandingFooter />
		</div>
	);
}
