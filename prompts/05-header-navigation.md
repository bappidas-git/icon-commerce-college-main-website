# Prompt 05 — Header & Navigation

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§1, §2, §5; navigation.js from prompt 03).
**Depends on:** 01–04.
**Goal:** A professional, sticky, responsive multi-page header with dropdowns, plus the
mobile drawer + bottom nav — replacing the CIT hash-based header.

## Tasks

1. **Top utility bar** (desktop, slim, navy): left = address + phone (click-to-call),
   right = email + social icons + a gold "Samarth Admission Portal ↗" pill linking to the
   Samarth URL. Hidden on small screens (its info moves into the drawer).

2. **Main header** — `src/components/common/Header/Header.jsx`:
   - Left: logo placeholder (`logo-icon-commerce.png`) + wordmark "Icon Commerce College"
     with small Assamese subtitle.
   - Center/right desktop nav from `navigation.js`: Home · About ▾ (About, Leadership,
     Faculty, Facilities) · Courses ▾ (overview + 4 programs) · Departments · Gallery ·
     Admissions · Notices · Events · Contact.
   - Use `NavLink` with active styling: gold underline grows under the active/hover item
     (animated, the "shuttle" underline). Dropdowns: accessible (hover + keyboard/focus,
     `aria-expanded`, Esc to close), animated fade/slide via Framer Motion.
   - Primary CTA button (warm-red) "Apply Now" → opens lead drawer (`openLeadDrawer`).
   - Sticky: transparent-over-hero on Home top, solid white w/ shadow after scroll
     (use a scroll listener; on non-home routes start solid).

3. **Mobile drawer** — rebuild `MobileDrawer.jsx`: full nav tree with collapsible
   submenus, contact block, Samarth pill, Apply Now CTA. Smooth slide-in, focus-trapped,
   closes on route change.

4. **Mobile bottom nav** — `MobileNavigation.jsx`: Home · Courses · Apply (center CTA) ·
   Notices · Menu. Active state in gold.

5. Wire Header/Footer/drawer into `PublicLayout` (replace the temporary stubs).

## Design
- Navy text on white; gold accents; Poppins nav labels 600.
- Respect `prefers-reduced-motion`. All icon-only buttons have `aria-label`.

## Acceptance criteria
- Every nav link routes correctly; dropdowns keyboard-accessible; active route highlighted.
- Header transparent on Home hero, solidifies on scroll; solid on inner pages.
- Mobile: drawer + bottom nav work; Apply opens the lead drawer.
- `npm run build` passes; Lighthouse a11y for header has no critical issues.

## PR
Draft PR "Phase 0.5 — Header, dropdown nav & mobile menu". Screenshots (desktop + mobile)
in the description. Update `CHANGELOG.md`.
