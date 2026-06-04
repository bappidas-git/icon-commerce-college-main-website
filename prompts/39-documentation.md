# Prompt 39 — Documentation

**Read first:** `prompts/00-DESIGN-SYSTEM.md`.
**Depends on:** everything above.
**Goal:** Replace CIT docs with accurate, useful documentation for Icon Commerce College.

## Tasks

1. **README.md** — overview, tech stack, project structure, local dev (`npm install`,
   `npm start`, `npm run build`), env vars table (leads/notices/events APIs, admin creds,
   optional GTM), where content lives (`src/data/*`), placeholder-image swap process, deploy
   summary. Remove all CIT references.

2. **docs/CONTENT_GUIDE.md** — how to edit each kind of content without code: college info,
   courses & fees, departments, faculty, leadership, testimonials, facilities, gallery, plus
   how Notices/Events are managed in the admin panel (no DB; PHP/JSON store).

3. **docs/ADMIN_GUIDE.md** — login, dashboard, lead management (statuses, notes, export),
   notices module, events/calendar module, settings, cross-device sync explanation, and the
   admin-key handshake.

4. **docs/DEPLOYMENT.md** — build, upload `build/` to a PHP host, ensure `public/api/*.php`
   + writable `api/data/`, `.htaccess` SPA-rewrite + static caching, env/config (`config.php`
   admin key matching `REACT_APP_LEADS_ADMIN_KEY`), HTTPS, sitemap/robots, GTM (optional).

5. **docs/IMAGES.md** — full list of `/images/placeholders/*` names with recommended
   dimensions/aspect ratios per slot, and the replace-in-place workflow.

6. **CUSTOMIZATION/SEO guides** — refresh or remove the old CIT ones so nothing stale remains.

7. **CHANGELOG.md** — ensure each phase is recorded.

## Acceptance criteria
- Docs are accurate to the final codebase; a new dev can run, edit content, use the admin
  panel, and deploy from the docs alone. No CIT references remain. `npm run build` passes.

## PR
Draft PR "Phase 4.6 — Documentation". Update `CHANGELOG.md`.
