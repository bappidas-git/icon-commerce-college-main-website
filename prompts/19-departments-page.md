# Prompt 19 — Departments Page (consolidated)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§5 consolidated decision, §6 departments).
**Depends on:** 01–10.
**Goal:** Replace the ~20 thin `/dp/:id` pages with ONE clean, well-organized
`/departments` page grouped by stream (Arts / Commerce / Science).

## Tasks — `src/pages/Departments/Departments.jsx`

1. **PageHero** — "Departments", subtitle "Arts · Commerce · Science", breadcrumb Home / Departments.
2. **Stream tabs / filter** — Tabs (or filter chips) for All · Arts · Commerce · Science
   (accessible, keyboard-navigable). Counts shown.
3. **Department cards** from `departmentsData.js`:
   - Arts: Assamese, Economics, Education, English, Philosophy, History, Political Science.
   - Commerce: Accountancy, Finance, Management, Business Administration, Economics, English, Environmental Science.
   - Science: Computer Application, Mathematics & Statistics, Botany, Chemistry.
   - Each card: stream-colored gold icon chip, department name, 1-line blurb, and (optional)
     an Accordion that expands to show a short description + related program. Keep it tidy —
     no separate routes.
4. **Stream intro headers** — each stream gets a short intro band with its image
   (`dept-arts.jpg` / `dept-commerce.jpg` / `dept-science.jpg`).
5. **CTA** — "Not sure which stream? Talk to us" → enquiry drawer.
6. SEO via `useSeo`.

## Notes
- If the client later wants per-department detail pages, the data shape already supports
  slugs; for now everything lives on one page (anchor links like `#accountancy` should work).

## Acceptance criteria
- All departments listed under the correct stream; filter works; accordions accessible.
- Anchor deep-links scroll correctly; responsive grid; `npm run build` passes.

## PR
Draft PR "Phase 2.9 — Departments page". Update `CHANGELOG.md`.
