/* ============================================
   StatTile — shared admin UI
   ============================================
   Compact metric card (icon chip + value + label) used on the Dashboard and
   in module summaries. `tone` selects the icon-chip colour.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from './StatTile.module.css';

const TONES = ['navy', 'gold', 'green', 'red', 'blue', 'teal', 'pink'];

// Pass `to` to turn the whole tile into a router link to its source module
// (e.g. the Dashboard "Active Notices" tile → /admin/notices).
const StatTile = ({ icon, value, label, tone = 'navy', hint, to }) => {
  const toneClass = TONES.includes(tone) ? styles[`tone_${tone}`] : styles.tone_navy;

  const inner = (
    <>
      {icon && (
        <div className={`${styles.icon} ${toneClass}`} aria-hidden="true">
          <Icon icon={icon} width={22} height={22} />
        </div>
      )}
      <div className={styles.body}>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${styles.tile} ${styles.tileLink}`}>
        {inner}
      </Link>
    );
  }

  return <div className={styles.tile}>{inner}</div>;
};

export default StatTile;
