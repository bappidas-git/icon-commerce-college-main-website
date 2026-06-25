/* ============================================
   Admin API client — shared write helper + error channel
   --------------------------------------------
   The lead / notice / event services all POST writes (create / update /
   delete) to their PHP endpoint with the shared admin key. They used to do this
   "fire-and-forget" — `fetch(...).catch(console.error)` — which meant a write
   that the server REJECTED (wrong admin key → 401), FAILED (data dir not
   writable → 500) or never reached PHP at all (a static host / missing
   .htaccess returns the SPA's index.html with a 200) looked exactly like a
   success: the optimistic cache update stayed on screen until the next 15s poll
   quietly reverted it. The admin had no idea their change never persisted.

   postToAdminApi() closes that gap: it inspects the response and only reports
   success when the endpoint returns our JSON contract (`{ success: true }`).
   Anything else resolves with `{ ok: false, error }` — it never throws, so the
   optimistic callers stay simple — and the services raise emitAdminApiError()
   so a global toast (mounted in AdminLayout) tells the admin the write failed
   and why.
   ============================================ */

// Window CustomEvent name for surfacing a failed admin write to the UI shell.
const ADMIN_API_ERROR_EVENT = "lp:admin-api-error";

/**
 * Broadcast a failed-write message so the admin shell can show it (toast).
 */
export const emitAdminApiError = (message) => {
  if (typeof window === "undefined" || !message) return;
  window.dispatchEvent(
    new CustomEvent(ADMIN_API_ERROR_EVENT, { detail: { message } })
  );
};

/**
 * Subscribe to failed-write messages. Returns an unsubscribe function.
 */
export const onAdminApiError = (handler) => {
  if (typeof window === "undefined") return () => {};
  const listener = (e) => handler(e.detail?.message || "Something went wrong.");
  window.addEventListener(ADMIN_API_ERROR_EVENT, listener);
  return () => window.removeEventListener(ADMIN_API_ERROR_EVENT, listener);
};

/**
 * Turn a fetch Response (already read as text) into a human, actionable reason
 * why a write didn't take. Kept separate so the same wording is reused for the
 * console log and the on-screen toast.
 */
const describeFailure = (status, data, rawBody) => {
  if (data && (data.error || data.reason)) {
    // Our API ran and explicitly refused/failed the write.
    return `${data.error || ""}${data.reason ? ` — ${data.reason}` : ""}`.trim();
  }
  if (status === 401) {
    return "Unauthorized (401) — the admin key in this build doesn't match the server's ADMIN_API_KEY.";
  }
  if (status === 0) {
    return "Network error — the server couldn't be reached.";
  }
  if (status >= 200 && status < 300) {
    // 2xx but NOT our JSON — the endpoint isn't executing as a PHP API.
    const snippet = (rawBody || "").slice(0, 120).replace(/\s+/g, " ").trim();
    return `The API returned a non-JSON response — the server may not be running PHP (check /api/*.php?action=health).${
      snippet ? ` Body: ${snippet}` : ""
    }`;
  }
  return `Server returned ${status}.`;
};

/**
 * POST JSON to an admin endpoint and VERIFY the server accepted the write.
 *
 * Resolves to { ok, status, data, error } and never rejects, so optimistic
 * callers can stay fire-and-forget while still being able to react to (or
 * surface) a failure.
 *
 * @param {string} url      Endpoint base URL (e.g. /api/notices.php).
 * @param {string} adminKey Shared admin key sent as X-Admin-Key.
 * @param {string} action   create | update | delete.
 * @param {Object} body     JSON request body.
 * @param {string} label    Short label for diagnostics (e.g. "NoticesAPI").
 */
export const postToAdminApi = async (url, adminKey, action, body, label = "AdminAPI") => {
  try {
    const response = await fetch(`${url}?action=${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Admin-Key": adminKey,
      },
      body: JSON.stringify(body),
      keepalive: true,
      cache: "no-store",
    });

    // Read as text first so a 200 that is actually HTML (the SPA shell) can be
    // told apart from a genuine JSON API response instead of being trusted.
    const rawBody = await response.text();
    let data = null;
    try {
      data = rawBody ? JSON.parse(rawBody) : null;
    } catch (parseErr) {
      data = null;
    }

    if (response.ok && data && data.success === true) {
      return { ok: true, status: response.status, data };
    }

    const error = describeFailure(response.status, data, rawBody);
    console.error(`[${label}] ${action} failed: ${error} (${url})`);
    return { ok: false, status: response.status, data, error };
  } catch (err) {
    const error = describeFailure(0, null, "");
    console.error(`[${label}] ${action} network error:`, err);
    return { ok: false, status: 0, error };
  }
};
