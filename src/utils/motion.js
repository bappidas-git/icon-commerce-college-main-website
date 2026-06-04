/* ============================================
   motion.js — Centralized Framer Motion variants ("shuttle" helpers)
   Icon Commerce College
   --------------------------------------------
   Single source of truth for the site's reveal-on-scroll and entrance
   animations (design-system §4). Every Reveal / RevealGroup and any page
   that animates must route through these variants so motion stays
   consistent and is centrally guarded by `prefers-reduced-motion`.

   Tokens (design-system §4):
     • Reveal: opacity 0→1, translateY 24px→0, duration 0.5s
     • Ease:   cubic-bezier(0.22, 1, 0.36, 1)  ("shuttle")
     • Stagger children by 0.06–0.1s (default 0.08)
   ============================================ */

import { useReducedMotion } from 'framer-motion';

// Shared timing tokens (mirror src/styles/variables.css §4).
export const EASE_SHUTTLE = [0.22, 1, 0.36, 1];
export const REVEAL_DURATION = 0.5;
export const REVEAL_DISTANCE = 24;
export const DEFAULT_STAGGER = 0.08;

/* --------------------------------------------
   Core variants
   Each variant exposes `hidden` + `show` states so a parent
   `staggerContainer` can orchestrate children via `whileInView`.
   -------------------------------------------- */

/** Fade + rise from 24px below — the default reveal-on-scroll. */
export const fadeUp = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION, ease: EASE_SHUTTLE },
  },
};

/** Plain opacity fade (no transform). */
export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: REVEAL_DURATION, ease: EASE_SHUTTLE },
  },
};

/** Gentle scale-up entrance (cards, media, icon chips). */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: REVEAL_DURATION, ease: EASE_SHUTTLE },
  },
};

/** Slide in from the left. */
export const slideInLeft = {
  hidden: { opacity: 0, x: -REVEAL_DISTANCE },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: REVEAL_DURATION, ease: EASE_SHUTTLE },
  },
};

/** Slide in from the right. */
export const slideInRight = {
  hidden: { opacity: 0, x: REVEAL_DISTANCE },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: REVEAL_DURATION, ease: EASE_SHUTTLE },
  },
};

/**
 * Parent container that staggers its children ("shuttle" cascade).
 * @param {number} stagger   Seconds between each child (0.06–0.1).
 * @param {number} delayChildren  Initial delay before the first child.
 * @returns Framer Motion variants object.
 */
export const staggerContainer = (stagger = DEFAULT_STAGGER, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Map of named variants for convenient lookup by string (e.g. <Reveal variant="scaleIn">). */
export const VARIANTS = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
};

/** Static (no-op) variant pair used when reduced motion is preferred. */
const STATIC_VARIANT = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { duration: 0 } },
};

const STATIC_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0, delayChildren: 0 } },
};

/**
 * useReducedMotionVariants — accessibility-aware variant resolver.
 *
 * Returns the real "shuttle" variants normally, but collapses them to
 * static (instant, no-transform) variants when the user has
 * `prefers-reduced-motion: reduce` set. All Reveal / RevealGroup
 * components MUST consume their variants through this hook.
 *
 * @returns {{
 *   reduced: boolean,
 *   fadeUp: object, fadeIn: object, scaleIn: object,
 *   slideInLeft: object, slideInRight: object,
 *   container: (stagger?: number, delayChildren?: number) => object,
 *   resolve: (name?: string) => object,
 * }}
 */
export function useReducedMotionVariants() {
  const reduced = useReducedMotion();

  if (reduced) {
    return {
      reduced: true,
      fadeUp: STATIC_VARIANT,
      fadeIn: STATIC_VARIANT,
      scaleIn: STATIC_VARIANT,
      slideInLeft: STATIC_VARIANT,
      slideInRight: STATIC_VARIANT,
      container: () => STATIC_CONTAINER,
      resolve: () => STATIC_VARIANT,
    };
  }

  return {
    reduced: false,
    fadeUp,
    fadeIn,
    scaleIn,
    slideInLeft,
    slideInRight,
    container: staggerContainer,
    resolve: (name = 'fadeUp') => VARIANTS[name] || fadeUp,
  };
}

const motion = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  VARIANTS,
  useReducedMotionVariants,
};

export default motion;
