/* ============================================
   EmptyState — icon + message + optional CTA
   Icon Commerce College
   --------------------------------------------
   Shown when a list has no content (e.g. no notices or events yet).
   Renders a gold icon chip, a title, an optional description and an
   optional call-to-action.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import Button from '../Button/Button';
import styles from './EmptyState.module.css';

/**
 * @param {string} icon         Iconify icon name (default a calendar-blank).
 * @param {React.ReactNode} title        Headline message.
 * @param {React.ReactNode} description  Supporting copy.
 * @param {{ label, onClick?, href?, variant? }} action  Optional CTA.
 * @param {React.ReactNode} children     Extra content below the CTA.
 */
const EmptyState = ({
  icon = 'mdi:inbox-outline',
  title = 'Nothing here yet',
  description,
  action,
  className = '',
  children,
}) => {
  const classNames = [styles.emptyState, className].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="status">
      <div className={styles.iconChip}>
        <Icon icon={icon} aria-hidden="true" />
      </div>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {action && (
        <div className={styles.action}>
          <Button
            variant={action.variant || 'navy'}
            size="medium"
            onClick={action.onClick}
            href={action.href}
          >
            {action.label}
          </Button>
        </div>
      )}
      {children}
    </div>
  );
};

export default EmptyState;
