"use client";

/**
 * AnimatedHero — animation layer only.
 * Provides containerVariants + itemVariants for a staggered entrance
 * animation. Use these variants on motion.div / motion.p / motion.h1
 * elements in any hero section.
 *
 * Usage:
 *   <motion.div variants={heroContainer} initial="hidden" animate="visible">
 *     <motion.p variants={heroItem}>Eyebrow</motion.p>
 *     <motion.h1 variants={heroItem}>Heading</motion.h1>
 *   </motion.div>
 */

export const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const heroItem = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

/** Fade-in only (no vertical shift) — for decorative/ornamental elements */
export const heroFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
};

/** Slide in from left — for eyebrow rules / ornamental lines */
export const heroLineLeft = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};
