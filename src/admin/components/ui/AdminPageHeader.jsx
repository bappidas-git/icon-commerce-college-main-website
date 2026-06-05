/* ============================================
   AdminPageHeader — shared admin UI
   ============================================
   Consistent page heading used across Leads / Notices / Events / Settings:
   gold eyebrow, navy title, muted subtitle and an optional right-aligned
   actions slot (buttons, filters, etc.).
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import styles from './AdminPageHeader.module.css';

const AdminPageHeader = ({ eyebrow, title, subtitle, icon, actions }) => (
  <header className={styles.header}>
    <div className={styles.heading}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <div className={styles.titleRow}>
        {icon && (
          <span className={styles.titleIcon} aria-hidden="true">
            <Icon icon={icon} width={24} height={24} />
          </span>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </header>
);

export default AdminPageHeader;
