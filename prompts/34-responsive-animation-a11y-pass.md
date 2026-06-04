# Prompt 34 — Responsive, Animation & Accessibility Pass

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§4).
**Depends on:** all of Phase 2 + 3.
**Goal:** A holistic polish sweep across every public page + admin for responsiveness,
consistent minimalist animation, and accessibility — no new features.

## Tasks

1. **Responsive audit** at 360 / 414 / 768 / 1024 / 1280 / 1440:
   - Fix overflow, tap-target sizes (≥44px), table horizontal-scroll, hero text scaling,
     image aspect ratios, mobile bottom-nav vs floating-FAB overlap, drawer behavior.

2. **Animation consistency** — ensure every section uses the shared `Reveal`/`RevealGroup`
   + `motion.js` variants (the "shuttle" cascade); remove ad-hoc/janky animations; verify
   `prefers-reduced-motion` truly disables transforms everywhere; no CLS from animations.

3. **Accessibility (WCAG AA)**:
   - Semantic landmarks (header/nav/main/footer), one h1 per page, logical heading order.
   - Alt text on every image (use the placeholder's descriptive name), `aria-label` on icon
     buttons, focus-visible rings, focus traps in drawer/modal, Esc to close, skip-link works.
   - Colour-contrast check (navy/gold/red on their backgrounds ≥ 4.5:1 for text).
   - Forms: labels, error association (`aria-describedby`), keyboard submit.
   - Run axe/Lighthouse; target a11y ≥ 95 on key routes.

4. **Empty/error/loading states** — consistent `EmptyState`, skeletons, and graceful API-fail
   states on notices/events/leads.

## Acceptance criteria
- No horizontal scroll at any breakpoint; Lighthouse a11y ≥ 95 on Home/Courses/Admissions/Contact;
  reduced-motion verified; `npm run build` passes.

## PR
Draft PR "Phase 4.1 — Responsive/animation/a11y pass". List fixes per route. Update `CHANGELOG.md`.
