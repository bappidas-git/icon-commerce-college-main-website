/* ============================================
   StatTile — shared admin UI
   ============================================
   Compact metric card (icon chip + value + label) used on the Dashboard and
   in module summaries. `tone` selects the icon-chip colour.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import styles from './StatTile.module.css';

const TONES = ['navy', 'gold', 'green', 'red', 'blue', 'teal', 'pink'];

const StatTile = ({ icon, value, label, tone = 'navy', hint }) => {
  const toneClass = TONES.includes(tone) ? styles[`tone_${tone}`] : styles.tone_navy;

  return (
    <div className={styles.tile}>
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
    </div>
  );
};

export default StatTile;
