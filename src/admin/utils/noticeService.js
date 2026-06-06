/* ============================================
   Notice Service Utility
   The shared server-side store (public/api/notices.php)
   is the SINGLE SOURCE OF TRUTH for notices. This module
   mirrors leadService.js: an in-memory cache hydrated from
   the server and refreshed on a 15s poll, so every admin
   browser/device shows the same notices.

   There is NO localStorage copy of notices. All reads come
   from the server-backed cache and all writes are mirrored to
   the server immediately (optimistic update + server mirror +
   notify), then reconciled by the next poll.
   ============================================ */

// Notices reuse the SAME shared secret as leads (REACT_APP_LEADS_ADMIN_KEY) —
// notices.php resolves its admin key the same way, so the two endpoints always
// agree. This value is compiled into the public bundle; it is not a real secret,
// just the handshake that gates create/update/delete and reveals drafts to the
// admin on the list endpoint.
const NOTICES_ADMIN_KEY = process.env.REACT_APP_LEADS_ADMIN_KEY || "";

// ----- Notice categories (design-system §8 / notices.php) -----
// Single source of truth shared by the admin table chip colours, the category
// filter and the form's category select — mirrors how leadStatus.js centralises
// the lead statuses.
export const NOTICE_CATEGORIES = [
  { value: "Admission", label: "Admission", color: "#1A2A52", bg: "#E7ECF7", icon: "mdi:school-outline" },
  { value: "Examination", label: "Examination", color: "#7C3AED", bg: "#F1ECFE", icon: "mdi:file-document-edit-outline" },
  { value: "Event", label: "Event", color: "#0E7490", bg: "#E0F7FA", icon: "mdi:calendar-star" },
  { value: "General", label: "General", color: "#5B6678", bg: "#F1F5F9", icon: "mdi:bullhorn-outline" },
  { value: "Result", label: "Result", color: "#1E8E5A", bg: "#E7F6EF", icon: "mdi:trophy-outline" },
  { value: "Holiday", label: "Holiday", color: "#A8823A", bg: "#F3E9D2", icon: "mdi:palm-tree" },
];

export const CATEGORY_VALUES = NOTICE_CATEGORIES.map((c) => c.value);

const CATEGORY_BY_VALUE = NOTICE_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c;
  return acc;
}, {});

// "General" is the canonical fallback (matches notices.php normalisation).
export const getCategoryConfig = (value) => CATEGORY_BY_VALUE[value] || CATEGORY_BY_VALUE.General;

// In-memory cache of all notices, hydrated by syncNoticesFromServer(). Reads
// filter this cache; writes update it optimistically AND mirror to the server.
let _cache = [];

// BroadcastChannel notifies every admin tab/window in the SAME browser that a
// notice changed (cross-device sync is handled by the server poll).
const NOTICES_CHANNEL = "lp_notices_channel";

let noticesChannel = null;
const getNoticesChannel = () => {
  if (noticesChannel) return noticesChannel;
  if (typeof BroadcastChannel === "undefined") return null;
  try {
    noticesChannel = new BroadcastChannel(NOTICES_CHANNEL);
  } catch (err) {
    noticesChannel = null;
  }
  return noticesChannel;
};

/**
 * Notify every admin view (this tab and other tabs/windows of the same browser)
 * that the notice store changed, so they reload without waiting for the poll.
 */
