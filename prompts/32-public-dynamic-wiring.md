# Prompt 32 — Wire Public Notices & Events to Live APIs

**Read first:** prompts 24, 28–31.
**Depends on:** 24, 28, 29, 30, 31.
**Goal:** Replace the seed-data hooks on the public site with the live notices/events APIs,
so anything posted in the admin panel appears on the website (the core requirement).

## Tasks

1. **`src/hooks/useNotices.js`** — fetch `GET /api/notices.php?action=list` (public, no auth),
   return only `published` notices, sorted pinned-first then date desc. Add light client
   caching + revalidate-on-focus; fall back to `seedNotices.js` if the request fails or
   returns empty (so the UI is never blank in dev). Expose `{ items, loading, error }`.

2. **`src/hooks/useEvents.js`** — fetch `GET /api/events.php?action=list` (optionally
   `?from=&to=`), published only, sorted by `start_date`; split upcoming/past helpers; same
   fallback-to-seed behavior.

3. **Rewire** the public components to use the live hooks (no UI change needed since shapes
   match): Home `NoticeBoardSection`, `/notices` page, Home upcoming-events, `/events`
   list + calendar.

4. **Cache-busting/perf** — small fetch wrapper with abort on unmount; avoid waterfalls on Home.

5. **Admin dashboard** — now wire the live "Active Notices" and "Upcoming Events" tiles +
   mini-lists to `noticeService`/`eventService`.

## Acceptance criteria
- Posting a notice/event in `/admin` makes it appear on Home + `/notices` / `/events`
  (after publish) without a code change. Drafts stay hidden.
- API failure degrades gracefully to seed data; no console errors.
- `npm run build` passes.

## PR
Draft PR "Phase 3.8 — Wire public notices/events to live APIs". Demonstrate end-to-end
(admin create → site shows it) in the description. Update `CHANGELOG.md`.
