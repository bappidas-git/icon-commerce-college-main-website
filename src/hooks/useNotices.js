/* ============================================
   useNotices — notices data source (seed for now)
   Icon Commerce College
   --------------------------------------------
   Returns the published notices sorted for display (pinned first, then
   newest by date). It currently reads the bundled `seedNotices`; prompt 32
   swaps the internals to the live `notices.php` store WITHOUT changing the
   `{ notices, loading, error }` return shape, so consumers (NoticeBoard,
   the Notices page) stay untouched.
   ============================================ */

import { useMemo } from 'react';
import { seedNotices } from '../data/seedNotices';

/**
 * @returns {{ notices: import('../data/seedNotices').Notice[], loading: boolean, error: (Error|null) }}
 */
export default function useNotices() {
  const notices = useMemo(
    () =>
      seedNotices
        .filter((n) => n.published)
        .slice()
        .sort((a, b) => {
          // Pinned notices float to the top, then most-recent first.
          if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
          return new Date(b.date) - new Date(a.date);
        }),
    []
  );

  return { notices, loading: false, error: null };
}

export { useNotices };