const notifyNoticesChanged = () => {
  const channel = getNoticesChannel();
  if (channel) {
    try {
      channel.postMessage({ type: "notices-changed", at: Date.now() });
    } catch (err) {
      /* ignore — fall back to the DOM event below */
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lp:notices-changed"));
  }
};

/**
 * Subscribe an admin page to notice-store changes: a mutation in this tab
 * (`lp:notices-changed`) or a BroadcastChannel message from another window of
 * the same browser. Returns an unsubscribe function.
 */
export const onNoticesChanged = (handler) => {
  if (typeof window === "undefined") return () => {};

  const channel = getNoticesChannel();
  const onMessage = (e) => {
    if (e?.data?.type === "notices-changed") handler();
  };

  if (channel) channel.addEventListener("message", onMessage);
  window.addEventListener("lp:notices-changed", handler);

  return () => {
    if (channel) channel.removeEventListener("message", onMessage);
    window.removeEventListener("lp:notices-changed", handler);
  };
};

/**
 * Build the URL for the notices API (env REACT_APP_NOTICES_API_URL, same-origin
 * /api/notices.php by default).
 */
export const getNoticesApiUrl = () => process.env.REACT_APP_NOTICES_API_URL || "/api/notices.php";

/**
 * Fire-and-forget admin call to the notices API (create/update/delete). Writes
 * are gated by the admin key; without it the call is a no-op (the server would
 * reject it anyway), so the optimistic cache update is purely local until a key
 * is configured.
 */
const callNoticesApi = (action, body) => {
  const url = getNoticesApiUrl();
  if (!url || !NOTICES_ADMIN_KEY) return Promise.resolve();
  return fetch(`${url}?action=${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": NOTICES_ADMIN_KEY,
    },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch((err) => console.error(`[NoticesAPI] ${action} failed:`, err));
};

// RFC 4122-ish id, with a fallback for the rare environment without crypto.
const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `notice-${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * Normalise a notice so the admin UI always has the structural fields it expects
 * — and so an optimistic record matches what notices.php stores. Mirrors the
 * server's normalisation: unknown category → "General", booleans coerced,
 * id/created_at stamped when missing. `isNew` refreshes updated_at for a brand
 * new record; otherwise the server-supplied updated_at is preserved.
 */
const normalizeNotice = (notice = {}, isNew = false) => {
  const now = new Date().toISOString();
  const category = CATEGORY_VALUES.includes(notice.category) ? notice.category : "General";
  return {
    ...notice,
    id: notice.id || newId(),
    title: typeof notice.title === "string" ? notice.title.trim() : "",
    body: notice.body == null ? "" : String(notice.body),
    category,
    date: notice.date || "",
    attachment_url: notice.attachment_url || "",
    pinned: Boolean(notice.pinned),
    published: notice.published === undefined ? true : Boolean(notice.published),
    created_at: notice.created_at || now,
    updated_at: isNew ? now : notice.updated_at || now,
  };
};

/**
 * Pull every notice from the server-side store (the source of truth) and replace
 * the in-memory cache. The admin key is sent so the list includes drafts
 * (published=false) the panel needs to manage. Returns counts of what changed
 * versus the previous cache so callers refresh their UI only on real change.
 *
 * Returns { synced, added, updated, removed, error? }.
 */
export const syncNoticesFromServer = async () => {
  const url = getNoticesApiUrl();
  if (!url) {
    return { synced: 0, added: 0, updated: 0, removed: 0, error: "NOTICES_API_URL not configured" };
  }

  try {
    const headers = {};
    // Sending the key reveals drafts; without it the admin sees published only.
    if (NOTICES_ADMIN_KEY) headers["X-Admin-Key"] = NOTICES_ADMIN_KEY;

    const response = await fetch(`${url}?action=list`, { method: "GET", headers });
    if (!response.ok) {
      return { synced: 0, added: 0, updated: 0, removed: 0, error: `Server returned ${response.status}` };
    }
    const data = await response.json();
    const serverNotices = Array.isArray(data.notices) ? data.notices : [];
    const normalized = serverNotices.map((n) => normalizeNotice(n, false));

    // Diff against the previous cache so the UI only refreshes on real change.
    const prevById = new Map(_cache.map((n) => [n.id, n]));
    const serverIds = new Set();
    let added = 0;
    let updated = 0;
    normalized.forEach((notice) => {
      serverIds.add(notice.id);
      const prev = prevById.get(notice.id);
      if (!prev) {
        added++;
      } else if (JSON.stringify(prev) !== JSON.stringify(notice)) {
        updated++;
      }
    });
    const removed = _cache.filter((n) => !serverIds.has(n.id)).length;

    _cache = normalized;
    return { synced: normalized.length, added, updated, removed };
  } catch (err) {
    console.error("[NoticesAPI] sync failed:", err);
    return { synced: 0, added: 0, updated: 0, removed: 0, error: err.message || "Network error" };
  }
};

/**
 * Get all notices with optional filters (read from the server-backed cache).
 * Sorted pinned-first then most-recent display date — matching notices.php and
 * the public useNotices() hook.
 * @param {Object} filters - { search, category, published }
 * @returns {Array} Filtered, sorted notices
 */
export const getNotices = (filters = {}) => {
  let notices = [..._cache];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    notices = notices.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.body || "").toLowerCase().includes(q) ||
        (n.category || "").toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== "all") {
    notices = notices.filter((n) => n.category === filters.category);
  }

  if (filters.published === true || filters.published === false) {
    notices = notices.filter((n) => Boolean(n.published) === filters.published);
  }

  notices.sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  return notices;
};

/**
 * Get a single notice by id.
 */
export const getNoticeById = (id) => _cache.find((n) => n.id === id) || null;

/**
 * Create a notice: optimistic add to the cache (with a client-generated id so
 * the create is idempotent on the server) + notify + mirror to the server.
 * Returns the created notice.
 */
export const createNotice = (data = {}) => {
  const notice = normalizeNotice({ ...data }, true);
  _cache = [notice, ..._cache];
  notifyNoticesChanged();
  callNoticesApi("create", { notice });
  return notice;
};

/**
 * Update a notice by id with a partial patch (e.g. an edit, or a single
 * { published } / { pinned } toggle): optimistic merge + notify + mirror.
 * Returns the updated notice, or null if not found.
 */
export const updateNotice = (id, patch = {}) => {
  const now = new Date().toISOString();
  let updated = null;
  _cache = _cache.map((n) => {
    if (n.id !== id) return n;
    // id and created_at are immutable; re-normalise structural fields, then
    // stamp updated_at as the local last-write-wins marker.
    updated = normalizeNotice({ ...n, ...patch, id: n.id, created_at: n.created_at }, false);
    updated.updated_at = now;
    return updated;
  });
  if (!updated) return null;

  notifyNoticesChanged();
  callNoticesApi("update", { id, patch: { ...patch, updated_at: now } });
  return updated;
};

/**
 * Delete a single notice by id: optimistic removal + notify + mirror.
 */
export const deleteNotice = (id) => {
  _cache = _cache.filter((n) => n.id !== id);
  notifyNoticesChanged();
  callNoticesApi("delete", { ids: [id] });
  return true;
};

/**
 * Bulk delete notices by id.
 */
export const deleteNotices = (ids = []) => {
  const idSet = new Set(ids);
  _cache = _cache.filter((n) => !idSet.has(n.id));
  notifyNoticesChanged();
  if (ids.length > 0) {
    callNoticesApi("delete", { ids });
  }
  return true;
};

/**
 * Export notices to a self-describing JSON file and trigger a client-side
 * download (used by the admin Settings → Data export). Mirrors exportLeadsCSV
 * in leadService: the service owns its export and the download itself. The
 * record shape matches what notices.php stores, so the file doubles as a
 * portable backup. Defaults to the full server-backed cache.
 */
export const exportNoticesJSON = (notices) => {
  const rows = Array.isArray(notices) ? notices : getNotices();
  const payload = {
    type: "notices",
    exported_at: new Date().toISOString(),
    count: rows.length,
    notices: rows,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().split("T")[0];
  link.href = url;
  link.download = `notices_export_${date}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
