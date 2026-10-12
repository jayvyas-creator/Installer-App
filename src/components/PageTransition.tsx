import { motion } from "motion/react";
import type { ReactNode } from "react";

const variants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
};

// Matches --ease-standard in tokens.css, the default for route changes.
const EASE_STANDARD: [number, number, number, number] = [0.4, 0, 0.2, 1];
// Matches --ease-out-expo in tokens.css, confident decisive deceleration,
// reserved for moments like the splash screen handing off to Home.
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface PageTransitionProps {
  children: ReactNode;
  /** Easing for this route's transition. Defaults to the standard route-change ease. */
  ease?: "standard" | "expo";
}

export function PageTransition({ children, ease = "standard" }: PageTransitionProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.32, ease: ease === "expo" ? EASE_OUT_EXPO : EASE_STANDARD }}
    >
      {children}
    </motion.div>
  );
}
