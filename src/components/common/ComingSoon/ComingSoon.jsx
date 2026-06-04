/* ============================================
   ComingSoon block
   Icon Commerce College
   --------------------------------------------
   Shared placeholder body rendered by the page
   shells from prompt 04. Each public page's real
   content is assembled in later prompts; until then
   this communicates that the route exists and is
   under construction.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import styles from './ComingSoon.module.css';

const ComingSoon = ({ label }) => (
  <section className={styles.comingSoon}>
    <div className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        <Icon icon="mdi:hammer-wrench" />
      </span>
      <p className={styles.badge}>Coming soon</p>
      <p className={styles.text}>
        The {label} page is being built and will be available shortly.
        In the meantime, our admission team is happy to help.
      </p>
    </div>
  </section>
);

export default ComingSoon;
