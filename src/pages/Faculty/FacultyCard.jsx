/* ============================================
   FacultyCard — a single teaching-staff tile (prompt 20)
   Icon Commerce College
   --------------------------------------------
   A self-contained profile card: a gold-ringed circular photo (placeholder),
   the member's name, designation, prospectus-sourced qualifications and a
   department chip. A subtle CSS-only hover lift (kept off the entrance
   transform, per the Leadership/WhyChoose precedent).

   When a member has a `bio` (added in prompt 37) the card grows an accessible
   expand toggle — a real <button> with aria-expanded / aria-controls and a
   panel with role="region" — whose height animation is reduced-motion safe via
   useReducedMotionVariants. Members without a bio (all of them today) render no
   toggle, so nothing fabricated is shown.
   ============================================ */

import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useReducedMotionVariants } from '../../utils/motion';
import styles from './FacultyCard.module.css';

/**
 * @param {Object} member  Faculty record from facultyData / guestFaculty.
 */
const FacultyCard = ({ member }) => {
  const [open, setOpen] = useState(false);
  const { reduced } = useReducedMotionVariants();
  const panelId = `${useId()}-bio`;

  const hasBio = Boolean(member.bio);

  return (
    <article className={`${styles.card} ${open ? styles.open : ''}`}>
      <div className={styles.avatarWrap}>
        <img
          src={member.image}
          alt={`${member.name}, ${member.designation} at Icon Commerce College`}
          className={styles.avatar}
          loading="lazy"
          width="112"
          height="112"
        />
      </div>

      <h3 className={styles.name}>{member.name}</h3>
      <p className={styles.designation}>{member.designation}</p>

      {member.qualifications && (
        <p className={styles.quals}>{member.qualifications}</p>
      )}

      {member.department && (
        <p className={styles.dept}>
          <Icon icon="mdi:school-outline" aria-hidden="true" />
          <span>{member.department}</span>
        </p>
      )}

      {hasBio && (
        <>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span>{open ? 'Hide bio' : 'Read bio'}</span>
            <Icon icon="mdi:chevron-down" className={styles.chevron} aria-hidden="true" />
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                role="region"
                aria-label={`${member.name} biography`}
                initial={reduced ? false : { height: 0, opacity: 0 }}
                animate={reduced ? {} : { height: 'auto', opacity: 1 }}
                exit={reduced ? {} : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <p className={styles.bio}>{member.bio}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </article>
  );
};

export default FacultyCard;
