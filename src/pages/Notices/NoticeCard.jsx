/* ============================================
   NoticeCard — a single notice with inline expand (prompt 24)
   Icon Commerce College
   --------------------------------------------
   A self-contained notice: a date chip, a category badge, "New" / "Pinned"
   flags, the title and a body excerpt that expands inline (the design-system
   keeps notice "detail" as an inline expand rather than a separate route). The
   "Read more" toggle only appears when the clamped body actually overflows or
   there's an attachment, so short notices stay tidy. An optional attachment
   link is revealed with the full body.

   Record shape matches the notices.php API (prompt 28):
   { id, title, body, category, date, pinned, published, ... } plus an optional
   `attachment` (string URL, or { url, label }).
   ============================================ */

import React, { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { formatLongDate, isNew } from '../../utils/dateUtils';
import styles from './NoticeCard.module.css';

// Per-category icon (colour stays on-brand: gold-soft badge across the board).
const CATEGORY_ICONS = {
  Admission: 'mdi:account-school-outline',
  Examination: 'mdi:file-document-edit-outline',
  Event: 'mdi:calendar-star',
  Result: 'mdi:trophy-outline',
  Holiday: 'mdi:palm-tree',
  General: 'mdi:bullhorn-variant-outline',
};

/** Normalise an attachment into { url, label } or null. */
function resolveAttachment(attachment) {
  if (!attachment) return null;
  if (typeof attachment === 'string') {
    return /^https?:\/\/|^\//.test(attachment)
      ? { url: attachment, label: 'Download attachment' }
      : null;
  }
  if (attachment.url) {
    return { url: attachment.url, label: attachment.label || 'Download attachment' };
  }
  return null;
}

const NoticeCard = ({ notice }) => {
  const [open, setOpen] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const bodyRef = useRef(null);
  const baseId = useId();
  const bodyId = `${baseId}-body`;

  const attachment = resolveAttachment(notice.attachment);
  const isRecent = isNew(notice.date, notice.pinned);
  const categoryIcon = CATEGORY_ICONS[notice.category] || CATEGORY_ICONS.General;

  // Measure whether the clamped body overflows so we only show "Read more" when
  // there's actually hidden content. Re-checks on resize (width changes clamp).
  useEffect(() => {
    const measure = () => {
      const el = bodyRef.current;
      if (!el || open) return;
      setOverflowing(el.scrollHeight - el.clientHeight > 1);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open, notice.body]);

  const canExpand = overflowing || open || !!attachment;

  return (
    <article className={`${styles.card} ${notice.pinned ? styles.pinned : ''}`}>
      <div className={styles.meta}>
        <time className={styles.dateChip} dateTime={notice.date}>
          <Icon icon="mdi:calendar-blank-outline" aria-hidden="true" />
          {formatLongDate(notice.date)}
        </time>
        <span className={styles.category}>
          <Icon icon={categoryIcon} aria-hidden="true" />
          {notice.category}
        </span>
        {notice.pinned && (
          <span className={`${styles.flag} ${styles.flagPinned}`}>
            <Icon icon="mdi:pin" aria-hidden="true" />
            Pinned
          </span>
        )}
        {isRecent && !notice.pinned && <span className={styles.flag}>New</span>}
      </div>

      <h3 className={styles.title}>{notice.title}</h3>

      <p
        id={bodyId}
        ref={bodyRef}
        className={`${styles.body} ${open ? styles.bodyOpen : styles.bodyClamped}`}
      >
        {notice.body}
      </p>

      {open && attachment && (
        <a
          className={styles.attachment}
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon="mdi:paperclip" aria-hidden="true" />
          <span>{attachment.label}</span>
        </a>
      )}

      {canExpand && (
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? 'Show less' : 'Read more'}</span>
          <Icon
            icon="mdi:chevron-down"
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
            aria-hidden="true"
          />
        </button>
      )}
    </article>
  );
};

export default NoticeCard;
