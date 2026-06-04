/* ============================================
   useEvents — events data source (seed for now)
   Icon Commerce College
   --------------------------------------------
   Returns the published events sorted by start date (soonest first). It
   currently reads the bundled `seedEvents`; prompt 32 swaps the internals to
   the live `events.php` store WITHOUT changing the `{ events, loading, error }`
   return shape, so consumers (NoticeBoard, the Events page) stay untouched.
   ============================================ */

import { useMemo } from 'react';
import { seedEvents } from '../data/seedEvents';

/**
 * @returns {{ events: import('../data/seedEvents').CollegeEvent[], loading: boolean, error: (Error|null) }}
 */
export default function useEvents() {
  const events = useMemo(
    () =>
      seedEvents
        .filter((e) => e.published)
        .slice()
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date)),
    []
  );

  return { events, loading: false, error: null };
}

export { useEvents };
