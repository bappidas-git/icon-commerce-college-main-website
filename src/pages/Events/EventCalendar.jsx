/* ============================================
   EventCalendar — public month calendar (prompt 24)
   Icon Commerce College
   --------------------------------------------
   The public Events page's calendar view. It is now a thin wrapper over the
   shared <MonthGrid> (extracted in prompt 31 so the public site and the admin
   panel use ONE calendar): MonthGrid owns the grid, navigation and day
   selection; this component only supplies the selected day's detail panel — the
   read-only <EventCard> list (multi-day + timed events render correctly), with
   past events shown slightly muted.

   Self-contained: it receives the already-filtered `events` array; MonthGrid
   owns its month + selected-day state.
   ============================================ */

import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';

import MonthGrid from '../../components/common/MonthGrid/MonthGrid';
import EventCard from './EventCard';
import { startOfToday, isPastEvent, formatFullDate } from '../../utils/dateUtils';
import styles from './EventCalendar.module.css';

const EventCalendar = ({ events = [] }) => {
  // Stable "today" so the past/upcoming styling doesn't churn on every render.
  const today = useMemo(() => startOfToday(), []);

  return (
    <MonthGrid
      events={events}
      renderDetail={({ selectedKey, dayEvents }) =>
        selectedKey ? (
          <>
            <h3 className={styles.selectedTitle}>
              <Icon icon="mdi:calendar-today" aria-hidden="true" />
              {formatFullDate(selectedKey)}
            </h3>
            {dayEvents.length ? (
              <ul className={styles.selectedList}>
                {dayEvents.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} past={isPastEvent(event, today)} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.selectedEmpty}>No events on this day.</p>
            )}
          </>
        ) : (
          <p className={styles.selectedHint}>
            <Icon icon="mdi:gesture-tap" aria-hidden="true" />
            Select a highlighted day to see its events.
          </p>
        )
      }
    />
  );
};

export default EventCalendar;
