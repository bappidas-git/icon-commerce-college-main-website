/* ============================================
   NoticeCard — a single notice with inline expand (prompt 24)
   Icon Commerce College
   --------------------------------------------
   A self-contained notice: a date chip, a category badge, "New" / "Pinned"
   flags, the title and a body excerpt that expands inline (the design-system
   keeps notice "detail" as an inline expand rather than a separate route). The
   "Read more" toggle only appears when the clamped body actually overflows, so
   short notices stay tidy.

   When the admin attaches a file (the optional Attachment URL), it is ALWAYS
   surfaced beneath the body — an image attachment renders as a responsive,
   clickable preview; a PDF / other file renders as a labelled "View" button.
   Both open in a new tab.

   Record shape matches the notices.php API (prompt 28):
   { id, title, body, category, date, pinned, published, ... } plus an optional
   `attachment_url` (string URL) — older records may instead carry `attachment`
   (string URL, or { url, label }), which we still honour.
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

// Extensions we can preview inline as an image; everything else is a file link.
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i;

/**
 * Normalise an attachment into { url, kind, label } or null.
 *   kind: 'image' | 'pdf' | 'file' — drives the icon and whether we preview it.
 * Accepts a plain URL string (http(s):// or a site-absolute /path) or the legacy
 * { url, label } object shape.
 */
function resolveAttachment(attachment) {
  if (!attachment) return null;
  let url = null;
  let label = null;
  if (typeof attachment === 'string') {
    const trimmed = attachment.trim();
    if (!/^https?:\/\/|^\//.test(trimmed)) return null;
    url = trimmed;
  } else if (attachment.url) {
    url = String(attachment.url).trim();
    label = attachment.label || null;
  }
  if (!url) return null;

  // Classify on the path only, ignoring any ?query / #hash.
  const path = url.split(/[?#]/)[0];
  const kind = IMAGE_EXT.test(path) ? 'image' : /\.pdf$/i.test(path) ? 'pdf' : 'file';
  return {
    url,
    kind,
    label:
      label ||
      (kind === 'image' ? 'View image' : kind === 'pdf' ? 'View PDF' : 'View attachment'),
  };
}

const NoticeCard = ({ notice }) => {
  const [open, setOpen] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const bodyRef = useRef(null);
  const baseId = useId();
  const bodyId = `${baseId}-body`;

  // Prefer the canonical `attachment_url` the admin form writes; fall back to the
  // legacy `attachment` field for any older records.
  const attachment = resolveAttachment(notice.attachment_url ?? notice.attachment);
  const showImage = attachment?.kind === 'image' && !imgError;
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

  const canExpand = overflowing || open;

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

      {notice.body && (
        <p
          id={bodyId}
          ref={bodyRef}
          className={`${styles.body} ${open ? styles.bodyOpen : styles.bodyClamped}`}
        >
          {notice.body}
        </p>
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

      {/* Attachment — always shown when present (image preview vs file link). */}
      {attachment &&
        (showImage ? (
          <a
            className={styles.attachmentImageLink}
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${attachment.label} (opens in a new tab)`}
          >
            <img
              className={styles.attachmentImage}
              src={attachment.url}
              alt={`Attachment for “${notice.title}”`}
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <span className={styles.attachmentImageHint}>
              <Icon icon="mdi:magnify-plus-outline" aria-hidden="true" />
              <span>{attachment.label}</span>
            </span>
          </a>
        ) : (
          <a
            className={styles.attachment}
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              icon={attachment.kind === 'pdf' ? 'mdi:file-pdf-box' : 'mdi:paperclip'}
              aria-hidden="true"
            />
            <span>{attachment.label}</span>
            <Icon icon="mdi:open-in-new" className={styles.attachmentExt} aria-hidden="true" />
          </a>
        ))}
    </article>
  );
};

export default NoticeCard;
