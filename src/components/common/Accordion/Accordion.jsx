/* ============================================
   Accordion — accessible expand/collapse
   Icon Commerce College
   --------------------------------------------
   Used by Departments and the Admissions FAQ. Each item uses a real
   <button> header with `aria-expanded` / `aria-controls`, and the panel
   uses `role="region"`. Motion is height-animated and collapses to an
   instant toggle under `prefers-reduced-motion`.

   Usage:
     <Accordion
       items={[{ title, content }, ...]}
       allowMultiple={false}
       defaultOpen={[0]}
     />
   ============================================ */

import React, { useState, useId, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useReducedMotionVariants } from '../../../utils/motion';
import styles from './Accordion.module.css';

/**
 * @param {{title: React.ReactNode, content: React.ReactNode}[]} items
 * @param {boolean} allowMultiple  Allow several panels open at once.
 * @param {number[]} defaultOpen   Indexes open on mount.
 * @param {'navy'|'gold'} accent   Active header accent colour.
 */
const Accordion = ({
  items = [],
  allowMultiple = false,
  defaultOpen = [],
  accent = 'navy',
  className = '',
}) => {
  const [openSet, setOpenSet] = useState(() => new Set(defaultOpen));
  const baseId = useId();
  const { reduced } = useReducedMotionVariants();

  const toggle = useCallback(
    (index) => {
      setOpenSet((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          if (!allowMultiple) next.clear();
          next.add(index);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  const classNames = [styles.accordion, styles[`accent-${accent}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {items.map((item, index) => {
        const isOpen = openSet.has(index);
        const headerId = `${baseId}-h-${index}`;
        const panelId = `${baseId}-p-${index}`;

        return (
          <div
            key={index}
            className={`${styles.item} ${isOpen ? styles.open : ''}`}
          >
            <h3 className={styles.heading}>
              <button
                type="button"
                id={headerId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
              >
                <span className={styles.title}>{item.title}</span>
                <Icon
                  icon="mdi:chevron-down"
                  className={styles.chevron}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className={styles.panel}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={reduced ? {} : { height: 'auto', opacity: 1 }}
                  exit={reduced ? {} : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className={styles.panelInner}>{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
