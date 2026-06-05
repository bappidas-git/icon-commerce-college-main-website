/* ============================================
   EventCalendar — lightweight month grid (prompt 24)
   Icon Commerce College
   --------------------------------------------
   A dependency-free month calendar: a 7-column grid that highlights days with
   events (multi-day events highlight every day in their span). Prev/next/Today
   navigation moves the month; clicking a day shows that day's events below the
   grid (via <EventCard>). The grid opens on the most relevant month for the
   current (filtered) events — the next upcoming event, else the most recent —
   and auto-selects that month's first event day, so it's never blank on load.

   Self-contained: it receives the already-filtered `events` array and owns its
   month + selected-day state.
   ============================================ */

import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

import EventCard from './EventCard';
import {
  parseISODate,
  startOfToday,
  startOfMonth,
  addMonths,
  isSameDay,
  toISOKey,
  isPastEvent,
  WEEKDAYS_SHORT,
  MONTHS_LONG,
  formatFullDate,
} from '../../utils/dateUtils';
import styles from './EventCalendar.module.css';

const EventCalendar = ({ events = [] }) => {
  // Stable "today" so dependent memos/effects don't churn on every render.
  const today = useMemo(() => startOfToday(), []);

  // Map every covered day → the events happening that day (multi-day spans
  // mark each day they cover).
  const eventsByDay = useMemo(() => {
    const map = new Map();
    events.forEach((event) => {
      const start = parseISODate(event.start_date);
      const end = parseISODate(event.end_date || event.start_date);
      const cursor = new Date(start);
      // Guard against reversed ranges; cap the walk defensively.
      let guard = 0;
      while (cursor <= end && guard < 366) {
        const key = toISOKey(cursor);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(event);
        cursor.setDate(cursor.getDate() + 1);
        guard += 1;
      }
    });
    return map;
  }, [events]);

  // The month to open on: next upcoming event → else most recent → else today.
  const anchorMonth = useMemo(() => {
    if (!events.length) return startOfMonth(today);
    const upcoming = events.find((e) => !isPastEvent(e, today));
    const target = upcoming || events[events.length - 1];
    return startOfMonth(parseISODate(target.start_date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const [monthDate, setMonthDate] = useState(anchorMonth);
  const [selectedKey, setSelectedKey] = useState(null);

  // Re-anchor when the (filtered) events change.
  const anchorKey = toISOKey(anchorMonth);
  useEffect(() => {
    setMonthDate(anchorMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorKey]);

  // Build the grid cells (full weeks covering the visible month).
  const cells = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const startOffset = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      const date = new Date(year, month, 1 - startOffset + i);
      const key = toISOKey(date);
      return {
        date,
        key,
        inMonth: date.getMonth() === month,
        count: (eventsByDay.get(key) || []).length,
        isToday: isSameDay(date, today),
      };
    });
  }, [monthDate, eventsByDay, today]);

  // Auto-select the first event day of the visible month on navigation.
  useEffect(() => {
    const firstWithEvents = cells.find((c) => c.inMonth && c.count > 0);
    setSelectedKey(firstWithEvents ? firstWithEvents.key : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthDate, eventsByDay]);

  const selectedEvents = selectedKey ? eventsByDay.get(selectedKey) || [] : [];
  const monthLabel = `${MONTHS_LONG[monthDate.getMonth()]} ${monthDate.getFullYear()}`;

  const goToToday = () => setMonthDate(startOfMonth(today));

  return (
    <div className={styles.calendar}>
      <div className={styles.grid} role="group" aria-label="Event calendar">
        {/* Header: month label + navigation */}
        <div className={styles.head}>
          <h3 className={styles.monthLabel} aria-live="polite">
            {monthLabel}
          </h3>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setMonthDate((d) => addMonths(d, -1))}
              aria-label="Previous month"
            >
              <Icon icon="mdi:chevron-left" aria-hidden="true" />
            </button>
            <button type="button" className={styles.todayBtn} onClick={goToToday}>
              Today
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setMonthDate((d) => addMonths(d, 1))}
              aria-label="Next month"
            >
              <Icon icon="mdi:chevron-right" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Weekday labels */}
        <div className={styles.weekdays} aria-hidden="true">
          {WEEKDAYS_SHORT.map((wd) => (
            <span key={wd} className={styles.weekday}>
              {wd}
            </span>
          ))}
        </div>

        {/* Day cells */}
        <div className={styles.days}>
          {cells.map((cell) => {
            if (!cell.inMonth) {
              return <span key={cell.key} className={styles.dayPad} aria-hidden="true" />;
            }
            const hasEvents = cell.count > 0;
            const selected = cell.key === selectedKey;
            const label = `${formatFullDate(cell.date)}${
              hasEvents
                ? `, ${cell.count} ${cell.count === 1 ? 'event' : 'events'}`
                : ', no events'
            }`;
            return (
              <button
                key={cell.key}
                type="button"
                className={[
                  styles.day,
                  hasEvents ? styles.dayHasEvents : '',
                  selected ? styles.daySelected : '',
                  cell.isToday ? styles.dayToday : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={selected}
                aria-current={cell.isToday ? 'date' : undefined}
                aria-label={label}
                onClick={() => setSelectedKey(cell.key)}
              >
                <span className={styles.dayNum}>{cell.date.getDate()}</span>
                {hasEvents && <span className={styles.dot} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day's events */}
      <div className={styles.selected} aria-live="polite">
        {selectedKey ? (
          <>
            <h3 className={styles.selectedTitle}>
              <Icon icon="mdi:calendar-today" aria-hidden="true" />
              {formatFullDate(selectedKey)}
            </h3>
            {selectedEvents.length ? (
              <ul className={styles.selectedList}>
                {selectedEvents.map((event) => (
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
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
