/* ============================================
   dateUtils.js — Date helpers for Notices & Events
   Icon Commerce College
   --------------------------------------------
   Small, dependency-free date helpers shared by the Notices and Events pages
   (NoticeCard / EventCard / EventCalendar). All parsing goes through
   `parseISODate`, which reads a `YYYY-MM-DD` string as LOCAL midnight so dates
   never drift a day across time zones (the trap with `new Date('2026-02-16')`,
   which is parsed as UTC). Formatting mirrors the Indian display style already
   used on the Home "Notice Board" band (e.g. "16 Feb 2026", "16–21 Feb 2026").
   ============================================ */

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

/**
 * Parse a `YYYY-MM-DD` (or full ISO) string into a LOCAL-midnight Date.
 * Avoids the UTC-midnight drift of `new Date('2026-02-16')`.
 * @param {string|Date} value
 * @returns {Date}
 */
export function parseISODate(value) {
  if (value instanceof Date) return value;
  const [y, m, d] = String(value).split('T')[0].split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Midnight today, in local time. */
export function startOfToday() {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

/** First day of the month a date falls in (local midnight). */
export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Add `n` months to a date, returning the first of the resulting month. */
export function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

/** True when two Dates fall on the same calendar day. */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Stable `YYYY-MM-DD` key for a Date (local), e.g. for lookup maps. */
export function toISOKey(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Day-number + short-month parts for a calendar-style date tile. */
export function dateTile(value) {
  const d = parseISODate(value);
  return { day: d.getDate(), month: MONTHS_SHORT[d.getMonth()], year: d.getFullYear() };
}

/** "16 Feb 2026" — the standard notice/long date. */
export function formatLongDate(value) {
  const d = parseISODate(value);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Monday, 16 February 2026" — used for a selected calendar day header. */
export function formatFullDate(value) {
  const d = parseISODate(value);
  return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Human date or range for an event:
 *   single day        → "6 Apr 2026"
 *   same month range  → "16–21 Feb 2026"
 *   same year range   → "6 Apr – 2 May 2026"
 *   cross-year range  → "28 Dec 2025 – 2 Jan 2026"
 * @param {string} startIso
 * @param {string} [endIso]
 */
export function formatDateRange(startIso, endIso) {
  const start = parseISODate(startIso);
  if (!endIso || endIso === startIso) return formatLongDate(startIso);

  const end = parseISODate(endIso);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${MONTHS_SHORT[end.getMonth()]} ${end.getFullYear()}`;
  }
  if (sameYear) {
    return `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${formatLongDate(startIso)} – ${formatLongDate(endIso)}`;
}

/** Convert a "HH:mm" 24-hour string to "10:00 AM". Returns '' for empties. */
export function formatTime(hhmm) {
  if (!hhmm) return '';
  const [h, m] = String(hhmm).split(':').map(Number);
  if (Number.isNaN(h)) return '';
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m || 0).padStart(2, '0')} ${period}`;
}

/** "10:00 AM – 1:00 PM", "10:00 AM" or '' from an optional start/end time. */
export function formatTimeRange(startTime, endTime) {
  const start = formatTime(startTime);
  const end = formatTime(endTime);
  if (start && end) return `${start} – ${end}`;
  return start || '';
}

/**
 * Whether a notice should show a "New" badge: pinned, or published within the
 * last `withinDays` days (and not in the future).
 * @param {string} dateIso
 * @param {boolean} [pinned=false]
 * @param {number} [withinDays=30]
 */
export function isNew(dateIso, pinned = false, withinDays = 30) {
  if (pinned) return true;
  const days = (startOfToday() - parseISODate(dateIso)) / 86400000;
  return days >= 0 && days <= withinDays;
}

/** Inclusive test: does `day` fall within an event's start…end span? */
export function dayInEvent(day, event) {
  const start = parseISODate(event.start_date);
  const end = parseISODate(event.end_date || event.start_date);
  return day >= start && day <= end;
}

/** True once an event has fully ended (its end/start day is before today). */
export function isPastEvent(event, today = startOfToday()) {
  return parseISODate(event.end_date || event.start_date) < today;
}
