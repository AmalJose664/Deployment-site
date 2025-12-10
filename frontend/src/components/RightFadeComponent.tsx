"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const RightFadeComponent = ({
	children,
	delay = 0,
	duration = 0.4,
	className,
	distance = 30,
	inView,
	...props
}: {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	distance?: number;
	className?: string
	inView?: boolean

}) => {
	return (
		<motion.div
			{...props}
			initial={{ x: distance, opacity: 0 }}
			{...(
				inView
					? {
						whileInView: { opacity: 1, x: 0 },
						viewport: { once: true, amount: 0.2 },
					}
					: {
						animate: { x: 0, opacity: 1 },
					}
			)}
			transition={{
				duration,
				delay,
				ease: [0.25, 0.1, 0.25, 1],
			}}
			className={cn(className)}
		>
			{children}
		</motion.div >
	);
};

export default RightFadeComponent;