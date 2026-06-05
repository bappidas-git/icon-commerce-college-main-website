/* ============================================
   useEvents — live events data source (prompt 32)
   Icon Commerce College
   --------------------------------------------
   Reads the PUBLIC events store — GET /api/events.php?action=list (no auth; the
   server returns published-only without an admin key), with an optional
   `?from=&to=` date-range — so anything an admin publishes appears on the site
   with NO code change. Events come back sorted by start_date (soonest first) in
   exactly the shape the old seed hook returned, so consumers (the Home
   "Upcoming Events" preview + the /events list & calendar) are untouched.

   Resilience / perf mirror useNotices():
     • A module-level cache shared across instances for the SPA session (default,
       un-ranged query only) → instant paint + quiet revalidate, and — because
       this is a separate hook from useNotices — Home fetches notices and events
       in parallel, with no waterfall.
     • Revalidate-on-focus.
     • Abort on unmount (AbortController).
     • Falls back to bundled seedEvents when the request FAILS or the store is
       EMPTY, silently, so the UI is never blank in dev.

   Also exposes `upcoming` / `past` split helpers (derived from the sorted list)
   for simple consumers. The list is exposed under BOTH `items` (the generic
   shape the Events page consumes) and `events` (kept for the Home preview) —
   same array.
   ============================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { seedEvents } from '../data/seedEvents';
import { fetchJson } from '../utils/fetchJson';
import { isPastEvent, parseISODate, startOfToday } from '../utils/dateUtils';

const EVENTS_API_URL = process.env.REACT_APP_EVENTS_API_URL || '/api/events.php';

/** Published only, soonest start_date first (ties on time then title) — matches events.php. */
function sortEvents(list) {
  return list
    .filter((e) => e && e.published !== false)
    .slice()
    .sort((a, b) => {
      const byDate = new Date(a.start_date || 0) - new Date(b.start_date || 0);
      if (byDate !== 0) return byDate;
      if ((a.start_time || '') !== (b.start_time || '')) {
        return (a.start_time || '').localeCompare(b.start_time || '');
      }
      return (a.title || '').localeCompare(b.title || '');
    });
}

// Pre-sorted seed fallback (computed once at module load).
const SEED = sortEvents(seedEvents);

// Last good server list for this SPA session — only the default (un-ranged)
// query is cached, since that is what every current consumer uses.
let cachedEvents = null;

/**
 * @param {{ from?: string, to?: string }} [options] Optional ISO date range
 *   forwarded to the API (`?from=&to=`); omit for the full published list.
 * @returns {{ items: Object[], events: Object[], upcoming: Object[], past: Object[], loading: boolean, error: (Error|null) }}
 */
export default function useEvents({ from = '', to = '' } = {}) {
  const ranged = Boolean(from || to);

  const [items, setItems] = useState(() => (ranged ? SEED : cachedEvents || SEED));
  const [loading, setLoading] = useState(() => ranged || cachedEvents === null);
  const [error, setError] = useState(null);

  const aliveRef = useRef(true);
  const controllerRef = useRef(null);

  const load = useCallback(async () => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const params = new URLSearchParams({ action: 'list' });
    if (from) params.set('from', from);
    if (to) params.set('to', to);

    try {
      const data = await fetchJson(`${EVENTS_API_URL}?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!aliveRef.current || controller.signal.aborted) return;
      const list = Array.isArray(data?.events) ? sortEvents(data.events) : [];
      // Cache the known store contents (default query only); an empty store
      // falls back to seed (never blank), and clearing it stops a later
      // transient failure from resurrecting a stale list.
      if (!ranged) cachedEvents = list.length ? list : null;
      setItems(list.length ? list : SEED);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError' || !aliveRef.current) return;
      // Transient failure: prefer the last good default list, else seed.
      setItems(ranged ? SEED : cachedEvents || SEED);
      setError(err);
    } finally {
      if (aliveRef.current && !controller.signal.aborted) setLoading(false);
    }
  }, [from, to, ranged]);

  useEffect(() => {
    aliveRef.current = true;
    if (!ranged && cachedEvents) setItems(cachedEvents); // instant paint
    load();

    const onFocus = () => load();
    window.addEventListener('focus', onFocus);

    return () => {
      aliveRef.current = false;
      if (controllerRef.current) controllerRef.current.abort();
      window.removeEventListener('focus', onFocus);
    };
  }, [load, ranged]);

  // Upcoming (ongoing/future, soonest first — items are pre-sorted ascending)
  // vs past (most-recent first). Stable "today" so the split doesn't churn.
  const today = useMemo(() => startOfToday(), []);
  const upcoming = useMemo(
    () => items.filter((e) => !isPastEvent(e, today)),
    [items, today]
  );
  const past = useMemo(
    () =>
      items
        .filter((e) => isPastEvent(e, today))
        .sort(
          (a, b) =>
            parseISODate(b.end_date || b.start_date) -
            parseISODate(a.end_date || a.start_date)
        ),
    [items, today]
  );

  return { items, events: items, upcoming, past, loading, error };
}

export { useEvents };
