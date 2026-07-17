import type React from "react";
import { cn } from "@/lib/utils";

export function GeoPulseIcon({
	className,
	tone = "brand",
	...props
}: React.ComponentProps<"svg"> & {
	/** brand = aubergine tile · inverse = cream tile for aubergine surfaces */
	tone?: "brand" | "inverse";
}) {
	const isInverse = tone === "inverse";

	return (
		<svg
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			className={cn("size-8 shrink-0", className)}
			{...props}
		>
			<rect
				width="32"
				height="32"
				rx="10"
				className={isInverse ? "fill-[#f4ece4]" : "fill-primary"}
			/>
			<circle
				cx="16"
				cy="16"
				r="7.5"
				className={isInverse ? "stroke-[#4a154b]" : "stroke-primary-foreground"}
				strokeWidth="1.5"
				opacity="0.35"
			/>
			<circle
				cx="16"
				cy="16"
				r="4.5"
				className={isInverse ? "stroke-[#4a154b]" : "stroke-primary-foreground"}
				strokeWidth="1.5"
				opacity="0.55"
			/>
			<path
				d="M16 8.5V16L21 19"
				className={isInverse ? "stroke-[#4a154b]" : "stroke-primary-foreground"}
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
				cx="16"
				cy="16"
				r="1.75"
				className={isInverse ? "fill-[#4a154b]" : "fill-primary-foreground"}
			/>
		</svg>
	);
}

export function GeoPulseLogo({
	className,
	showWordmark = true,
	tone = "brand",
	...props
}: React.ComponentProps<"div"> & {
	showWordmark?: boolean;
	tone?: "brand" | "inverse";
}) {
	return (
		<div className={cn("flex items-center gap-2.5", className)} {...props}>
			<GeoPulseIcon className="size-9" tone={tone} />
			{showWordmark ? (
				<span className="font-heading text-lg font-bold tracking-tight text-foreground">
					GeoPulse
				</span>
			) : null}
		</div>
	);
}
