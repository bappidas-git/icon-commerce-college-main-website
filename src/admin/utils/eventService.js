/* ============================================
   Event Service Utility
   The shared server-side store (public/api/events.php)
   is the SINGLE SOURCE OF TRUTH for events. This module
   mirrors noticeService.js / leadService.js: an in-memory
   cache hydrated from the server and refreshed on a 15s
   poll, so every admin browser/device shows the same events.

   There is NO localStorage copy of events. All reads come
   from the server-backed cache and all writes are mirrored to
   the server immediately (optimistic update + server mirror +
   notify), then reconciled by the next poll.
   ============================================ */

// Events reuse the SAME shared secret as leads/notices (REACT_APP_LEADS_ADMIN_KEY) —
// events.php resolves its admin key the same way, so the endpoints always agree.
// This value is compiled into the public bundle; it is not a real secret, just the
// handshake that gates create/update/delete and reveals drafts to the admin on the
// list endpoint.
const EVENTS_ADMIN_KEY = process.env.REACT_APP_LEADS_ADMIN_KEY || "";

// ----- Event categories (design-system §8 / events.php) -----
// Single source of truth shared by the admin table chip colours, the category
// filter and the form's category select — mirrors how leadStatus.js / the notice
// categories centralise their values. Icons match EventCard's CATEGORY_ICONS so
// the public card and the admin chip read the same.
export const EVENT_CATEGORIES = [
  { value: "Academic", label: "Academic", color: "#1A2A52", bg: "#E7ECF7", icon: "mdi:book-open-page-variant-outline" },
  { value: "Cultural", label: "Cultural", color: "#B83280", bg: "#FCE7F3", icon: "mdi:drama-masks" },
  { value: "Sports", label: "Sports", color: "#1E8E5A", bg: "#E7F6EF", icon: "mdi:trophy-outline" },
  { value: "Examination", label: "Examination", color: "#7C3AED", bg: "#F1ECFE", icon: "mdi:file-document-edit-outline" },
  { value: "Holiday", label: "Holiday", color: "#A8823A", bg: "#F3E9D2", icon: "mdi:palm-tree" },
  { value: "Workshop", label: "Workshop", color: "#2563EB", bg: "#E7ECFB", icon: "mdi:hammer-wrench" },
  { value: "General", label: "General", color: "#5B6678", bg: "#F1F5F9", icon: "mdi:calendar-star" },
];

export const CATEGORY_VALUES = EVENT_CATEGORIES.map((c) => c.value);

const CATEGORY_BY_VALUE = EVENT_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c;
  return acc;
}, {});

// "General" is the canonical fallback (matches events.php normalisation).
export const getCategoryConfig = (value) => CATEGORY_BY_VALUE[value] || CATEGORY_BY_VALUE.General;

// In-memory cache of all events, hydrated by syncEventsFromServer(). Reads filter
// this cache; writes update it optimistically AND mirror to the server.
let _cache = [];

// BroadcastChannel notifies every admin tab/window in the SAME browser that an
// event changed (cross-device sync is handled by the server poll).
const EVENTS_CHANNEL = "lp_events_channel";

let eventsChannel = null;
const getEventsChannel = () => {
  if (eventsChannel) return eventsChannel;
  if (typeof BroadcastChannel === "undefined") return null;
  try {
    eventsChannel = new BroadcastChannel(EVENTS_CHANNEL);
  } catch (err) {
    eventsChannel = null;
  }
  return eventsChannel;
};

/**
 * Notify every admin view (this tab and other tabs/windows of the same browser)
 * that the event store changed, so they reload without waiting for the poll.
 */
