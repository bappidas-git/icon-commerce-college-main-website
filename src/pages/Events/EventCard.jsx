/* ============================================
   EventCard — a single event tile (prompt 24)
   Icon Commerce College
   --------------------------------------------
   A card with an OPTIONAL banner image on top (only when the admin sets an
   Image for the event) above a navy date block (start day + month) beside the
   event details — category badge, title, a meta row (date range · time · venue)
   and the description. Used by both the Events list view and the calendar's
   selected-day list. Past events render slightly muted via the `past` flag.

   The image can be a full URL (what the admin pastes) or a labelled placeholder
   name (the bundled seed content), both resolved via resolveImageSrc; a broken
   URL silently falls back to the imageless layout.

   Record shape matches the events.php API (prompt 30):
   { id, title, description, category, start_date, end_date?, start_time?,
     end_time?, venue?, image_url?, ... }.
   ============================================ */

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { dateTile, formatDateRange, formatTimeRange } from '../../utils/dateUtils';
import { resolveImageSrc } from '../../utils/assets';
import styles from './EventCard.module.css';

const CATEGORY_ICONS = {
  Academic: 'mdi:book-open-page-variant-outline',
  Cultural: 'mdi:drama-masks',
  Sports: 'mdi:trophy-outline',
  Examination: 'mdi:file-document-edit-outline',
  Holiday: 'mdi:palm-tree',
  Workshop: 'mdi:hammer-wrench',
  General: 'mdi:calendar-star',
};

const EventCard = ({ event, past = false }) => {
  const [imgError, setImgError] = useState(false);
  const { day, month } = dateTile(event.start_date);
  const dateRange = formatDateRange(event.start_date, event.end_date);
  const timeRange = formatTimeRange(event.start_time, event.end_time);
  const categoryIcon = CATEGORY_ICONS[event.category] || CATEGORY_ICONS.General;
  // Only render a banner when the admin set an image AND it actually loads.
  const image = imgError ? '' : resolveImageSrc(event.image_url);

  return (
    <article
      className={`${styles.card} ${past ? styles.past : ''} ${image ? styles.hasMedia : ''}`}
    >
      {image && (
        <div className={styles.media}>
          <img
            className={styles.mediaImg}
            src={image}
            alt={event.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.dateBlock} aria-hidden="true">
          <span className={styles.day}>{day}</span>
          <span className={styles.month}>{month}</span>
        </div>

        <div className={styles.body}>
          <span className={styles.category}>
            <Icon icon={categoryIcon} aria-hidden="true" />
            {event.category}
          </span>

          <h3 className={styles.title}>{event.title}</h3>

          <ul className={styles.metaRow}>
            <li className={styles.metaItem}>
              <Icon icon="mdi:calendar-range" aria-hidden="true" />
              <span>{dateRange}</span>
            </li>
            {timeRange && (
              <li className={styles.metaItem}>
                <Icon icon="mdi:clock-outline" aria-hidden="true" />
                <span>{timeRange}</span>
              </li>
            )}
            {event.venue && (
              <li className={styles.metaItem}>
                <Icon icon="mdi:map-marker-outline" aria-hidden="true" />
                <span>{event.venue}</span>
              </li>
            )}
          </ul>

          {event.description && <p className={styles.desc}>{event.description}</p>}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
