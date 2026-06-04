# Icon Commerce College — Website Rebuild Prompt Plan

This folder contains a **sequenced set of build prompts** that transform the existing
single-page "CIT — Engineering Admissions" boilerplate into a complete, modern,
multi-page website + admin panel for **Icon Commerce College, Guwahati**.

## How to use this folder

1. Execute the prompts **in numerical order**, one at a time.
2. After each prompt, Claude Code builds the change, tests it, and opens a **draft PR**.
3. You review and merge the PR, then move to the next prompt.
4. Each prompt is **self-contained** but assumes every lower-numbered prompt has already
   been merged. Each prompt names its dependencies.

> **Before doing anything else, read [`00-DESIGN-SYSTEM.md`](./00-DESIGN-SYSTEM.md).**
> It is the single source of truth for colours, typography, spacing, animation,
> placeholder-image conventions, content data, and coding conventions. Every other
> prompt references it instead of repeating it.

## Phases & prompt index

### Phase 0 — Foundation & cleanup
- `01-rebrand-and-cleanup.md` — Strip CIT/ad-tech, rename project, reset env & metadata.
- `02-design-system-tokens.md` — Navy+Gold theme tokens, MUI theme, typography, globals.
- `03-content-data-layer.md` — All college content as data files (`src/data/*`).
- `04-routing-scaffold.md` — Multi-page router, page shells, layout, ScrollToTop.
- `05-header-navigation.md` — Sticky multi-page header + mega-menu + mobile drawer.
- `06-footer.md` — Redesigned multi-column footer.

### Phase 1 — Shared system
- `07-ui-primitives.md` — Button, Card, SectionTitle, Container, Breadcrumbs, PageHero, motion helpers.
- `08-lead-capture-core.md` — College lead form + `webhookSubmit` config + validators.
- `09-lead-drawer-and-ctas.md` — Global lead drawer, modal, floating enquiry + WhatsApp.
- `10-seo-foundation.md` — SEO config, per-route `SEOHead`, schema.org, sitemap/robots/manifest.

### Phase 2 — Public pages
- `11-home-hero-highlights.md`
- `12-home-about-vision-stats.md`
- `13-home-courses-whychoose.md`
- `14-home-noticeboard-leadership-testimonials-assemble.md`
- `15-about-page.md`
- `16-leadership-desks-page.md`
- `17-courses-overview-page.md`
- `18-course-detail-pages.md`
- `19-departments-page.md`
- `20-faculty-page.md`
- `21-facilities-page.md`
- `22-gallery-page.md`
- `23-admissions-and-prospectus.md`
- `24-contact-notices-events-public.md`

### Phase 3 — Admin panel
- `25-admin-cleanup-and-shell.md`
- `26-admin-dashboard.md`
- `27-admin-lead-management.md`
- `28-notices-api-store.md`
- `29-admin-notices-module.md`
- `30-events-api-store.md`
- `31-admin-events-calendar-module.md`
- `32-public-dynamic-wiring.md`
- `33-admin-settings-and-help.md`

### Phase 4 — Polish, content, docs, QA
- `34-responsive-animation-a11y-pass.md`
- `35-thankyou-404-error-states.md`
- `36-performance-and-images.md`
- `37-content-population.md`
- `38-cross-page-qa-link-audit.md`
- `39-documentation.md`
- `40-final-build-verification.md`

> Total: **40 ordered prompts** + 1 design-system reference. Add follow-up prompts as
> needed (e.g. blog/news, online application form, results portal) — the architecture
> from Phase 3 is reusable for any new "post in admin → show on site" feature.

## Global rules that apply to EVERY prompt

These are restated in `00-DESIGN-SYSTEM.md` and must be honoured in every PR:

1. **Branch:** develop on the branch the session specifies; open a **draft PR** per prompt.
2. **Placeholder images only.** Never fetch or embed real photos. Use
   `/public/images/placeholders/<descriptive-name>.jpg` (or `.svg`) with a visible
   labelled placeholder, and reference them by the documented name so they can be
   swapped later. See the design-system doc for the naming list.
3. **No fabricated facts.** Use only the content in `00-DESIGN-SYSTEM.md` /
   `src/data/*`. If a value is unknown, use a clearly-marked `TODO` placeholder.
4. **Mobile-first & responsive**, WCAG-AA accessible, keyboard-navigable.
5. **Animations:** subtle, minimalist, performance-safe (Framer Motion reveal-on-scroll,
   staggered "shuttle" entrances). Respect `prefers-reduced-motion`.
6. **Keep the lead-storage architecture** (in-memory cache → PHP/JSON store → poll +
   BroadcastChannel). Reuse it for notices & events.
7. **Test before PR:** `npm run build` must pass with no new ESLint errors; verify the
   touched routes render.