const notifyEventsChanged = () => {
  const channel = getEventsChannel();
  if (channel) {
    try {
      channel.postMessage({ type: "events-changed", at: Date.now() });
    } catch (err) {
      /* ignore — fall back to the DOM event below */
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lp:events-changed"));
  }
};

/**
 * Subscribe an admin page to event-store changes: a mutation in this tab
 * (`lp:events-changed`) or a BroadcastChannel message from another window of the
 * same browser. Returns an unsubscribe function.
 */
export const onEventsChanged = (handler) => {
  if (typeof window === "undefined") return () => {};

  const channel = getEventsChannel();
  const onMessage = (e) => {
    if (e?.data?.type === "events-changed") handler();
  };

  if (channel) channel.addEventListener("message", onMessage);
  window.addEventListener("lp:events-changed", handler);

  return () => {
    if (channel) channel.removeEventListener("message", onMessage);
    window.removeEventListener("lp:events-changed", handler);
  };
};

/**
 * Build the URL for the events API (env REACT_APP_EVENTS_API_URL, same-origin
 * /api/events.php by default).
 */
export const getEventsApiUrl = () => process.env.REACT_APP_EVENTS_API_URL || "/api/events.php";

/**
 * Fire-and-forget admin call to the events API (create/update/delete). Writes are
 * gated by the admin key; without it the call is a no-op (the server would reject
 * it anyway), so the optimistic cache update is purely local until a key is
 * configured.
 */
const callEventsApi = (action, body) => {
  const url = getEventsApiUrl();
  if (!url || !EVENTS_ADMIN_KEY) return Promise.resolve();
  return fetch(`${url}?action=${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": EVENTS_ADMIN_KEY,
    },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch((err) => console.error(`[EventsAPI] ${action} failed:`, err));
};

// RFC 4122-ish id, with a fallback for the rare environment without crypto.
const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * Normalise an event so the admin UI always has the structural fields it expects
 * — and so an optimistic record matches what events.php stores. Mirrors the
 * server's normalisation: unknown category → "General", booleans coerced,
 * id/created_at stamped when missing, optional strings trimmed. `isNew` refreshes
 * updated_at for a brand new record; otherwise the server-supplied updated_at is
 * preserved.
 */
const normalizeEvent = (event = {}, isNew = false) => {
  const now = new Date().toISOString();
  const category = CATEGORY_VALUES.includes(event.category) ? event.category : "General";
  const trim = (v) => (v == null ? "" : String(v).trim());
  return {
    ...event,
    id: event.id || newId(),
    title: typeof event.title === "string" ? event.title.trim() : "",
    description: event.description == null ? "" : String(event.description),
    category,
    start_date: trim(event.start_date),
    end_date: trim(event.end_date),
    start_time: trim(event.start_time),
    end_time: trim(event.end_time),
    venue: trim(event.venue),
    image_url: trim(event.image_url),
    published: event.published === undefined ? true : Boolean(event.published),
    created_at: event.created_at || now,
    updated_at: isNew ? now : event.updated_at || now,
  };
};

/**
 * Pull every event from the server-side store (the source of truth) and replace
 * the in-memory cache. The admin key is sent so the list includes drafts
 * (published=false) the panel needs to manage. Returns counts of what changed
 * versus the previous cache so callers refresh their UI only on real change.
 *
 * Returns { synced, added, updated, removed, error? }.
 */
export const syncEventsFromServer = async () => {
  const url = getEventsApiUrl();
  if (!url) {
    return { synced: 0, added: 0, updated: 0, removed: 0, error: "EVENTS_API_URL not configured" };
  }

  try {
    const headers = {};
    // Sending the key reveals drafts; without it the admin sees published only.
    if (EVENTS_ADMIN_KEY) headers["X-Admin-Key"] = EVENTS_ADMIN_KEY;

    const response = await fetch(`${url}?action=list`, { method: "GET", headers });
    if (!response.ok) {
      return { synced: 0, added: 0, updated: 0, removed: 0, error: `Server returned ${response.status}` };
    }
    const data = await response.json();
    const serverEvents = Array.isArray(data.events) ? data.events : [];
    const normalized = serverEvents.map((e) => normalizeEvent(e, false));

    // Diff against the previous cache so the UI only refreshes on real change.
    const prevById = new Map(_cache.map((e) => [e.id, e]));
    const serverIds = new Set();
    let added = 0;
    let updated = 0;
    normalized.forEach((event) => {
      serverIds.add(event.id);
      const prev = prevById.get(event.id);
      if (!prev) {
        added++;
      } else if (JSON.stringify(prev) !== JSON.stringify(event)) {
        updated++;
      }
    });
    const removed = _cache.filter((e) => !serverIds.has(e.id)).length;

    _cache = normalized;
    return { synced: normalized.length, added, updated, removed };
  } catch (err) {
    console.error("[EventsAPI] sync failed:", err);
    return { synced: 0, added: 0, updated: 0, removed: 0, error: err.message || "Network error" };
  }
};

/**
 * Get all events with optional filters (read from the server-backed cache).
 * Sorted by start_date ascending (soonest first), breaking same-day ties on
 * start_time then title — matching events.php and the public useEvents() hook.
 * @param {Object} filters - { search, category, published, timeframe }
 *   timeframe: 'upcoming' (not yet ended) | 'past' (already ended) | 'all'
 * @returns {Array} Filtered, sorted events
 */
export const getEvents = (filters = {}) => {
  let events = [..._cache];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    events = events.filter(
      (e) =>
        (e.title || "").toLowerCase().includes(q) ||
        (e.description || "").toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q) ||
        (e.venue || "").toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== "all") {
    events = events.filter((e) => e.category === filters.category);
  }

  if (filters.published === true || filters.published === false) {
    events = events.filter((e) => Boolean(e.published) === filters.published);
  }

  if (filters.timeframe === "upcoming" || filters.timeframe === "past") {
    const start = new Date();
    const today = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    events = events.filter((e) => {
      const endIso = e.end_date || e.start_date;
      const [y, m, d] = String(endIso).split("T")[0].split("-").map(Number);
      const end = y ? new Date(y, (m || 1) - 1, d || 1).getTime() : 0;
      const isPast = end < today;
      return filters.timeframe === "past" ? isPast : !isPast;
    });
  }

  events.sort((a, b) => {
    const ad = new Date(a.start_date || 0) - new Date(b.start_date || 0);
    if (ad !== 0) return ad;
    if ((a.start_time || "") !== (b.start_time || "")) return (a.start_time || "").localeCompare(b.start_time || "");
    return (a.title || "").localeCompare(b.title || "");
  });

  return events;
};

/**
 * Get a single event by id.
 */
export const getEventById = (id) => _cache.find((e) => e.id === id) || null;

/**
 * Create an event: optimistic add to the cache (with a client-generated id so
 * the create is idempotent on the server) + notify + mirror to the server.
 * Returns the created event.
 */
export const createEvent = (data = {}) => {
  const event = normalizeEvent({ ...data }, true);
  _cache = [event, ..._cache];
  notifyEventsChanged();
  callEventsApi("create", { event });
  return event;
};

/**
 * Update an event by id with a partial patch (e.g. an edit, or a single
 * { published } toggle): optimistic merge + notify + mirror. Returns the updated
 * event, or null if not found.
 */
export const updateEvent = (id, patch = {}) => {
  const now = new Date().toISOString();
  let updated = null;
  _cache = _cache.map((e) => {
    if (e.id !== id) return e;
    // id and created_at are immutable; re-normalise structural fields, then
    // stamp updated_at as the local last-write-wins marker.
    updated = normalizeEvent({ ...e, ...patch, id: e.id, created_at: e.created_at }, false);
    updated.updated_at = now;
    return updated;
  });
  if (!updated) return null;

  notifyEventsChanged();
  callEventsApi("update", { id, patch: { ...patch, updated_at: now } });
  return updated;
};

/**
 * Delete a single event by id: optimistic removal + notify + mirror.
 */
export const deleteEvent = (id) => {
  _cache = _cache.filter((e) => e.id !== id);
  notifyEventsChanged();
  callEventsApi("delete", { ids: [id] });
  return true;
};

/**
 * Bulk delete events by id.
 */
export const deleteEvents = (ids = []) => {
  const idSet = new Set(ids);
  _cache = _cache.filter((e) => !idSet.has(e.id));
  notifyEventsChanged();
  if (ids.length > 0) {
    callEventsApi("delete", { ids });
  }
  return true;
};

/**
 * Export events to a self-describing JSON file and trigger a client-side
 * download (used by the admin Settings → Data export). Mirrors exportLeadsCSV
 * in leadService: the service owns its export and the download itself. The
 * record shape matches what events.php stores, so the file doubles as a
 * portable backup. Defaults to the full server-backed cache.
 */
export const exportEventsJSON = (events) => {
  const rows = Array.isArray(events) ? events : getEvents();
  const payload = {
    type: "events",
    exported_at: new Date().toISOString(),
    count: rows.length,
    events: rows,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().split("T")[0];
  link.href = url;
  link.download = `events_export_${date}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
