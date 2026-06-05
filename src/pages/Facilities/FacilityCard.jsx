/* ============================================
   FacilityCard — a single facility tile (prompt 21)
   Icon Commerce College
   --------------------------------------------
   A compact, self-contained card for one facility: a gold icon chip, the
   facility name and a one-line blurb. Following the WhyChoose / Highlights
   precedent the card is plain markup with a CSS-only hover lift, and is wrapped
   in <Reveal>/<RevealGroup> by the page — so the entrance animation routes
   through useReducedMotionVariants() and never double-animates against the card.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import styles from './FacilityCard.module.css';

/**
 * @param {Object} facility              Facility record from facilitiesData.
 * @param {string} facility.icon         Iconify icon name.
 * @param {string} facility.title        Facility name.
 * @param {string} facility.description  One-line blurb.
 */
const FacilityCard = ({ facility }) => (
  <article className={styles.card}>
    <span className={styles.chip} aria-hidden="true">
      <Icon icon={facility.icon} />
    </span>
    <h3 className={styles.title}>{facility.title}</h3>
    <p className={styles.blurb}>{facility.description}</p>
  </article>
);

export default FacilityCard;
