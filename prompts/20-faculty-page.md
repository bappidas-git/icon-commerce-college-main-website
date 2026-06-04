# Prompt 20 — Faculty / Teaching Staff Page

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 faculty + leadership).
**Depends on:** 01–10.
**Goal:** A professional `/faculty` directory (replacing the cramped staff image-grid).

## Tasks — `src/pages/Faculty/Faculty.jsx`

1. **PageHero** — "Our Faculty", subtitle "Experienced, qualified & research-active
   educators", breadcrumb Home / Faculty.
2. **Intro** — short paragraph from the prospectus (faculty are PhD/M.Phil/NET/SLET
   qualified, ~one-third pursuing research, mentor-based student development records).
3. **Filter/search (optional)** — by department/stream + a name search box.
4. **Faculty grid** — `ProfileCard`s from `facultyData.js`: photo placeholder
   (`faculty-placeholder.jpg`), name, designation, qualifications, department. Hover lift;
   optional flip/expand for a short bio (mostly `TODO`).
5. **Leadership / Coordinators highlight** — small section pulling Principal, Academic
   Advisor, and program coordinators (B.Com/BBA, BCA, BA) to the top.
6. **Guest Faculty** — note the two guest faculty (Biswajit Bhattacharya; Dr. Nripendra
   Nath Medhi) if including. SEO via `useSeo`.

## Acceptance criteria
- Grid renders from data; filter/search works; responsive (1/2/3/4 cols).
- No fabricated credentials (only prospectus-sourced). `npm run build` passes.

## PR
Draft PR "Phase 2.10 — Faculty page". Update `CHANGELOG.md`.
