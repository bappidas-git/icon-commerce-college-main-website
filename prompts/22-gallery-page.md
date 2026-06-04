# Prompt 22 — Gallery Page (Photos + Videos)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6, §7 gallery placeholders).
**Depends on:** 01–10.
**Goal:** A unified `/gallery` (replacing the separate Photo/Video gallery pages).

## Tasks — `src/pages/Gallery/Gallery.jsx`

1. **PageHero** — "Gallery", breadcrumb Home / Gallery.
2. **Tabs** — "Photos" | "Videos" (accessible tablist).
3. **Photos** — masonry/grid of `gallery-1..12.jpg` placeholders from `galleryData.js`
   with category filter chips (Campus · Events · Sports · Labs). Click → accessible
   lightbox (reuse the generic `Modal`) with prev/next + caption; keyboard arrows + Esc.
4. **Videos** — responsive cards using `videos[]` (YouTube `TODO` ids); click opens the
   Modal with a lazy-loaded iframe (no autoplay-on-load; load only on open for perf).
5. **Lazy loading** — images `loading="lazy"`; only render lightbox content when open.
6. SEO via `useSeo`.

## Acceptance criteria
- Tabs switch; filters work; lightbox + video modal accessible and performant.
- Responsive masonry; `npm run build` passes.

## PR
Draft PR "Phase 2.12 — Gallery page". Update `CHANGELOG.md`.
