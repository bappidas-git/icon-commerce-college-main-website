/* ============================================
   MonthGrid — shared month calendar grid
   Icon Commerce College
   --------------------------------------------
   A dependency-free month calendar extracted from the public Events page
   (prompt 24) so the public site AND the admin panel (prompt 31) share ONE
   calendar component. It owns the month + selected-day state and renders a
   7-column grid that highlights days with events (multi-day events highlight
   every day in their span). Prev/next/Today navigation moves the month; the
   grid opens on the most relevant month for the current (filtered) events — the
   next upcoming event, else the most recent — and auto-selects that month's
   first event day, so it is never blank on load.

   The selected day's detail panel is supplied by the consumer via the
   `renderDetail` render-prop, which receives { selectedKey, dayEvents, today,
   selectDay }: the public page renders read-only <EventCard>s; the admin page
   renders editable rows + an "Add event on this day" button. Everything else
   (the grid, navigation, highlighting, responsive two-column layout) is shared.
   ============================================ */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

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
} from '../../../utils/dateUtils';
import styles from './MonthGrid.module.css';

const MonthGrid = ({ events = [], renderDetail, ariaLabel = 'Event calendar' }) => {
  // Stable "today" so dependent memos/effects don't churn on every render.
  const today = useMemo(() => startOfToday(), []);

  // Map every covered day → the events happening that day (multi-day spans mark
  // each day they cover).
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

  // Mirror the latest selection in a ref so the auto-select effect can read it
  // WITHOUT depending on it — otherwise selecting an empty day (admin adds an
  // event on it) would immediately be overridden back to the first event day.
  const selectedKeyRef = useRef(selectedKey);
  const selectDay = useCallback((key) => {
    selectedKeyRef.current = key;
    setSelectedKey(key);
  }, []);

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

  // Auto-select the first event day of the visible month when the month or the
  // events change — but keep the user's current day if it is still an event day
  // in view (so admin mutations don't yank the selection away).
  useEffect(() => {
    const current = selectedKeyRef.current;
    const stillValid = current && cells.some((c) => c.key === current && c.inMonth && c.count > 0);
    if (stillValid) return;
    const firstWithEvents = cells.find((c) => c.inMonth && c.count > 0);
    selectDay(firstWithEvents ? firstWithEvents.key : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthDate, eventsByDay]);

  const dayEvents = selectedKey ? eventsByDay.get(selectedKey) || [] : [];
  const monthLabel = `${MONTHS_LONG[monthDate.getMonth()]} ${monthDate.getFullYear()}`;

  const goToToday = () => setMonthDate(startOfMonth(today));

  return (
    <div className={`${styles.calendar} ${renderDetail ? '' : styles.calendarGridOnly}`.trim()}>
      <div className={styles.grid} role="group" aria-label={ariaLabel}>
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
                onClick={() => selectDay(cell.key)}
              >
                <span className={styles.dayNum}>{cell.date.getDate()}</span>
                {hasEvents && <span className={styles.dot} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day's detail — supplied by the consumer. */}
      {renderDetail && (
        <div className={styles.detail} aria-live="polite">
          {renderDetail({ selectedKey, dayEvents, today, selectDay })}
        </div>
      )}
    </div>
  );
};

export default MonthGrid;
