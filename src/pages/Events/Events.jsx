/* ============================================
   Events — events listing + calendar (prompt 24)
   Icon Commerce College
   --------------------------------------------
   Replaces the /events ComingSoon shell with the full events page:

     PageHero (Events · breadcrumb)
       → controls: category filter chips + a List / Calendar view toggle
       → List view     — "Upcoming" and "Past" groups of <EventCard>s
       → Calendar view — a month grid (<EventCalendar>) highlighting event days;
                          click a day to see that day's events
       → <EmptyState> when there are no events / no matches for the filter

   Data comes from `useEvents()` (seed data today; the live events.php store in
   prompt 32 — same record shape). The category filter applies to both views.
   SEO uses useSeo() with the /events route defaults.
   ============================================ */

import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { Reveal } from '../../components/common/Reveal/Reveal';

import useEvents from '../../hooks/useEvents';
import EventCard from './EventCard';
import EventCalendar from './EventCalendar';
import { startOfToday, isPastEvent, parseISODate } from '../../utils/dateUtils';
import styles from './Events.module.css';

const VIEWS = [
  { id: 'list', label: 'List', icon: 'mdi:view-list-outline' },
  { id: 'calendar', label: 'Calendar', icon: 'mdi:calendar-month-outline' },
];

const Events = () => {
  useSeo();

  const { items } = useEvents();
  // Stable "today" so the upcoming/past memo doesn't churn on every render.
  const today = useMemo(() => startOfToday(), []);

  const [category, setCategory] = useState('All');
  const [view, setView] = useState('list');

  // Category chips — 'All' + categories actually present (first-seen order).
  const categories = useMemo(() => {
    const seen = [];
    items.forEach((e) => {
      if (e.category && !seen.includes(e.category)) seen.push(e.category);
    });
    return ['All', ...seen];
  }, [items]);

  const filtered = useMemo(
    () => (category === 'All' ? items : items.filter((e) => e.category === category)),
    [items, category]
  );

  // Upcoming (soonest first — items are pre-sorted ascending) vs past (most
  // recent first).
  const { upcoming, past } = useMemo(() => {
    const up = filtered.filter((e) => !isPastEvent(e, today));
    const pa = filtered
      .filter((e) => isPastEvent(e, today))
      .sort(
        (a, b) =>
          parseISODate(b.end_date || b.start_date) -
          parseISODate(a.end_date || a.start_date)
      );
    return { upcoming: up, past: pa };
  }, [filtered, today]);

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="What's On"
        title="Events"
        subtitle="College Week, ICON Shield, ICON Trophy and more — campus events through the year, in a list or on the calendar."
        image="hero-students"
        breadcrumb={[{ label: 'Events' }]}
      />

      {/* 2 — Listing + calendar */}
      <Section bg="light" container="wide" aria-label="Events">
        {/* Controls: filters + view toggle */}
        <div className={styles.controls}>
          <div
            className={styles.filters}
            role="group"
            aria-label="Filter events by category"
          >
            {categories.map((cat) => {
              const active = cat === category;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                  aria-pressed={active}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className={styles.viewToggle} role="group" aria-label="Choose how to view events">
            {VIEWS.map((v) => {
              const active = v.id === view;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`${styles.viewBtn} ${active ? styles.viewBtnActive : ''}`}
                  aria-pressed={active}
                  onClick={() => setView(v.id)}
                >
                  <Icon icon={v.icon} aria-hidden="true" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <EmptyState
            icon="mdi:calendar-blank-outline"
            title="No events yet"
            description="Check back soon — College Week, ICON Shield and more are on the way."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="mdi:calendar-search-outline"
            title="No events in this category"
            description="Try a different category to see more events."
            action={{
              label: 'Show all events',
              onClick: () => setCategory('All'),
              variant: 'navy',
            }}
          />
        ) : view === 'calendar' ? (
          <Reveal variant="fadeUp" amount={0.05}>
            <EventCalendar events={filtered} />
          </Reveal>
        ) : (
          <div className={styles.listView}>
            {/* Upcoming */}
            <div className={styles.group}>
              <h2 className={styles.groupTitle}>
                <Icon icon="mdi:calendar-arrow-right" aria-hidden="true" />
                Upcoming Events
              </h2>
              {upcoming.length ? (
                <ul className={styles.grid}>
                  {upcoming.map((event) => (
                    <Reveal as="li" key={event.id} variant="fadeUp" amount={0.1}>
                      <EventCard event={event} />
                    </Reveal>
                  ))}
                </ul>
              ) : (
                <p className={styles.groupEmpty}>
                  No upcoming events scheduled right now — check back soon.
                </p>
              )}
            </div>

            {/* Past */}
            {past.length > 0 && (
              <div className={styles.group}>
                <h2 className={styles.groupTitle}>
                  <Icon icon="mdi:history" aria-hidden="true" />
                  Past Events
                </h2>
                <ul className={styles.grid}>
                  {past.map((event) => (
                    <Reveal as="li" key={event.id} variant="fadeUp" amount={0.1}>
                      <EventCard event={event} past />
                    </Reveal>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Section>
    </>
  );
};

export default Events;
