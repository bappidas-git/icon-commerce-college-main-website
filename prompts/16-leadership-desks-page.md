# Prompt 16 — Leadership / "From the Desk of" Page

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 leadership list).
**Depends on:** 01–10, 15.
**Goal:** A dignified `/leadership` page presenting the seven desk messages, replacing the
scattered President/Advisor/Principal blurbs.

## Tasks — `src/pages/Leadership/Leadership.jsx`

1. **PageHero** — "Messages from the Desks", breadcrumb Home / Leadership.
2. **Leadership grid/list** — for each entry in `leadershipData.js` render a `ProfileCard`
   that links/anchors to a detailed message block (`id` = slug, so `/leadership#dr-mandira-saha`
   works). Order: President → Advisor → Principal → Rector → Director (Academic) → Director →
   Academic Advisor.
3. **Message sections** — alternating left/right layout: portrait placeholder
   (e.g. `principal-dr-mandira-saha.jpg`) + name, role, qualifications, and the full message
   (use prospectus excerpts; finalize full copy in prompt 37 — short stub acceptable now,
   marked `TODO: full message`). Gold quote accent + signature line.
4. **Governing Body note (optional)** — short paragraph on Icon Academy Trust governance.
5. SEO via `useSeo`; add `Person` schema for the Principal/President (optional).

## Acceptance criteria
- Anchored deep-links from Home leadership teaser scroll to the right message.
- All 7 desks present with correct names/roles/quals; responsive; reveals on scroll.
- `npm run build` passes.

## PR
Draft PR "Phase 2.6 — Leadership page". Update `CHANGELOG.md`.
