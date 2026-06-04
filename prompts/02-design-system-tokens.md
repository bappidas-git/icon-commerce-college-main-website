# Prompt 02 — Design System Tokens (Navy + Gold)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (sections 2–4, 7).
**Depends on:** 01.
**Goal:** Implement the visual foundation — colour tokens, typography, spacing, motion
defaults, and a placeholder-image generator — so every later page is consistent.

## Tasks

1. **CSS variables** — `src/styles/variables.css`: replace the old palette with the full
   token set from design-system §2 (colours, gradients), §3 (type scale), §4 (spacing,
   radius, shadows, motion durations/easings). Keep variable names exactly as documented.

2. **MUI theme** — `src/theme/muiTheme.js`: set `palette.primary=#1A2A52`,
   `secondary=#C8A04D`, an `error/cta` channel for `#E0301E`, `success=#1E8E5A`, background
   default `#F7F8FB`/paper `#FFFFFF`, text primary `#14233D`/secondary `#5B6678`.
   Typography: Poppins headings / Inter body, responsive sizes matching §3. Shape
   `borderRadius:10`. Component overrides: Button (radius 10, no uppercase, weight 600),
   Card (radius 16, shadow-sm), Container maxWidth lg. Breakpoints unchanged.

3. **Fonts** — `public/index.html`: add preconnect + Google Fonts links for Poppins
   (600,700) and Inter (400,500,600). Remove old font links. Update `<title>`,
   meta description, theme-color `#1A2A52`, and the inline initial-loader colours to navy/gold.

4. **Globals** — `src/styles/global.css`: base resets, body bg/text, link colour (navy →
   gold hover), selection colour, focus-visible outline (gold), `.eyebrow` label utility,
   `.container` widths, `prefers-reduced-motion` reset. Keep `src/styles/animations.css`
   and `responsive.css` but align keyframes (fade-up, shuttle cascade, subtle float).

5. **Placeholder image system**
   - Add `public/images/placeholders/.gitkeep` and a generator script
     `scripts/gen-placeholders.mjs` (Node, no extra deps) that writes a labelled **SVG**
     for every name listed in design-system §7 (navy background, gold border, centered
     white filename text + dimensions). Add `"gen:placeholders"` npm script.
   - Run it so the placeholder files exist (commit the generated SVGs; if a `.jpg`
     extension is referenced, generate an SVG saved with that name is acceptable for dev,
     OR generate `.svg` and have components import via a small `placeholder()` helper in
     `src/utils/assets.js` that maps a logical name → `/images/placeholders/<name>`).
   - Add `src/utils/assets.js` exporting `placeholder(name)` and `IMAGES` constant map so
     components never hardcode paths.

## Acceptance criteria
- `npm run build` passes. A scratch render of any element shows Navy+Gold + Poppins/Inter.
- `npm run gen:placeholders` (re)creates all §7 placeholder files.
- No old CIT colours (`#0C2D48`, `#D82618`) remain (grep clean).

## PR
Draft PR "Phase 0.2 — Design tokens, typography & placeholder system". Include a short
before/after note and the list of generated placeholders. Update `CHANGELOG.md`.
