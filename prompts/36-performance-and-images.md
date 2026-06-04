# Prompt 36 — Performance & Image Handling

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§4, §7).
**Depends on:** Phase 0–3.
**Goal:** Make the site fast and image-handling production-ready (still using placeholders).

## Tasks

1. **Code-splitting** — confirm every route + heavy section is `React.lazy`-loaded; keep the
   idle-preload pattern from the boilerplate for likely-next pages (Courses/Admissions).
   Verify the admin bundle is split from the public bundle.

2. **Images**
   - Reusable `<Img>` component: `loading="lazy"`, `decoding="async"`, explicit width/height
     or aspect-ratio box to prevent CLS, gold→white shimmer placeholder while loading, and a
     graceful onError fallback to the labelled placeholder.
   - Use it everywhere; hero image gets `fetchpriority="high"` + preload.
   - Document the production swap: drop real files into `public/images/...` matching the §7
     names; note recommended dimensions per slot in `docs/` (prompt 39).

3. **Fonts** — `display=swap`, preconnect, subset to needed weights; avoid layout shift.

4. **Bundle hygiene** — remove dead deps left from CIT (e.g. unused swiper modules, leftover
   ad-tech). Run `npm run build` + (optional) `npm run analyze`; note bundle sizes in the PR.

5. **Lighthouse targets (mobile)** — Performance ≥ 90, Best-Practices ≥ 95 on Home with
   placeholders; document scores.

6. **Caching headers note** — add a short `docs/` note / `.htaccess` example for static-asset
   caching + SPA fallback rewrite (so client-side routes deep-link correctly on the PHP host).

## Acceptance criteria
- No CLS from images/fonts; routes code-split; Lighthouse targets met; `.htaccess` SPA
  rewrite documented; `npm run build` passes.

## PR
Draft PR "Phase 4.3 — Performance & images". Include Lighthouse + bundle numbers. Update `CHANGELOG.md`.
