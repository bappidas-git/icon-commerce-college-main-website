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
     • Falls back to the bundled seedNotices ONLY when the request FAILS before a
       first success (e.g. no PHP backend in dev) — so the UI is never blank in
       dev. A request that SUCCEEDS with an empty store returns [] so the page
       renders its proper "No notices yet" empty state: that is what an admin who
       has deleted every notice expects, NOT resurrected seed content (the old
       behaviour, which made the public site look like the deletions never took).

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

// Last known server list for this SPA session — `null` until the first
// SUCCESSFUL fetch, then the server's list (which MAY be an empty array once the
// admin clears the store). Shared across every useNotices() instance. Seed is
// only ever shown while this is still `null` (no successful fetch yet).
let cachedNotices = null;

/**
 * @returns {{ items: Object[], notices: Object[], loading: boolean, error: (Error|null) }}
 */
export default function useNotices() {
  // `??` (not `||`) so a cached EMPTY array (store legitimately cleared) renders
  // the empty state rather than falling through to seed.
  const [items, setItems] = useState(() => cachedNotices ?? SEED);
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
      // Cache the TRUTH from the server — even an empty array. An emptied store
      // therefore shows the proper "No notices yet" empty state (not seed), and
      // a later transient failure falls back to this known-empty list rather
      // than resurrecting seed content.
      cachedNotices = list;
      setItems(list);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError' || !aliveRef.current) return;
      // Silent, expected degradation (e.g. no PHP backend in dev): prefer the
      // last known server list (may be []), else seed — so dev is never blank
      // but a real empty store is still honoured once we've seen the server.
      setItems(cachedNotices ?? SEED);
      setError(err);
    } finally {
      if (aliveRef.current && !controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    if (cachedNotices !== null) setItems(cachedNotices); // instant paint (may be []), then revalidate
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
