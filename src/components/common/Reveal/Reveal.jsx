/* ============================================
   Reveal & RevealGroup — reveal-on-scroll wrappers
   Icon Commerce College
   --------------------------------------------
   The standard way to animate content into view. Both components route
   their variants through `useReducedMotionVariants()` so transforms are
   automatically disabled when the user prefers reduced motion.

   • <Reveal>       — animates a single block with the chosen variant.
   • <RevealGroup>  — staggers its direct children (the "shuttle" cascade);
                      wrap each child in <Reveal> (or pass plain nodes and
                      they will be wrapped automatically).
   ============================================ */

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionVariants } from '../../../utils/motion';

/**
 * Reveal — animate a single element on scroll into view.
 *
 * @param {React.ElementType} as        Element/tag to render (default 'div').
 * @param {string}  variant   One of fadeUp | fadeIn | scaleIn | slideInLeft | slideInRight.
 * @param {number}  delay     Extra delay (seconds) before this item animates.
 * @param {boolean} once      Animate only the first time it enters view (default true).
 * @param {string}  amount    Viewport amount in view before triggering (Framer `amount`).
 * @param {boolean} group     Internal: when true, defer to a parent container's orchestration.
 */
export const Reveal = ({
  as = 'div',
  variant = 'fadeUp',
  delay = 0,
  once = true,
  amount = 0.2,
  group = false,
  className = '',
  children,
  ...props
}) => {
  const v = useReducedMotionVariants();
  const baseVariant = v.resolve(variant);

  // Apply an optional per-item delay without mutating the shared variant object.
  const variants = delay
    ? {
        hidden: baseVariant.hidden,
        show: {
          ...baseVariant.show,
          transition: { ...(baseVariant.show.transition || {}), delay },
        },
      }
    : baseVariant;

  const MotionTag = motion[as] || motion.div;

  // Inside a RevealGroup the parent drives initial/whileInView, so children
  // only declare their variants and inherit the orchestrated state.
  const orchestrationProps = group
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once, amount },
      };

  return (
    <MotionTag className={className} variants={variants} {...orchestrationProps} {...props}>
      {children}
    </MotionTag>
  );
};

/**
 * RevealGroup — stagger a set of children into view ("shuttle" cascade).
 * Direct children are wrapped in a grouped <Reveal> automatically unless
 * they already are Reveal elements.
 *
 * @param {React.ElementType} as       Wrapper element/tag (default 'div').
 * @param {number}  stagger   Seconds between each child (default 0.08).
 * @param {string}  childVariant  Variant applied to auto-wrapped children.
 * @param {boolean} once      Animate only once (default true).
 * @param {string}  amount    Viewport amount before triggering.
 */
export const RevealGroup = ({
  as = 'div',
  stagger = 0.08,
  childVariant = 'fadeUp',
  once = true,
  amount = 0.15,
  className = '',
  children,
  ...props
}) => {
  const v = useReducedMotionVariants();
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      variants={v.container(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        // Already a Reveal — just mark it as group-managed.
        if (child.type === Reveal) {
          return React.cloneElement(child, { group: true });
        }
        // Otherwise wrap the node so it participates in the cascade.
        return (
          <Reveal group variant={childVariant}>
            {child}
          </Reveal>
        );
      })}
    </MotionTag>
  );
};

export default Reveal;
