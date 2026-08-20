"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds — pass `i * 0.1` inside a `.map()` for a cascading reveal. */
  delay?: number;
  /**
   * "view" (default): animates in once the element scrolls into the viewport — for content
   * below the fold. "mount": animates immediately on first render — for above-the-fold content
   * (e.g. Hero), where "scroll into view" would never trigger.
   */
  mode?: "view" | "mount";
}

export function Reveal({ children, className, delay = 0, mode = "view" }: RevealProps) {
  const transition = { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const };

  if (mode === "mount") {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={VARIANTS}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={VARIANTS}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
