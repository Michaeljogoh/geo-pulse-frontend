"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type CoinLogoProps = {
	src: string;
	alt: string;
	size?: number;
	className?: string;
};

export function CoinLogo({ src, alt, size = 28, className }: CoinLogoProps) {
	return (
		<span
			className={cn(
				"relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border/80",
				className
			)}
			style={{ width: size, height: size }}
		>
			<Image
				src={src}
				alt={alt}
				width={size}
				height={size}
				className="object-cover"
			/>
		</span>
	);
}

type ProviderLogoProps = {
	src: string;
	alt: string;
	size?: number;
	className?: string;
};

export function ProviderLogo({
	src,
	alt,
	size = 36,
	className,
}: ProviderLogoProps) {
	return (
		<span
			className={cn(
				"relative inline-flex shrink-0 overflow-hidden rounded-[10px] ring-1 ring-border/70",
				className
			)}
			style={{ width: size, height: size }}
		>
			<Image
				src={src}
				alt={alt}
				width={size}
				height={size}
				className="object-cover"
			/>
		</span>
	);
}
