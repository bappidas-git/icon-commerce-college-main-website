/* ============================================
   InlineNotice — subtle, non-blocking status banner (prompt 35)
   Icon Commerce College
   --------------------------------------------
   A small inline banner for surfacing a friendly message without taking over
   the screen — used on the public Notices / Events pages when the live store
   can't be reached and the page is showing saved (fallback) content. It carries
   an optional action (e.g. a "Retry" button), so the user is never left with a
   silent, possibly-stale list.

   For blocking, one-off confirmations (e.g. a failed lead submit) use the swal
   helper instead; this is for persistent, recoverable states alongside content.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import styles from './InlineNotice.module.css';

/**
 * @param {string} icon            Iconify icon name.
 * @param {'warning'|'info'} tone  Visual tone (default 'warning').
 * @param {React.ReactNode} children  Message text.
 * @param {{ label: string, onClick: Function, icon?: string }} [action]  Optional CTA.
 * @param {string} [className]
 */
const InlineNotice = ({
  icon = 'mdi:wifi-alert',
  tone = 'warning',
  children,
  action,
  className = '',
}) => {
  const classes = [styles.notice, styles[tone] || '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="status">
      <Icon icon={icon} className={styles.icon} aria-hidden="true" />
      <p className={styles.text}>{children}</p>
      {action && (
        <button type="button" className={styles.action} onClick={action.onClick}>
          {action.icon && <Icon icon={action.icon} aria-hidden="true" />}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
};

export default InlineNotice;
