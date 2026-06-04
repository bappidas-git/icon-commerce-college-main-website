# Prompt 09 — Lead Drawer, Modals & Floating CTAs

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§8); ModalContext from boilerplate.
**Depends on:** 01–08.
**Goal:** Make lead capture reachable from anywhere, with a polished side drawer, a generic
modal, and floating contact actions.

## Tasks

1. **ModalContext** — keep the existing provider. Simplify drawer title presets to college
   contexts: `apply-now` ("Apply for Admission 2026"), `enquiry` ("Course Enquiry"),
   `prospectus` ("Download Prospectus"), `callback` ("Request a Callback"),
   `visit` ("Book a Campus Visit"), `default`. Each preset sets title/subtitle/source.

2. **LeadFormDrawer** — `src/components/common/LeadFormDrawer/`: right-side (or bottom-sheet
   on mobile) drawer hosting `UnifiedLeadForm`, navy header w/ gold accent, trust line
   ("We'll never share your details"), close on Esc/overlay, focus-trapped, scroll-locked.
   Driven by `isDrawerOpen`/`drawerConfig` from ModalContext.

3. **Modal** — keep the generic `Modal` for legal/info/gallery/video usage; restyle.

4. **Floating actions** (bottom-right stack, mobile-aware so they don't overlap bottom nav):
   - WhatsApp FAB → `whatsappHref` (from collegeInfo) with prefilled text.
   - "Enquire" FAB (gold) → `openLeadDrawer('enquiry')`.
   - BackToTop (existing) navy.
   Subtle entrance + hover; hide Enquire FAB while the drawer is open.

5. Provide a reusable `<EnquiryButton preset=… source=… />` wrapper for use across pages.

## Acceptance criteria
- Apply/Enquire/Prospectus CTAs from header/footer/pages all open the correct preset.
- Drawer fully accessible; submits via the prompt-08 pipeline; mobile bottom-sheet works.
- Floating actions don't overlap the mobile bottom nav; `npm run build` passes.

## PR
Draft PR "Phase 1.3 — Lead drawer & floating CTAs". Update `CHANGELOG.md`.
