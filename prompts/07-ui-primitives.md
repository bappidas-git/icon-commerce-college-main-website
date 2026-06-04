# Prompt 07 — Shared UI Primitives & Motion Helpers

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§3, §4).
**Depends on:** 01–06.
**Goal:** Build the reusable building blocks every page uses, so pages stay consistent and
DRY. Include the centralized animation ("shuttle") helpers.

## Components (under `src/components/common/`)

1. **Button** — variants: `primary` (warm-red CTA), `navy`, `gold`, `outline`, `ghost`,
   `link`; sizes sm/md/lg; optional leading/trailing iconify icon; `as` link/button;
   loading state; subtle hover scale. Accessible focus ring.

2. **Container** / **Section** — `Section` adds vertical rhythm (`clamp` padding), optional
   `bg` (`light`|`white`|`navy`|`gold-soft`), optional eyebrow + `SectionTitle`.

3. **SectionTitle** — eyebrow (gold uppercase) + heading + optional subtitle + alignment;
   gold underline accent under heading.

4. **Card** — surface card (radius 16, shadow-sm → hover shadow-md + lift). Sub-variants:
   `ImageCard` (top image), `IconCard` (gold icon chip), `StatCard`, `ProfileCard`
   (avatar + name + role), `ProgramCard`, `NoticeCard`, `EventCard`. Build the generic ones
   here; specialized ones can extend in their page prompts.

5. **PageHero** — inner-page hero used by all non-home pages: navy gradient over a
   placeholder background image, breadcrumb, page title + subtitle, optional CTA.
   Props: `title, subtitle, image, breadcrumb[], cta?`.

6. **Breadcrumbs** — schema-friendly (`itemListElement` ready), home icon + chevrons, gold hover.

7. **Accordion** — accessible expand/collapse (used by Departments, Admissions FAQ).

8. **Tabs** — accessible tablist (used by Course detail, Departments by stream).

9. **EmptyState** — icon + message + optional CTA (used when notices/events lists are empty).

10. **Reveal** — wrapper that applies the standard reveal-on-scroll variant to children;
    `RevealGroup` staggers its children (the "shuttle" cascade).

## Motion helper — `src/utils/motion.js`
Export Framer Motion variants: `fadeUp`, `fadeIn`, `staggerContainer(stagger=0.08)`,
`scaleIn`, `slideInLeft/Right`, plus a `useReducedMotionVariants()` hook that returns
static (no-op) variants when `prefers-reduced-motion` is set. All `Reveal`/`RevealGroup`
components must route through this.

## Acceptance criteria
- A scratch demo page can compose Section + SectionTitle + Card grid + Button + PageHero +
  Accordion + Tabs and they render correctly & responsively.
- Reduced-motion disables transforms.
- `npm run build` passes; components are documented with prop comments.

## PR
Draft PR "Phase 1.1 — UI primitives & motion helpers". Update `CHANGELOG.md`.
