import type { Transition, Variants } from "motion/react";

export const easeEnter = [0.22, 1, 0.36, 1] as const;
export const easeMove = [0.25, 1, 0.5, 1] as const;
export const easeDrawer = [0.32, 0.72, 0, 1] as const;

export const springSoft = {
	type: "spring" as const,
	stiffness: 260,
	damping: 28,
	mass: 0.9,
};

export const fadeUp: Variants = {
	hidden: { opacity: 0, y: 28 },
	visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.92 },
	visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.06,
		},
	},
};

export const viewportOnce = {
	once: true,
	amount: 0.2,
	margin: "0px 0px -80px 0px",
} as const;

export function motionTransition(
	duration = 0.55,
	delay = 0
): Transition {
	return {
		duration,
		delay,
		ease: easeEnter,
	};
}

export function reducedMotionVariants(variants: Variants): Variants {
	return {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
		...variants,
	};
}
