/* ============================================
   fetchJson — tiny JSON GET wrapper (prompt 32)
   Icon Commerce College
   --------------------------------------------
   A minimal "GET a URL and parse its JSON" helper shared by the PUBLIC
   useNotices() / useEvents() hooks. It exists so those hooks stay small and
   behave identically. It:
     • accepts an AbortSignal so callers can cancel in flight — the hooks abort
       on unmount, which prevents "setState on an unmounted component" and stray
       requests when navigating quickly between routes;
     • cache-busts by default (`_=<ts>` query param + `cache: 'no-store'`) so a
       revalidate-on-focus always re-reads the live store rather than a stale
       200-from-cache — the difference between an admin's freshly published
       notice showing up or not;
     • throws on a non-2xx response (with `err.status`) or a malformed body, so
       the hook's single catch can fall back to seed data.

   This is the read-only public reader only. Admin write paths (which carry the
   admin key) stay in leadService / noticeService / eventService.
   ============================================ */

/**
 * GET a URL and parse its JSON body.
 *
 * @param {string} url
 * @param {Object} [options]
 * @param {AbortSignal} [options.signal]      Abort the request (e.g. on unmount).
 * @param {boolean} [options.cacheBust=true]  Append a timestamp + send no-store.
 * @returns {Promise<any>} The parsed JSON body.
 * @throws {Error} On a non-2xx status (err.status set) or invalid JSON.
 */
export async function fetchJson(url, { signal, cacheBust = true } = {}) {
  const finalUrl = cacheBust
    ? `${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`
    : url;

  const response = await fetch(finalUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
    cache: cacheBust ? 'no-store' : 'default',
  });

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export default fetchJson;
