"use client";

import {
	motion,
	useReducedMotion,
	type HTMLMotionProps,
	type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";
import { fadeUp, motionTransition, viewportOnce } from "@/lib/motion";

type MotionSectionProps = HTMLMotionProps<"section"> & {
	variants?: Variants;
	delay?: number;
};

export function MotionSection({
	className,
	children,
	variants = fadeUp,
	delay = 0,
	...props
}: MotionSectionProps) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.section
			className={cn(className)}
			initial={prefersReducedMotion ? "visible" : "hidden"}
			whileInView="visible"
			viewport={viewportOnce}
			variants={
				prefersReducedMotion
					? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
					: variants
			}
			transition={motionTransition(0.6, delay)}
			{...props}
		>
			{children}
		</motion.section>
	);
}

type MotionDivProps = HTMLMotionProps<"div"> & {
	variants?: Variants;
};

export function MotionDiv({
	className,
	children,
	variants = fadeUp,
	...props
}: MotionDivProps) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.div
			className={cn(className)}
			initial={prefersReducedMotion ? "visible" : "hidden"}
			whileInView="visible"
			viewport={viewportOnce}
			variants={
				prefersReducedMotion
					? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
					: variants
			}
			transition={motionTransition(0.55)}
			{...props}
		>
			{children}
		</motion.div>
	);
}

type StaggerProps = HTMLMotionProps<"div">;

export function Stagger({
	className,
	children,
	...props
}: StaggerProps) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.div
			className={cn(className)}
			initial={prefersReducedMotion ? "visible" : "hidden"}
			whileInView="visible"
			viewport={viewportOnce}
			variants={
				prefersReducedMotion
					? { hidden: {}, visible: {} }
					: {
							hidden: {},
							visible: {
								transition: {
									staggerChildren: 0.07,
									delayChildren: 0.05,
								},
							},
						}
			}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({
	className,
	children,
	...props
}: HTMLMotionProps<"div">) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.div
			className={cn(className)}
			variants={
				prefersReducedMotion
					? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
					: fadeUp
			}
			transition={motionTransition(0.5)}
			{...props}
		>
			{children}
		</motion.div>
	);
}
