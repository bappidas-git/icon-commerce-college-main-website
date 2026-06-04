# Prompt 15 — About Page

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 college profile, vision/mission).
**Depends on:** 01–10 (uses primitives, SEO).
**Goal:** A rich `/about` page presenting the college story professionally (replacing the
clumsy current About/Vision pages).

## Tasks — `src/pages/About/About.jsx`

1. **PageHero** — "About Icon Commerce College", breadcrumb Home / About, `about-campus-aerial.jpg`.
2. **College Profile** — two-column intro: image (`about-college-building.jpg`) + the
   condensed profile copy (Estd. 2004, Rajgarh Road Chandmari Guwahati, affiliated to
   Gauhati University, Samarth permitted exam centre, UG programs in Arts/Commerce/BBA/BCA,
   study materials, enriched library, seminars/workshops, smart classrooms, online classes,
   experienced/research-active faculty). Keep paragraphs scannable.
3. **Vision & Mission** — two gold-accented cards (reuse the section from prompt 12 or a
   richer version): Vision statement + Mission bullet list.
4. **Core Values / Why ICC** — 6 IconCards (Academic Excellence, Holistic Development,
   Moral Integrity, Student-Centric Approach, Inclusive Community, Industry Readiness).
5. **At a Glance** — small stats strip (reuse StatsSection data) + affiliation/accreditation
   chips (Gauhati University, NEP 2020, Samarth 842, Estd 2004).
6. **Milestones/Timeline (optional)** — simple vertical timeline (2004 founding → growth →
   NEP 2020 adoption → today). Mark uncertain years `TODO`.
7. **CTA band** — Apply / Prospectus / Visit Campus.
8. Set page SEO via `useSeo`.

## Acceptance criteria
- Reads cleanly, no fabricated data, fully responsive; reveals on scroll.
- Internal links to /courses, /leadership, /admissions present. `npm run build` passes.

## PR
Draft PR "Phase 2.5 — About page". Update `CHANGELOG.md`.
