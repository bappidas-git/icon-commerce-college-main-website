# Prompt 24 — Contact, Notices & Events Pages (static shells, dynamic-ready)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 contact, events, notices).
**Depends on:** 01–10. (Notices/Events read seed data now; wired to live APIs in prompt 32.)
**Goal:** Build the `/contact`, `/notices`, and `/events` public pages. Data comes from
seed files for now via `useNotices()`/`useEvents()` hooks.

## Tasks

### A. Contact — `src/pages/Contact/Contact.jsx`
1. PageHero "Contact Us", breadcrumb.
2. Two-column: left = `UnifiedLeadForm` (source `contact`, full fields incl. message);
   right = contact details from `collegeInfo`: address, both phones (click-to-call),
   email (mailto), office hours, Samarth pill, social icons.
3. Embedded Google Map (iframe by `mapsQuery`) full-width below; "Open in Google Maps" link.
4. "How to reach us" note (Rajgarh Road, Chandmari, Guwahati). SEO + LocalBusiness schema.

### B. Notices — `src/pages/Notices/Notices.jsx`
1. PageHero "Notices & Announcements".
2. List of `NoticeCard`s from `useNotices()` (seed for now): date chip, title, category
   badge, body excerpt, optional attachment link, "New" badge for recent. Search + category
   filter + pagination/"load more". `EmptyState` when none.
3. Notice detail: either expand inline (Accordion/Modal) or `/notices/:id` route — keep simple
   (inline expand acceptable). Pinned/important notices sort first.

### C. Events — `src/pages/Events/Events.jsx`
1. PageHero "Events".
2. Toggle: **List view** (upcoming + past, `EventCard`: date block, title, time, venue,
   description, category) and **Calendar view** (month grid highlighting event days; click a
   day → that day's events). Use a lightweight calendar (build a small month-grid component;
   no heavy deps). Seed includes College Week, Cooking Competition, ICON Shield, ICON Trophy.
3. Upcoming vs Past split; filters by category; `EmptyState` when none.

### D. Shared hooks — `src/hooks/useNotices.js`, `src/hooks/useEvents.js`
- For now return seed data (`seedNotices.js`/`seedEvents.js`) with the same record shape the
  API will use (so prompt 32 only swaps the data source). Expose `{ items, loading, error }`.

## Acceptance criteria
- All three pages render from seed data, responsive; calendar + list toggle works; filters/search work.
- Record shapes match the planned API (id, title, body/description, date(s), category, etc.).
- `npm run build` passes.

## PR
Draft PR "Phase 2.14 — Contact, Notices & Events (public)". Update `CHANGELOG.md`.
