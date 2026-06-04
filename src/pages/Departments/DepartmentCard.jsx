/* ============================================
   DepartmentCard — a single department tile (prompt 19)
   Icon Commerce College
   --------------------------------------------
   A tidy, self-contained card for one department: a stream-accented gold
   icon chip, the department name and a one-line blurb, plus an accessible
   accordion (real <button> with aria-expanded / aria-controls; panel
   role="region") that expands to a short description and the related
   programme link(s).

   The card carries the deep-link anchor `id` so /departments#accountancy
   scrolls to the right tile. Height animation is reduced-motion safe via
   useReducedMotionVariants (mirrors the shared Accordion).
   ============================================ */

import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useReducedMotionVariants } from '../../utils/motion';
import styles from './DepartmentCard.module.css';

/**
 * @param {Object}   subject          Subject record from departmentsData.
 * @param {string}   anchorId         Unique DOM id used as the deep-link anchor.
 * @param {{slug: string, shortName: string}[]} relatedPrograms  Resolved related programmes.
 */
const DepartmentCard = ({ subject, anchorId, relatedPrograms = [] }) => {
  const [open, setOpen] = useState(false);
  const { reduced } = useReducedMotionVariants();
  const baseId = useId();
  const panelId = `${baseId}-panel`;

  // The card only needs an accordion when there is more to show.
  const hasDetails = Boolean(subject.description) || relatedPrograms.length > 0;

  return (
    <article id={anchorId} className={`${styles.card} ${open ? styles.open : ''}`}>
      <div className={styles.head}>
        <span className={styles.chip} aria-hidden="true">
          <Icon icon={subject.icon} />
        </span>
        <div className={styles.headText}>
          <h3 className={styles.name}>{subject.name}</h3>
          <p className={styles.blurb}>{subject.blurb}</p>
        </div>
      </div>

      {hasDetails && (
        <>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span>{open ? 'Hide details' : 'Details'}</span>
            <Icon icon="mdi:chevron-down" className={styles.chevron} aria-hidden="true" />
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                role="region"
                aria-label={`${subject.name} details`}
                initial={reduced ? false : { height: 0, opacity: 0 }}
                animate={reduced ? {} : { height: 'auto', opacity: 1 }}
                exit={reduced ? {} : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div className={styles.panelInner}>
                  {subject.description && (
                    <p className={styles.desc}>{subject.description}</p>
                  )}

                  {relatedPrograms.length > 0 && (
                    <p className={styles.related}>
                      <span className={styles.relatedLabel}>
                        Related programme{relatedPrograms.length > 1 ? 's' : ''}
                      </span>
                      <span className={styles.relatedChips}>
                        {relatedPrograms.map((program) => (
                          <Link
                            key={program.slug}
                            to={`/courses/${program.slug}`}
                            className={styles.relatedChip}
                          >
                            {program.shortName}
                            <Icon icon="mdi:arrow-top-right" aria-hidden="true" />
                          </Link>
                        ))}
                      </span>
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </article>
  );
};

export default DepartmentCard;
