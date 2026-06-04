# Prompt 11 — Home: Hero + Highlights Bar

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§1, §2, §4, §6).
**Depends on:** 01–10.
**Goal:** Build the Home hero and the quick-highlights strip — the first impression.

## Tasks

1. **HeroSection** — `src/components/sections/HeroSection/`:
   - Full-width navy-gradient overlay (`--gradient-hero`) over a background placeholder
     (`hero-campus.jpg`), with optional subtle Ken-Burns/parallax (reduced-motion safe).
   - Eyebrow: "Admissions Open 2026–27 · Affiliated to Gauhati University".
   - H1: "Where Knowledge Meets Character" (or college tagline). Subtitle: 1–2 lines from
     §1 secondary tagline + "Estd. 2004, Guwahati".
   - CTAs: primary warm-red "Apply Now" (→ drawer `apply-now`) + outline-gold "Download
     Prospectus" (→ `prospectus`). Secondary text link "Explore Courses" → `/courses`.
   - Trust chips row: "Gauhati University · NEP 2020 · Samarth Code 842 · 4 UG Programs".
   - Optional right-side floating quick-enquiry card (compact `UnifiedLeadForm`, source `hero`)
     on desktop; below the hero on mobile.
   - Staggered "shuttle" entrance for headline → subtitle → CTAs → chips.

2. **HighlightsSection** — a thin strip of 4 icon highlights directly under the hero:
   e.g., "NEP 2020 FYUGP", "4 UG Programs (B.Com/BBA/BCA/BA)", "Experienced Faculty",
   "Modern Campus & Labs". IconCards with gold chips; hover lift.

3. Mount both at the top of `src/pages/Home/Home.jsx` (assembled fully in prompt 14).

## Design
- Hero text legible (AA contrast) over the image via the overlay.
- Mobile: stack CTAs full-width; hide the desktop enquiry card, keep a single Apply CTA.

## Acceptance criteria
- Hero renders with placeholder bg, working CTAs, responsive at 360/768/1280.
- Reduced-motion disables parallax/stagger. `npm run build` passes.

## PR
Draft PR "Phase 2.1 — Home hero & highlights". Screenshots. Update `CHANGELOG.md`.
