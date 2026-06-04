# Prompt 33 — Admin Settings & Help

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§8).
**Depends on:** 25–32.
**Goal:** A simple Settings/Help page replacing the deleted CIT guideline content, plus
small admin conveniences.

## Tasks — `src/admin/pages/Settings.jsx` (`/admin/settings`)

1. **Account** — show logged-in username; "Change password" note (env-based, explain it's set
   via `.env`); logout; session info (expiry).
2. **Data export** — buttons to export Leads CSV, Notices JSON, Events JSON (client-side download).
3. **Connection status** — show whether `LEADS/NOTICES/EVENTS_API_URL` are reachable
   (ping each `?action=list`) with green/red indicators; surface the admin-key handshake status.
4. **Help / Guide** — concise in-app docs:
   - How leads are captured and where they're stored (PHP/JSON, single source of truth).
   - How to post a Notice and an Event and where they appear on the site.
   - Placeholder-image note (how the client swaps `/images/placeholders/*`).
   - Deployment basics (PHP host, `data/` writable, env vars). Keep it short; full docs live
     in `/docs` (prompt 39).
5. (Optional) **Branding quick-edit** — read-only display of `collegeInfo` with a note that
   content is edited in `src/data/*` (no DB).

## Acceptance criteria
- Settings renders; exports download; connection pings reflect real API status; help is accurate.
- `npm run build` passes; no references to removed CIT guides.

## PR
Draft PR "Phase 3.9 — Admin settings & help". Update `CHANGELOG.md`.
