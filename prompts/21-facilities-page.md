# Prompt 21 — Facilities Page

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 facilities).
**Depends on:** 01–10.
**Goal:** A polished `/facilities` page (replacing the plain bullet list on the current site).

## Tasks — `src/pages/Facilities/Facilities.jsx`

1. **PageHero** — "Campus & Facilities", breadcrumb Home / Facilities.
2. **Intro** — one-line on the learning environment.
3. **Facilities grid** — `IconCard`/`ImageCard` for each from `facilitiesData.js`:
   Qualified & Experienced Faculty · Digital Library · Computer Lab · Smart Classrooms ·
   Online Classes (Google Meet) · College Canteen · Free Wi-Fi / Internet · Playground
   (Sports & Events) · Purified Drinking Water · Scholarship Assistance.
   Each: gold icon chip, title, short blurb, optional image placeholder
   (`facility-library.jpg`, `facility-computer-lab.jpg`, `facility-canteen.jpg`,
   `facility-playground.jpg`, `facility-smart-classroom.jpg`, `facility-wifi.jpg`).
4. **Feature spotlight (alternating rows)** — 2–3 richer two-column blocks (image + copy)
   for Library, Computer Lab, and Sports/College Week.
5. **CTA** — "Visit our campus" → drawer `visit`; link to Gallery.
6. SEO via `useSeo`.

## Acceptance criteria
- All facilities render from data; alternating spotlights responsive; reveals on scroll.
- `npm run build` passes.

## PR
Draft PR "Phase 2.11 — Facilities page". Update `CHANGELOG.md`.
