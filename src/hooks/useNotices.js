/* ============================================
   useNotices — live notices data source (prompt 32)
   Icon Commerce College
   --------------------------------------------
   Reads the PUBLIC notices store — GET /api/notices.php?action=list (no auth;
   the server returns published-only without an admin key) — so anything an
   admin publishes appears on the site with NO code change (the core Phase 3.8
   requirement). The published notices come back sorted for display (pinned
   first, then newest by date) in exactly the shape the old seed hook returned,
   so consumers (the Home "Notice Board" band + the /notices page) are untouched.

   Resilience / perf:
     • A module-level cache, shared across every useNotices() instance for the
       SPA session, so moving between Home and /notices paints instantly from the
       last good list and revalidates quietly — no loading flicker, and (paired
       with useEvents being a separate hook) no request waterfall on Home.
     • Revalidate-on-focus: re-reads the store when the window regains focus, so a
       notice published in the admin tab shows up on the public tab without a
       manual reload.
     • Falls back to the bundled seedNotices when the request FAILS or the store
       is EMPTY, so the UI is never blank (and dev works with no PHP backend).
       The degradation is silent — a missing endpoint in dev is expected, not an
       error to log.

   The list is exposed under BOTH `items` (the generic shape the Notices page
   consumes, per prompt 24) and `notices` (kept for the Home NoticeBoard band) —
   they reference the same array.
   ============================================ */

import { useCallback, useEffect, useRef, useState } from 'react';
import { seedNotices } from '../data/seedNotices';
import { fetchJson } from '../utils/fetchJson';

const NOTICES_API_URL = process.env.REACT_APP_NOTICES_API_URL || '/api/notices.php';

/** Published only, pinned first, then newest display date — matches notices.php. */
function sortNotices(list) {
  return list
    .filter((n) => n && n.published !== false)
    .slice()
    .sort((a, b) => {
      // Pinned notices float to the top, then most-recent first.
      if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
      return new Date(b.date || 0) - new Date(a.date || 0);
    });
}

// Pre-sorted seed fallback (computed once at module load).
const SEED = sortNotices(seedNotices);

// Last good server list for this SPA session — null until the first successful,
// non-empty fetch. Shared across every useNotices() instance.
let cachedNotices = null;

/**
 * @returns {{ items: Object[], notices: Object[], loading: boolean, error: (Error|null) }}
 */
export default function useNotices() {
  const [items, setItems] = useState(() => cachedNotices || SEED);
  const [loading, setLoading] = useState(() => cachedNotices === null);
  const [error, setError] = useState(null);

  // Mount guard + in-flight controller, so we abort on unmount and never set
  // state after teardown (also clean under React 18 StrictMode's double-mount).
  const aliveRef = useRef(true);
  const controllerRef = useRef(null);

  const load = useCallback(async () => {
    // Cancel any previous in-flight request (e.g. a focus revalidate racing the
    // initial load) before starting a new one.
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const data = await fetchJson(`${NOTICES_API_URL}?action=list`, {
        signal: controller.signal,
      });
      if (!aliveRef.current || controller.signal.aborted) return;
      const list = Array.isArray(data?.notices) ? sortNotices(data.notices) : [];
      // Cache reflects the known store contents: the list when non-empty, else
      // null — so a store emptied in the admin shows seed here (never blank),
      // and a later transient failure won't resurrect a stale list.
      cachedNotices = list.length ? list : null;
      setItems(list.length ? list : SEED);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError' || !aliveRef.current) return;
      // Silent, expected degradation (e.g. no PHP backend in dev): prefer the
      // last good list, else seed — so the page is never blank.
      setItems(cachedNotices || SEED);
      setError(err);
    } finally {
      if (aliveRef.current && !controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    if (cachedNotices) setItems(cachedNotices); // instant paint, then revalidate
    load();

    // Revalidate when the tab/window regains focus so a newly published notice
    // appears without a manual reload.
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);

    return () => {
      aliveRef.current = false;
      if (controllerRef.current) controllerRef.current.abort();
      window.removeEventListener('focus', onFocus);
    };
  }, [load]);

  // `reload` lets the page offer a manual retry after a failed fetch (the UI
  // shows the seed/last-good list meanwhile, so it's never blank).
  return { items, notices: items, loading, error, reload: load };
}

export { useNotices };
