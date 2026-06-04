# Prompt 17 — Courses Overview Page

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 programs).
**Depends on:** 01–10.
**Goal:** A clean `/courses` hub presenting all 4 UG programs (replacing 4 thin separate pages).

## Tasks — `src/pages/Courses/Courses.jsx`

1. **PageHero** — "Our Programs", subtitle "Undergraduate degrees under NEP 2020 (FYUGP),
   affiliated to Gauhati University", breadcrumb Home / Courses.
2. **Intro band** — short paragraph on the FYUGP/NEP-2020 structure (3-yr degree / 4-yr
   honours, 6/8 semesters) and the admission route via Samarth (Code 842).
3. **Program cards grid** — large `ProgramCard` for each of B.Com, BBA, BCA, BA with image,
   shortName, duration, eligibility one-liner, starting-fees, 3 highlight ticks, and
   "View Details" → `/courses/:slug` + "Apply" → drawer.
4. **Comparison table (desktop) / stacked (mobile)** — Program · Duration · Eligibility ·
   1st-sem Total Fees · Monthly Tuition, from data. Horizontal-scroll safe on mobile.
5. **Admission CTA** — steps summary (4) + Samarth pill + Apply + Prospectus.
6. SEO via `useSeo` (ItemList schema of courses optional).

## Acceptance criteria
- All 4 programs + comparison table render from `coursesData.js` with correct fees.
- Card/table links route to the right slug; responsive. `npm run build` passes.

## PR
Draft PR "Phase 2.7 — Courses overview". Update `CHANGELOG.md`.
