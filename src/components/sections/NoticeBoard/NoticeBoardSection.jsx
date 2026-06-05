/* ============================================
   NoticeBoardSection — Home "Notices & Events" band (prompt 14)
   Icon Commerce College
   --------------------------------------------
   A two-up band beneath the "why choose" section:
     • Left  — an auto-cycling "Notice Board" (date chip + title + "New" badge)
               that gently scrolls the active notice into view; pauses on hover
               / focus and stops entirely under prefers-reduced-motion.
     • Right — an "Upcoming Events" preview (the next 2–3 events).

   Data comes from the `useNotices()` / `useEvents()` hooks, now wired to the
   live notices.php / events.php stores (published-only, with a silent fall back
   to seed data so the band is never blank). Each panel links out (View all
   notices → /notices, All events → /events) and falls back to an <EmptyState>
   when its list is empty.

   Following the section precedent (Highlights / WhyChoose), entrance motion is
   owned by the outer <Reveal>/<RevealGroup> wrappers (reduced-motion safe) while
   row hovers are pure CSS, so the two never fight over `transform`.
   ============================================ */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useReducedMotion } from 'framer-motion';
import Section from '../../common/Section/Section';
import { Reveal } from '../../common/Reveal/Reveal';
import EmptyState from '../../common/EmptyState/EmptyState';
import useNotices from '../../../hooks/useNotices';
import useEvents from '../../../hooks/useEvents';
import styles from './NoticeBoardSection.module.css';

