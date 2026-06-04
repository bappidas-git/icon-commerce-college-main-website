# Icon Commerce College — Official Website & Admin

## Overview

A modern, mobile-first **multi-page website** and **admin panel** for **Icon Commerce College, Guwahati** (আইকন কমাৰ্চ কলেজ) — a Commerce, Arts & Computer Application college established in 2004 under the Icon Academy Trust and affiliated to **Gauhati University** (NEP 2020 / FYUGP). The site captures admission enquiries (leads) and lets staff publish notices and events from an admin panel. Built with React 18, Material UI v5, and Framer Motion.

> The single source of truth for design tokens, content data, the site map, and
> coding conventions is **`prompts/00-DESIGN-SYSTEM.md`** — read it before making
> changes. The phased rebuild plan lives in `prompts/`.

## Project Structure

- `src/components/sections/` — Page sections (rebuilt per Phase 2 prompts)
- `src/components/common/` — Reusable components (Header, Footer, LeadForm, SEO, etc.)
- `src/data/` — Content data files (programs, departments, faculty, facilities, etc.)
- `src/config/` — SEO configuration
- `src/context/` — React context providers (Modal, Theme)
- `src/hooks/` — Custom hooks (useGTMTracking, useInView, useMediaQuery, etc.)
- `src/utils/` — Utility functions (webhookSubmit, gtm, validators, formatters, seo)
- `src/admin/` — Admin panel (components, pages, context, utils)
- `src/pages/` — Full pages (ThankYou)
- `public/` — Static assets, index.html, manifest, robots.txt, sitemap.xml
- `public/images/placeholders/` — Labelled placeholder images (swap for real assets)
- `public/api/` — Server-side endpoints (`leads.php` shared lead store; `notices.php` and `events.php` added in Phase 3)

## Site Map

Public: `/` · `/about` · `/leadership` · `/courses` · `/courses/:slug` (`b-com`/`bba`/`bca`/`b-a`) · `/departments` · `/faculty` · `/facilities` · `/gallery` · `/admissions` · `/notices` · `/events` · `/contact` · `/thank-you` · `*` (404).

Admin (noindex): `/admin/login` · `/admin/dashboard` · `/admin/leads` (+`/:leadId`) · `/admin/notices` · `/admin/events` · `/admin/settings`.

## Lead Storage & Sync

Leads are stored server-side in `public/api/leads.php` (a shared JSON store) — this is the **single source of truth**. The public form POSTs each submission there, and the admin panel reads/writes only the server (auto-refreshing every 15s), so every browser and device sees the same leads. There is no localStorage copy of leads. Configure with `REACT_APP_LEADS_API_URL` + `REACT_APP_LEADS_ADMIN_KEY` in `.env` (the key must match `ADMIN_API_KEY` in `public/api/config.php`). **Notices** and **Events** copy this exact pattern with `notices.php` / `events.php` stores (added in Phase 3).

## Brand Color System (Deep Navy + Gold)

- Primary (Deep Navy): `#1A2A52` — headers, headings, primary surfaces
- Primary Dark (Navy 900): `#111d3a` — gradients, footer
- Accent (Gold): `#C8A04D` — eyebrow labels, underlines, icon chips, dividers
- Accent Soft (Gold tint): `#F3E9D2` — card backgrounds, badges
- CTA (Warm Red): `#E0301E` — the single primary action per view ("Apply Now"/"Enquire Now")
- Text: `#14233D` · Muted: `#5B6678` · Page bg: `#F7F8FB` · Surface: `#FFFFFF`

Navy = structure, Gold = emphasis only, Warm Red = one primary CTA per view. Full token list (gradients, spacing, radius, shadows, motion) is in `prompts/00-DESIGN-SYSTEM.md`. Define tokens in `src/styles/variables.css` and mirror in `src/theme/muiTheme.js`.

## Typography

Headings: `'Poppins'` (600/700). Body: `'Inter'` (400/500). Loaded via `public/index.html`.

## Placeholder Images

**Never use real/remote images.** Use labelled placeholders under
`public/images/placeholders/` referenced by the canonical kebab-case names in
the design-system doc, so the client can swap them later.

## Documentation

- `prompts/00-DESIGN-SYSTEM.md` — single source of truth (read first)
- `prompts/README.md` — the phased rebuild plan (40 ordered prompts)
- `CHANGELOG.md` — detailed changelog
- `GTM_GUIDE.md` — optional Google Tag Manager setup

## Conventions

React 18 + MUI v5 + Framer Motion. CSS Modules per component using CSS variables. One component per folder. Keep `App.jsx` lean with `React.lazy` + `Suspense`. Accessibility: semantic landmarks, alt text on every image, focus states, `aria-label` on icon buttons, skip-link retained. Animations subtle and guarded by `prefers-reduced-motion`. Each PR: update `CHANGELOG.md`, keep `npm run build` green, no console errors on touched routes.
