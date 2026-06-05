/* ============================================
   useEvents — events data source (seed for now)
   Icon Commerce College
   --------------------------------------------
   Returns the published events sorted by start date (soonest first). It
   currently reads the bundled `seedEvents`; prompt 32 swaps the internals to
   the live `events.php` store WITHOUT changing the return shape, so consumers
   stay untouched.

   The result exposes the list under BOTH `items` (the generic shape the Events
   page consumes, per prompt 24) and `events` (kept for the existing Home
   NoticeBoard band) — they reference the same array.
   ============================================ */

import { useMemo } from 'react';
import { seedEvents } from '../data/seedEvents';

/**
 * @returns {{ items: import('../data/seedEvents').CollegeEvent[], events: import('../data/seedEvents').CollegeEvent[], loading: boolean, error: (Error|null) }}
 */
export default function useEvents() {
  const items = useMemo(
    () =>
      seedEvents
        .filter((e) => e.published)
        .slice()
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date)),
    []
  );

  return { items, events: items, loading: false, error: null };
}

export { useEvents };
