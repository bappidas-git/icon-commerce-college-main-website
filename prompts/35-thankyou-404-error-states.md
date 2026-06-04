# Prompt 35 — Thank-You, 404 & Global Error States

**Read first:** `prompts/00-DESIGN-SYSTEM.md`.
**Depends on:** Phase 0–2.
**Goal:** Finish the supporting pages and resilient error handling.

## Tasks

1. **Thank-You** — `src/pages/ThankYou/ThankYou.jsx`: navy+gold success page after a lead
   submit: confirmation, what-happens-next (admissions will call), optional subtle confetti
   (canvas-confetti, reduced-motion safe), CTAs (Explore Courses, Download Prospectus if not
   already, Back to Home), and the Samarth pill. `noindex`. If arrived without a submission,
   still render gracefully.

2. **404** — finalize `NotFound` (built as a shell in prompt 04): helpful copy, search/nav
   suggestions (Courses, Admissions, Contact), navy hero, "Back to Home". `noindex`.

3. **Global ErrorBoundary** — friendly fallback (navy card, "Something went wrong", reload)
   wrapping the router; logs to console only. Per-section boundaries on Home remain.

4. **Network/API error UX** — ensure lead submit, notices, and events surface user-friendly
   messages (Toast/swal) on failure with retry, never a blank screen.

## Acceptance criteria
- Thank-You renders post-submit (and standalone); 404 on unknown routes; error boundary
  catches render errors; API failures show friendly messages. `npm run build` passes.

## PR
Draft PR "Phase 4.2 — Thank-you, 404 & error states". Update `CHANGELOG.md`.
