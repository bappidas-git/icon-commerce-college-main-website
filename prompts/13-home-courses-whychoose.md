# Prompt 13 — Home: Programs teaser + Why Choose Us

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 programs, facilities).
**Depends on:** 01–12.
**Goal:** Showcase the 4 programs and the reasons to choose ICC on Home.

## Tasks

1. **ProgramsSection** — `src/components/sections/ProgramsSection/`:
   - SectionTitle: eyebrow "Programs", heading "Undergraduate Programs (NEP 2020)".
   - Grid of 4 `ProgramCard`s from `coursesData.js`: image (course-*.jpg), shortName badge,
     name, duration, 2–3 highlight ticks, "starting fees" hint, and two actions —
     "View Details" → `/courses/:slug` and "Apply" → drawer `apply-now` with preset program.
   - Hover lift + gold accent. "View All Programs" → `/courses`.

2. **WhyChooseSection** — `src/components/sections/WhyChoose/`:
   - 6 IconCards distilled from facilities/USP: Affiliated to Gauhati University · NEP 2020
     outcome-based curriculum · Experienced & research-active faculty · Smart classrooms &
     computer lab · Digital library & study materials · Scholarships & student support.
   - Optional split layout with a `hero-students.jpg` placeholder and a gold stat callout.

## Acceptance criteria
- 4 program cards render from data with correct fees/slugs; CTAs work and preset the program.
- Responsive grid (1/2/4 cols). `npm run build` passes.

## PR
Draft PR "Phase 2.3 — Home programs & why-choose". Update `CHANGELOG.md`.