// Home-preview caps and the "New" badge window.
const MAX_NOTICES = 5;
const MAX_EVENTS = 3;
const NEW_WINDOW_DAYS = 30;
const CYCLE_MS = 4000;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Parse a YYYY-MM-DD(THH:mm...) string to a LOCAL-midnight Date (no TZ drift). */
function parseDate(iso) {
  const [y, m, d] = String(iso).split('T')[0].split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

const startOfToday = () => {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};

/** Day-number + short-month parts for a calendar-style date tile. */
function dateTile(iso) {
  const d = parseDate(iso);
  return { day: d.getDate(), month: MONTHS[d.getMonth()] };
}

/** "15 May 2026" pill text for a notice. */
function noticeDate(iso) {
  const d = parseDate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** A notice is "New" if pinned or published within the last NEW_WINDOW_DAYS. */
function isNewNotice(notice) {
  if (notice.pinned) return true;
  const days = (startOfToday() - parseDate(notice.date)) / 86400000;
  return days >= 0 && days <= NEW_WINDOW_DAYS;
}

/** Human date / range for an event ("16 Feb" or "16–21 Feb"). */
function eventRange(event) {
  const start = dateTile(event.start_date);
  if (!event.end_date || event.end_date === event.start_date) {
    return `${start.day} ${start.month}`;
  }
  const end = dateTile(event.end_date);
  return start.month === end.month
    ? `${start.day}–${end.day} ${end.month}`
    : `${start.day} ${start.month} – ${end.day} ${end.month}`;
}

const NoticeBoardSection = () => {
  const reduced = useReducedMotion();
  const { notices } = useNotices();
  const { events } = useEvents();

  const visibleNotices = useMemo(
    () => notices.slice(0, MAX_NOTICES),
    [notices]
  );

  // Prefer events that haven't ended yet; fall back to the soonest seed events
  // so the preview is never empty until the admin posts dated events (prompt 32).
  const upcoming = useMemo(() => {
    const today = startOfToday();
    const future = events.filter(
      (e) => parseDate(e.end_date || e.start_date) >= today
    );
    return (future.length ? future : events).slice(0, MAX_EVENTS);
  }, [events]);

  // ---- Auto-cycling notice highlight ----
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  const canCycle = !reduced && visibleNotices.length > 1;

  useEffect(() => {
    if (!canCycle || paused) return undefined;
    const id = setInterval(
      () => setActive((i) => (i + 1) % visibleNotices.length),
      CYCLE_MS
    );
    return () => clearInterval(id);
  }, [canCycle, paused, visibleNotices.length]);

  // Keep the active row scrolled into view WITHIN the panel only (no page jump).
  useEffect(() => {
    if (reduced) return;
    const panel = listRef.current;
    const item = itemRefs.current[active];
    if (!panel || !item) return;
    panel.scrollTo({ top: item.offsetTop, behavior: 'smooth' });
  }, [active, reduced]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <Section
      bg="light"
      container="wide"
      eyebrow="Stay Updated"
      title="Notices & Upcoming Events"
      subtitle="The latest announcements and what's happening on campus — straight from the college desk."
      aria-label="Notices and upcoming events"
    >
      <div className={styles.board}>
        {/* ---------- Notice Board ---------- */}
        <Reveal as="article" className={styles.panel} variant="slideInLeft">
          <header className={styles.panelHead}>
            <span className={styles.panelIcon} aria-hidden="true">
              <Icon icon="mdi:bullhorn-variant-outline" />
            </span>
            <h3 className={styles.panelTitle}>Notice Board</h3>
          </header>

          {visibleNotices.length ? (
            <ul
              className={styles.noticeList}
              ref={listRef}
              onMouseEnter={pause}
              onMouseLeave={resume}
              onFocusCapture={pause}
              onBlurCapture={resume}
            >
              {visibleNotices.map((notice, i) => (
                <li
                  key={notice.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`${styles.noticeRow} ${
                    i === active ? styles.noticeActive : ''
                  }`}
                >
                  <Link to="/notices" className={styles.noticeLink}>
                    <time className={styles.dateChip} dateTime={notice.date}>
                      <Icon
                        icon="mdi:calendar-blank-outline"
                        aria-hidden="true"
                      />
                      {noticeDate(notice.date)}
                    </time>
                    <div className={styles.noticeBody}>
                      <span className={styles.category}>{notice.category}</span>
                      <h4 className={styles.noticeTitle}>{notice.title}</h4>
                    </div>
                    {isNewNotice(notice) && (
                      <span className={styles.newBadge}>New</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="mdi:bullhorn-outline"
              title="No notices yet"
              description="New announcements will appear here as soon as they're published."
            />
          )}

          <Link to="/notices" className={styles.panelLink}>
            <span>View all notices</span>
            <Icon icon="mdi:arrow-right" aria-hidden="true" />
          </Link>
        </Reveal>

        {/* ---------- Upcoming Events ---------- */}
        <Reveal as="article" className={styles.panel} variant="slideInRight">
          <header className={styles.panelHead}>
            <span className={styles.panelIcon} aria-hidden="true">
              <Icon icon="mdi:calendar-star" />
            </span>
            <h3 className={styles.panelTitle}>Upcoming Events</h3>
          </header>

          {upcoming.length ? (
            <ul className={styles.eventList}>
              {upcoming.map((event) => {
                const { day, month } = dateTile(event.start_date);
                return (
                  <li key={event.id} className={styles.eventRow}>
                    <Link to="/events" className={styles.eventLink}>
                      <time
                        className={styles.eventDate}
                        dateTime={event.start_date}
                      >
                        <span className={styles.eventDay}>{day}</span>
                        <span className={styles.eventMonth}>{month}</span>
                      </time>
                      <div className={styles.eventBody}>
                        <span className={styles.category}>{event.category}</span>
                        <h4 className={styles.eventTitle}>{event.title}</h4>
                        <p className={styles.eventMeta}>
                          <span className={styles.metaItem}>
                            <Icon
                              icon="mdi:calendar-range"
                              aria-hidden="true"
                            />
                            <span>{eventRange(event)}</span>
                          </span>
                          {event.venue && (
                            <span className={styles.metaItem}>
                              <Icon
                                icon="mdi:map-marker-outline"
                                aria-hidden="true"
                              />
                              <span>{event.venue}</span>
                            </span>
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon="mdi:calendar-blank-outline"
              title="No upcoming events"
              description="Check back soon — College Week, ICON Shield and more are on the way."
            />
          )}

          <Link to="/events" className={styles.panelLink}>
            <span>All events</span>
            <Icon icon="mdi:arrow-right" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </Section>
  );
};

export default NoticeBoardSection;
