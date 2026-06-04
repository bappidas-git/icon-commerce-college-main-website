# Prompt 14 — Home: Notice Board + Events + Leadership + Testimonials + CTA (assemble)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6).
**Depends on:** 01–13. (Notices/Events read from `seedNotices.js`/`seedEvents.js` for now;
rewired to the live API in prompt 32.)
**Goal:** Finish the Home page with dynamic-ready bands and a strong closing CTA.

## Tasks

1. **NoticeBoardSection** — `src/components/sections/NoticeBoard/`:
   - Two-up layout: left = scrolling/auto-cycling "Notice Board" list (date chip + title +
     "New" badge), right = "Upcoming Events" preview (next 2–3 events from data).
   - Data source: a small `useNotices()`/`useEvents()` hook that currently returns the seed
     data (prompt 32 swaps it to the API). "View all notices" → `/notices`, "All events" → `/events`.
   - Empty-state via `EmptyState` when no items.

2. **LeadershipTeaser** — `src/components/sections/LeadershipTeaser/`:
   - 3 featured ProfileCards (President Smt. Dipali Bora, Principal Dr. Mandira Saha,
     Academic Advisor Dr. Nilanjan Bhattacharjee) with photo placeholder, name, role, a
     1-line message excerpt, "Read message" → `/leadership#<slug>`. "Meet our leadership" → `/leadership`.

3. **TestimonialsSection** — `src/components/sections/Testimonials/`:
   - Swiper carousel of alumni quotes from `testimonialsData.js` (avatar, name, role, quote).
     Autoplay (pausable), gold quote mark, navy cards; reduced-motion disables autoplay.

4. **HomeCTASection** — full-width navy/gold gradient band: "Begin your journey at Icon
   Commerce College" + Apply Now (warm-red) + Download Prospectus (outline) + Samarth link.

5. **Assemble** `Home.jsx` final order: Hero → Highlights → About → Vision/Mission → Programs
   → Stats → WhyChoose → NoticeBoard+Events → Leadership → Testimonials → CTA → (Contact
   strip optional). Wrap each below-the-fold section in lazy `Suspense` + `Reveal`.

## Acceptance criteria
- Full Home renders end-to-end, responsive, smooth reveals, no layout shift.
- Notices/Events show seed data and link out; testimonial carousel works.
- `npm run build` passes; Home Lighthouse perf ≥ 85 mobile (placeholders are lightweight).

## PR
Draft PR "Phase 2.4 — Home assembly (notices, leadership, testimonials, CTA)". Full-page
screenshot. Update `CHANGELOG.md`.
