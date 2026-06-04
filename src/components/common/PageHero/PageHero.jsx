/* ============================================
   PageHero (placeholder)
   Icon Commerce College
   --------------------------------------------
   Lightweight navy hero used by the page shells
   created in prompt 04. The full, image-backed
   PageHero (eyebrow, breadcrumb, overlay) is built
   in prompt 07 — this placeholder keeps the same
   prop shape (`eyebrow` / `title` / `subtitle`) so
   pages don't need to change when it is replaced.
   ============================================ */

import React from 'react';
import styles from './PageHero.module.css';

const PageHero = ({ eyebrow, title, subtitle }) => (
  <section className={styles.hero} aria-label={title}>
    <div className={styles.inner}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  </section>
);

export default PageHero;
