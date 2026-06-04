# Prompt 12 — Home: About teaser + Vision/Mission + Stats counters

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 college profile, vision, stats).
**Depends on:** 01–11.
**Goal:** Add the "who we are" storytelling band and animated stats to Home.

## Tasks

1. **AboutSection (teaser)** — `src/components/sections/AboutSection/`:
   - Two-column: left = `about-college-building.jpg` placeholder (with a small gold
     "Estd. 2004" badge); right = eyebrow "About the College", heading "A legacy of
     quality higher education in Guwahati", 2–3 short paragraphs condensed from the
     prospectus College Profile (affiliated to Gauhati University, UG programs in Arts,
     Commerce, BBA, BCA, study materials, seminars, smart classrooms, experienced faculty).
   - 3–4 inline mini-stats or bullet ticks; CTA "Learn More" → `/about`.

2. **VisionMissionSection** — `src/components/sections/VisionMission/`:
   - Two gold-accented cards: **Vision** and **Mission** (use prospectus Principal/President
     messaging — excellence, holistic development, moral integrity, industry readiness).
     Use `vision-mission.jpg` as a side/background accent.

3. **StatsSection** — `src/components/sections/StatsSection/`:
   - Animated counters from `statsData.js` (Since 2004, 4 UG Programs, 18+ Departments,
     40+ Faculty, GU Affiliated, 1000s Alumni). Reuse `AnimatedCounter`. Navy band with
     gold numbers; count-up triggers on scroll into view; reduced-motion shows final values.

4. Add all three to `Home.jsx` in order.

## Acceptance criteria
- Counters animate once on view; values match data; responsive stacking on mobile.
- Copy contains no fabricated claims (only prospectus-sourced). `npm run build` passes.

## PR
Draft PR "Phase 2.2 — Home about, vision/mission & stats". Update `CHANGELOG.md`.
