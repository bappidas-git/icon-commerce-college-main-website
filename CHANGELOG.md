# Changelog

All notable changes to the Icon Commerce College website project.

## [Unreleased]

### Phase 2.4 — Home assembly (notices, leadership, testimonials, CTA)

Fourteenth prompt of the rebuild (`prompts/14-home-noticeboard-leadership-testimonials-assemble.md`).
Completes the Home page with the dynamic-ready Notices/Events band, a leadership
teaser, an alumni testimonials carousel and a closing CTA, then assembles the
full page in its final order. Notices/Events read from the seed data today via
new hooks and are rewired to the live API in prompt 32.

**Data hooks (`src/hooks/useNotices.js`, `src/hooks/useEvents.js`)**
- `useNotices()` returns the published `seedNotices` sorted pinned-first then
  newest; `useEvents()` returns the published `seedEvents` sorted by start date.
  Both expose a stable `{ notices|events, loading, error }` shape so prompt 32
  can swap the seed source for the `notices.php` / `events.php` stores without
  touching any consumer.

**NoticeBoardSection (`src/components/sections/NoticeBoard/`)**
- Gold-eyebrow `Section` ("Stay Updated" → "Notices & Upcoming Events") over a
  **two-up** layout. Left = an auto-cycling **Notice Board** (date chip +
  category + title + warm-red **New** badge for pinned/recent notices) whose
  active row is highlighted with a gold rail and gently scrolled into view
  **within the panel only**; it pauses on hover/focus and stops entirely under
  `prefers-reduced-motion`. Right = an **Upcoming Events** preview (next 2–3
  events) with navy day/month date tiles, category, title and a date-range +
  venue meta line. Each panel links out (**View all notices** → `/notices`,
  **All events** → `/events`) and falls back to `<EmptyState>` when empty.
  Upcoming events prefer not-yet-ended dates and fall back to the soonest seed
  events so the preview is never empty. Date parsing is local-midnight to avoid
  timezone off-by-one in the tiles. Panels stack ≤860px; the date chip drops to
  its own row ≤420px.

**LeadershipTeaser (`src/components/sections/LeadershipTeaser/`)**
- Three featured desks — **President** (Smt. Dipali Bora), **Principal**
  (Dr. Mandira Saha) and **Academic Advisor** (Dr. Nilanjan Bhattacharjee) — as
  profile cards with a circular photo placeholder + gold quote-mark badge, name,
  role · qualifications, a one-line message excerpt and a **Read message** link
  to `/leadership#<slug>` (slug via `slugify`). Identity is read from
  `leadershipData`; the teaser carries its own short, neutral excerpts because
  the full desk messages remain TODO stubs until prompt 37 (so no "TODO:" leaks
  onto the page). Closes with a navy-outline **Meet our leadership** → `/leadership`.
  Cards stack to one column ≤860px.

**TestimonialsSection (`src/components/sections/Testimonials/`)**
- A **Swiper** carousel (1 / 2 / 3 slides per view) of alumni quotes from
  `testimonialsData` — navy gradient cards with a gold quote mark, quote, and an
  avatar + name + role footer; cards stretch to equal height. Autoplay is
  **pausable** (stops on hover/focus) and **disabled under reduced motion**;
  `rewind` is used instead of `loop` to avoid Swiper's "not enough slides" clone
  warning. Not-yet-written quotes (TODO stubs) are filtered out; an `<EmptyState>`
  covers the empty case.

**HomeCTASection (`src/components/sections/HomeCTA/`)**
- Full-width navy band with a soft gold accent glow: eyebrow, "Begin your
  journey at Icon Commerce College", a single warm-red **Apply Now** primary +
  a gold-outline **Download Prospectus** (both open the global lead drawer in
  the matching context) and a tertiary **Samarth portal** link (College Code 842,
  external). Keeps exactly one primary action per the design system; buttons
  stack full-width ≤520px.

**Home (`src/pages/Home/Home.jsx`)**
- Final order: Hero → Highlights → About → Vision/Mission → Programs → Stats →
  WhyChoose → Notices & Events → Leadership → Testimonials → CTA. Hero +
  Highlights stay eager (above the fold / LCP); every below-the-fold section is
  code-split with `React.lazy` + `Suspense` (the heavy Swiper carousel only
  loads with its section), each behind a height-reserving fallback to limit
  layout shift. Sections own their reveal-on-scroll entrance, so they are not
  double-wrapped in `<Reveal>`. Replaces the `ComingSoon` placeholder.

**Verification**
- `npm run build` passes (only the pre-existing `formatters.js`
  anonymous-default-export lint warning remains). Full page verified end-to-end
  at desktop / tablet / mobile with no horizontal overflow; the Notice Board
  panels were balanced so the "View all" links align and the empty gap was
  removed.

### Phase 2.3 — Home programs & why-choose

Thirteenth prompt of the rebuild (`prompts/13-home-programs-why-choose.md`). Adds
the undergraduate-programs teaser and the "why choose us" band to the Home page,
continuing the `src/components/sections/` group (prompts 11–14). All program data
(fees, slugs, durations, highlights) is read from `coursesData` — no figures are
hard-coded in the view.

**ProgramsSection (`src/components/sections/ProgramsSection/`)**
- Gold-eyebrow `Section` ("Programs" → "Undergraduate Programs (NEP 2020)") over a
  responsive **1 / 2 / 4-column** grid of the four programmes from `coursesData`
  (B.Com · BBA · BCA · B.A.), revealed with the centralized "shuttle" stagger via
  `<RevealGroup>` (reduced-motion safe). Closes with a navy-outline **View All
  Programs** link → `/courses`.
- **ProgramCard (`ProgramsSection/ProgramCard.jsx`)** — placeholder `course-*`
  image with a gold **shortName** badge (+ an optional "Most Popular" ribbon from
  `course.badge`), the program name, a duration row, the first three highlight
  ticks, and a **1st-semester fees** hint (`course.fees.total`). Two actions:
  a navy-outline **View Details** `<Link>` → `/courses/:slug` and a navy-filled
  **Apply** button that opens the global `apply-now` drawer pre-set to this
  program. Hover lift + gold accent border are CSS-only so they never fight the
  entrance transform; cards stretch to equal heights with actions bottom-aligned.

**WhyChoose (`src/components/sections/WhyChoose/`)**
- Split band: the `hero-students` placeholder with a floating **gold stat callout**
  ("Estd. 2004 · Affiliated to Gauhati University · NEP 2020") on the left, and a
  two-column grid of **six reason cards** on the right — Affiliated to Gauhati
  University · NEP 2020 outcome-based curriculum · Experienced & research-active
  faculty · Smart classrooms & computer lab · Digital library & study materials ·
  Scholarships & student support. Each reason is plain icon-card markup inside
  `<Reveal>`/`<RevealGroup>` (HighlightsSection precedent) so all motion routes
  through `useReducedMotionVariants()`. Split stacks ≤992px; reasons collapse to
  one column ≤540px.

**Preset-program wiring (lead drawer)**
- `LeadFormDrawer` now accepts a `programInterest` prop and forwards it to
  `UnifiedLeadForm`, and `PublicLayout` passes `drawerConfig.programInterest`
  through. Combined with `openLeadDrawer('apply-now', { programInterest })`
  (already spread into `drawerConfig` by `ModalContext`), a program card's
  **Apply** opens the drawer with the Program field pre-selected to that course's
  `shortName` (which matches the form's program options). General Apply CTAs
  (hero/header/footer) are unaffected — they open with no program preset.

**Home (`src/pages/Home/Home.jsx`)**
- Mounts `ProgramsSection` → `WhyChoose` between the stats band and the
  `ComingSoon` placeholder.

### Phase 2.2 — Home about, vision/mission & stats

Twelfth prompt of the rebuild (`prompts/12-home-about-vision-stats.md`). Adds the
"who we are" storytelling band, the vision & mission cards and the animated stats
counters to the Home page, continuing the `src/components/sections/` group
(prompts 11–14). All copy is condensed from the design-system College Profile /
prospectus messaging (§6) — no fabricated claims.

**AboutSection (`src/components/sections/AboutSection/`)**
- Two-column teaser: the `about-college-building` placeholder with a floating gold
  **Estd. 2004** badge (year from `collegeInfo.established`) on the left, and a
  condensed College Profile on the right — eyebrow "About the College", H2 "A
  legacy of quality higher education in Guwahati", three short prospectus-sourced
  paragraphs (Gauhati University · NEP 2020 FYUGP · B.Com/BBA/BCA/B.A · experienced
  faculty · smart classrooms, digital library, computer lab · study materials &
  seminars), four bullet ticks and a navy **Learn More** link → `/about`.
- Media slides in from the left while the copy reveals as a "shuttle" stagger via
  `<Reveal>`/`<RevealGroup>` (reduced-motion safe). Grid stacks to one column ≤900px.

**VisionMissionSection (`src/components/sections/VisionMission/`)**
- Two gold-accented cards — **Our Vision** and **Our Mission** — built on the
  prospectus Principal/President themes (excellence, holistic development, moral
  integrity, industry readiness). Each card has a gold top-bar accent and a gold
  icon chip; the Mission lists four commitments with gold check ticks.
- Rendered through the shared `Section` (`bg="white"`, centered eyebrow/title);
  the `vision-mission` placeholder sits alongside as a side accent on desktop and
  is dropped ≤768px.

**StatsSection (`src/components/sections/StatsSection/`)**
- Navy band (`Section bg="navy"`) of six gold figures from `statsData` — Since
  2004 · 4 UG Programs · 18+ Departments · 40+ Faculty · Gauhati University ·
  1000s Alumni. Numeric stats reuse `AnimatedCounter`; non-numeric stats render as
  static gold text. Each figure is a `<figure>`/`<figcaption>` with a light
  caption for AA contrast on navy. Grid is 3 → 2 columns.
- The year counter is rendered ungrouped (no thousands comma) so "Since 2004"
  reads correctly.

**AnimatedCounter (`src/components/common/AnimatedCounter/`)**
- Now `prefers-reduced-motion` aware: when reduced motion is preferred the count-up
  is skipped and the final value is shown immediately (design-system §4), satisfying
  the stats "reduced-motion shows final values" requirement.

**Home (`src/pages/Home/Home.jsx`)**
- Mounts `AboutSection` → `VisionMission` → `StatsSection` between the highlights
  strip and the `ComingSoon` placeholder.

### Phase 2.1 — Home hero & highlights

Eleventh prompt of the rebuild (`prompts/11-home-hero-and-highlights.md`). Builds
the first impression of the Home page: a navy-gradient hero over the campus
placeholder and a thin quick-highlights strip directly beneath it. Introduces the
new `src/components/sections/` group used to assemble the Home page (prompts
11–14).

**HeroSection (`src/components/sections/HeroSection/`)**
- Full-width `--gradient-hero` overlay over the `hero-campus` placeholder, with a
  subtle CSS Ken-Burns zoom that freezes under `prefers-reduced-motion`.
- Gold eyebrow ("Admissions Open 2026–27 · Affiliated to Gauhati University"),
  H1 from `collegeInfo.tagline` ("Where Knowledge Meets Character") and a subtitle
  built from the §1 secondary tagline + "Estd. 2004 · Guwahati, Assam."
- CTAs: warm-red **Apply Now** (→ `apply-now` drawer) and outline-gold **Download
  Prospectus** (→ `prospectus` drawer) via the shared `EnquiryButton`, plus an
  **Explore Courses** text link → `/courses`. Trust chips row (Gauhati University ·
  NEP 2020 · Samarth Code 842 · 4 UG Programs).
- Desktop right-side floating quick-enquiry card (compact `UnifiedLeadForm`,
  source `hero`); hidden ≤1024px where the Apply Now CTA carries lead capture.
- Staggered "shuttle" entrance (eyebrow → headline → subtitle → CTAs → chips)
  routed through `useReducedMotionVariants()` so it collapses to static when
  reduced motion is preferred. The H1 sets an explicit white colour so the global
  `h1` navy-ink rule can't win.

**HighlightsSection (`src/components/sections/HighlightsSection/`)**
- Thin strip of four icon cards (NEP 2020 FYUGP · 4 UG Programs · Experienced
  Faculty · Modern Campus & Labs) with gold icon chips and a CSS hover lift.
- Revealed with the centralized `RevealGroup` stagger; the entrance lives on the
  outer `Reveal` and the hover lift on the inner card so the two never fight over
  `transform`. Grid is 4 → 2 → 1 columns at the §3 breakpoints.

**Home (`src/pages/Home/Home.jsx`)**
- Mounts `HeroSection` + `HighlightsSection` at the top (replacing the placeholder
  `PageHero`); `ComingSoon` stays for the sections still to be assembled.

### Phase 1.4 — SEO foundation & schema

Tenth prompt of the rebuild (`prompts/10-seo-foundation.md`). Adds per-route SEO
(titles/description/canonical/OG + Twitter), schema.org structured data for an
educational institution, and refreshed static SEO files. The canonical domain is
standardised to the non-`www` form `https://iconcommercecollege.in` everywhere.

**SEO config (`src/config/seo.js`)**
- Expanded the `pages` map to **every route in §5** (home, about, leadership,
  courses, departments, faculty, facilities, gallery, admissions, notices,
  events, contact) with `title` / `description` / `keywords` and a short `crumb`
  label for breadcrumbs. `thankYou`, `notFound` and `admin` are `noindex`.
- `siteUrl` / `organization.url` set to `https://iconcommercecollege.in`;
  `alternateName` set to **"ICC"**; `sameAs` left as a TODO for the official
  Facebook / YouTube URLs. Added a fees FAQ entry; opening hours aligned to
  09:30–16:30 (Mon–Sat).

**SEO utilities (`src/utils/seo.js`)**
- New `generateWebSiteSchema()` (WebSite + SearchAction) and
  `generateCourseSchema(course)` (Course + CourseInstance + application Offer).
- New route engine: `resolvePageSeo(pathname)`, `buildBreadcrumbs(pathname)`,
  `absoluteUrl()`, and a central `applySeo(pathname)` that sets all meta + the
  per-route JSON-LD (WebPage, BreadcrumbList, FAQPage on Home/Admissions, Course
  on `/courses/:slug`) and strips every schema on `/admin`.
- Per-page **override store** (`setSeoOverride` / `clearSeoOverride` /
  `getSeoOverride`) so pages can contribute overrides that merge over route
  defaults. `injectDefaultSchemas()` now injects the site-wide schemas
  (Organization, LocalBusiness, WebSite) once; logos resolved to absolute URLs.

**SEOHead + useSeo (`src/components/common/SEO/`)**
- `SEOHead.jsx` is now a thin wrapper: injects site-wide schemas once and calls
  the new `useSeo` hook so all routes are covered globally. It also accepts
  override **props**.
- New `useSeo(overrides)` hook (and folder `index.js`) for Phase 2 pages to pass
  `{ title, description, image, schema, faqs }`; page effects run after the
  global one so page values win.

**Static files**
- `public/sitemap.xml` — all 16 public routes incl. the 4 course slugs.
- `public/robots.txt` — allow all, disallow `/admin` + `/thank-you`, sitemap +
  host on the non-`www` domain.
- `public/manifest.json` — name "Icon Commerce College", theme `#1A2A52`,
  favicon/apple-touch icons, and **shortcuts** (Courses, Admissions, Contact).
- `public/index.html` — OG/Twitter/canonical and the JSON-LD fallback updated to
  the non-`www` domain; added a WebSite + SearchAction fallback schema.

### Phase 1.3 — Lead drawer & floating CTAs

Ninth prompt of the rebuild (`prompts/09-lead-drawer-and-ctas.md`). Makes lead
capture reachable from anywhere — a polished side drawer, the restyled generic
modal, and floating contact actions — all driven by `ModalContext`.

**`ModalContext` (`src/context/ModalContext.jsx`)**
- Simplified `DRAWER_TITLES` to six college contexts, each setting
  `title` / `subtitle` / `source`: `apply-now` ("Apply for Admission 2026"),
  `enquiry` ("Course Enquiry"), `prospectus` ("Download Prospectus"),
  `callback` ("Request a Callback"), `visit` ("Book a Campus Visit"), and
  `default`. `openLeadDrawer` now records the preset's `source` on the lead
  (callers can still override via `extraData`).

**`LeadFormDrawer` (`src/components/common/LeadFormDrawer/`)**
- Now slides in from the **right** on desktop and presents as a **bottom-sheet**
  (rounded top, grab handle) on mobile (`< sm`), chosen via `useMediaQuery`.
- **Focus-trapped**: focus moves to the first field on open and Tab/Shift+Tab
  cycle stays within the drawer; closes on Esc / overlay click; body scroll-lock
  retained via `ModalContext`.
- Navy + gold header, hosts `UnifiedLeadForm`, and adds a trust line —
  "We'll never share your details." Backdrop recoloured to the navy overlay token.

**`Modal` (`src/components/common/Modal/`)**
- Restyled the backdrop to the navy overlay token (`--color-navy-overlay`),
  keeping the generic modal for legal / info / gallery / video use.

**`FloatingActions` (`src/components/common/FloatingActions/`)**
- Bottom-right stack (desktop): WhatsApp FAB now uses `whatsappHref()` from
  `collegeInfo` with a prefilled message, and a **gold** "Enquire" FAB →
  `openLeadDrawer('enquiry')`. Subtle entrance + hover; the Enquire FAB is hidden
  while the drawer is open. Hidden on mobile so it never overlaps the bottom nav
  (which already exposes Call / WhatsApp / Apply); `BackToTop` (navy) sits above.

**`EnquiryButton` (`src/components/common/EnquiryButton/`)** — new
- Reusable `<EnquiryButton preset=… source=… />` wrapper around the shared
  `Button` primitive that opens the lead drawer with the given preset and tracks
  the CTA. Sensible default labels per preset.

**Wiring**
- Footer's "Download Prospectus" CTA now opens the `prospectus` preset
  (was `download-brochure`). Header / PublicLayout keep `apply-now`.

### Phase 1.2 — Lead capture core

Eighth prompt of the rebuild (`prompts/08-lead-capture-core.md`). Adapts the proven
server-store lead pipeline to the Icon Commerce College fields, with anti-spam,
preset support and navy + gold dialogs — the public form, the submit util and the
shared PHP store stay wire-compatible with the existing admin panel.

**Field-key decision (`program_interest`)**
- The public form and `webhookSubmit` now use **`program_interest`** as the
  college-facing field name (design-system §8: B.Com / BBA / BCA / B.A. / Undecided).
- For backward compatibility the same value is ALSO persisted to the canonical
  server key **`service_interest`**, which the admin panel (`leadService`,
  `LeadManagement`, `Dashboard`, `LeadDetail`) and any already-stored leads read.
  `service_interest` remains the canonical admin key; `program_interest` is the new
  public field and the preset prop. Callers may pass either key — `webhookSubmit`
  maps and mirrors both. No admin/`leads.php` schema change was required.

**`UnifiedLeadForm` (`src/components/common/UnifiedLeadForm/`)**
- Fields are now the college set: `name` (req), `mobile` (req, Indian 10-digit),
  `email` (optional), `program_interest` select (B.Com · BBA · BCA · B.A. ·
  Undecided), `state` select (Assam default + NE India + Other), `message` (optional).
- New props: `compact` (tighter spacing for sidebars/drawers), `onSuccess` (called
  with the submitted data; `onSubmitSuccess` kept as a legacy alias) and
  `programInterest` (preset the program select, e.g. from a course page).
- **Honeypot** anti-spam field (`company`) — visually hidden, removed from tab order
  and the a11y tree; populated submissions are silently dropped (no server write).
- Inline, accessible validation routed through the shared validators; loading +
  disabled states retained.

**`webhookSubmit` (`src/utils/webhookSubmit.js`)**
- Payload builder maps `program_interest` → `service_interest` (mirrors both),
  strips the honeypot, and keeps the `POST /api/leads.php?action=create` flow,
  UTM/gclid capture, `lead_id`, `status: 'new'`, `submitted_at`, `notes`, `activity`
  and cross-device dedupe-by-mobile unchanged. No PII is logged.

**`validators` (`src/utils/validators.js`)**
- Added `getProgramInterestErrorMessage`, `getStateErrorMessage` and
  `getOptionalMessageErrorMessage`; `validateLeadForm` now treats email and message
  as optional and validates program/state (toggle via `requireCourseFields`).

**`leads.php`** — header documents the college lead-record shape; endpoints, merge
and file-locking logic unchanged (`program_interest` / `state` persist as-is).

**`swalHelper`** — success/error/info dialogs restyled to navy + gold (gold icons,
navy confirm button with gold trim, Poppins title); error icon uses warm red.

**Styling** — the form's primary CTA gradient moved from teal to **warm red**
(design-system §2: the single primary action per view); Footer quick-enquiry strip
now sends `program_interest`.

### Phase 1.1 — UI primitives & motion helpers

Seventh prompt of the rebuild (`prompts/07-ui-primitives.md`). Adds the shared, DRY
building blocks every page composes from, plus the centralized animation ("shuttle")
helpers — all in the Navy + Gold system and guarded by `prefers-reduced-motion`.

**Motion helper (`src/utils/motion.js`)** — new
- Centralized Framer Motion variants: `fadeUp`, `fadeIn`, `scaleIn`, `slideInLeft` /
  `slideInRight` and a `staggerContainer(stagger = 0.08)` parent (design-system §4:
  opacity 0→1 / translateY 24px→0, 0.5s, ease `[0.22, 1, 0.36, 1]`).
- `useReducedMotionVariants()` hook returns static (no-op) variants when
  `prefers-reduced-motion: reduce` is set, so every animation degrades gracefully.

**New components (`src/components/common/`)**
- **`Reveal/`** — `Reveal` (single reveal-on-scroll block) and `RevealGroup`
  (auto-wraps/staggers children — the "shuttle" cascade); both route through the
  motion helper.
- **`Container/`** — centered max-width wrapper (`default` 1200px / `wide` 1320px /
  `narrow` / `fluid`) with the standard page gutters.
- **`Section/`** — vertical-rhythm section (`clamp` padding) with optional `bg`
  (`light` | `white` | `navy` | `gold-soft`), inner `Container` and an optional
  eyebrow + `SectionTitle` header.
- **`Breadcrumbs/`** — schema-friendly trail (home icon + chevrons, gold hover) that
  emits `BreadcrumbList` JSON-LD; `light` / `dark` variants.
- **`Accordion/`** — accessible expand/collapse (`aria-expanded` / `aria-controls`,
  single- or multi-open) with height-animated panels.
- **`Tabs/`** — WAI-ARIA tablist (roving Arrow/Home/End keys, `role="tab"`/`tabpanel`)
  with an animated gold "shuttle" underline; `underline` / `pill` variants.
- **`EmptyState/`** — gold icon chip + title + description + optional CTA for empty
  notices/events lists.

**Enhanced existing primitives**
- **`Button`** — added `navy`, `gold` and `link` variants alongside the existing set
  (legacy variants retained for backward compatibility).
- **`Card`** — added generic sub-variant exports `IconCard`, `ImageCard`, `ProfileCard`
  (avatar + name + role) and `StatCard`; specialized `ProgramCard` / `NoticeCard` /
  `EventCard` will extend these in their page prompts.
- **`SectionTitle`** — added a plain gold uppercase `eyebrow` label (design-system §3)
  next to the legacy pill `badge`.
- **`PageHero`** — promoted from the Phase 0.4 placeholder to the full inner-page hero:
  navy gradient over a labelled placeholder background image, optional breadcrumb,
  eyebrow, title + subtitle and an optional CTA. Backward compatible with the existing
  `eyebrow` / `title` / `subtitle` prop shape.

**Demo / verification**
- **`src/pages/UIKit/UIKit.jsx`** — a scratch preview page composing Section +
  SectionTitle + Card grid + Button + PageHero + Accordion + Tabs + EmptyState +
  Reveal/RevealGroup. Registered at `/ui-kit` **only in development** (excluded from
  production routes); `npm run build` compiles cleanly with no warnings.

### Phase 0.6 — Footer

Sixth prompt of the rebuild (`prompts/06-footer.md`). Replaces the boilerplate footer with
a polished, informative multi-column footer in the Navy + Gold system, driven by
`collegeInfo` and `navigation.js`.

**Footer (`src/components/common/Footer/`)** — full rebuild
- **Inline enquiry mini-strip** at the top of the footer: a mobile (required, validated as a
  10-digit Indian number) + optional email field that submits straight to the shared lead
  store via `submitLeadToWebhook` with `source: 'footer'`, including duplicate handling and
  inline success/error feedback.
- **Top band (navy gradient)** with five columns:
  - **About** — logo + wordmark (English + Assamese), two-line description and
    Facebook / YouTube / Instagram social icons (TODO URLs from `collegeInfo.social`).
  - **Quick Links** — About, Courses, Departments, Admissions, Gallery, Contact (`react-router` `Link`).
  - **Programs** — B.Com / BBA / BCA / B.A. linking to each `/courses/:slug`.
  - **Reach Us** — full tappable address (opens Google Maps), both phones as click-to-call,
    `mailto:` email, office hours and a WhatsApp chat chip.
  - **Admissions** — Samarth portal pill (College Code 842), a "Download Prospectus" button
    (opens the lead drawer `download-brochure`), an "Apply Now" warm-red CTA and a small
    map thumbnail (`map-location.svg` placeholder) linking to Google Maps.
- **Affiliation strip** — gold-bordered badge chips: "Affiliated to Gauhati University ·
  NEP 2020 / FYUGP · Samarth Code 842 · Estd. 2004".
- **Bottom bar** — dynamic copyright, **Privacy Policy** and **Terms of Use** links opening a
  Framer-Motion modal with placeholder legal copy, and a discreet **Admin** link to
  `/admin/login`.
- Fully responsive (5 → 3 → 2 → 1 columns at 1024 / 768 / 640), GTM tracking on phone /
  WhatsApp / CTA clicks, `prefers-reduced-motion`-guarded reveal, focus states and print styles.

### Phase 0.5 — Header, dropdown nav & mobile menu

Fifth prompt of the rebuild (`prompts/05-header-navigation.md`). Replaces the temporary
hash-based CIT header with a professional, route-based, sticky multi-page header plus a
rebuilt mobile drawer and bottom nav — all driven by `src/data/navigation.js` and
`collegeInfo`, in the Navy + Gold system.

**Header (`src/components/common/Header/`)** — full rebuild
- Slim navy **utility bar** (desktop): address + click-to-call phone on the left; email,
  Facebook/YouTube/Instagram social icons and a gold **"Samarth Admission Portal ↗"** pill
  on the right. Collapses (and drops out of the tab order) once the user scrolls.
- **Main bar**: logo placeholder + wordmark "Icon Commerce College" with the Assamese
  subtitle; centred desktop nav from `navigation.js` using `NavLink` with an animated
  gold **"shuttle" underline** for the active/hover item.
- Accessible **dropdowns** (About ▾ / Courses ▾): open on hover *and* keyboard focus,
  `aria-haspopup`/`aria-expanded`, Esc to close, close on focus-out, Framer-Motion
  fade/slide (static when `prefers-reduced-motion`).
- Warm-red **"Apply Now"** CTA opens the lead drawer (`openLeadDrawer('apply-now')`).
- **Sticky behaviour**: transparent over the Home hero at the top, solidifies to white +
  shadow on scroll (scroll listener); always solid on inner routes (via `useLocation`).
- Below `lg` the nav collapses to a hamburger that toggles the shared `MobileDrawer`.

**MobileDrawer (`src/components/common/MobileDrawer/`)** — full rebuild
- Slide-in (right) MUI `Drawer` (focus-trapped) with the full route nav tree, **collapsible
  submenus** (single-open accordion, auto-expands the section for the current route),
  contact block (phone / email / WhatsApp / address), Samarth pill and the Apply Now CTA.
- Closes on route change (`useLocation`); honours `prefers-reduced-motion`.

**MobileNavigation (`src/components/common/MobileNavigation/`)** — full rebuild
- Sticky bottom bar: **Home · Courses · Apply (centre warm-red CTA) · Notices · Menu**.
  Route items use `NavLink` with a gold active state; Apply opens the lead drawer, Menu
  toggles the drawer.

**Wiring & data**
- `PublicLayout.jsx` — passes the new Header props, switches the mobile breakpoint to `lg`
  (so the header hamburger, bottom nav and drawer appear together) and updates the drawer
  props (`onApply`, single toggle).
- `navigation.js` — added an "All Programs" overview entry to the Courses dropdown.

### Phase 0.4 — Multi-page routing scaffold

Fourth prompt of the rebuild (`prompts/04-routing-scaffold.md`). Converts the single-page
app into a proper multi-page router: a shared public layout, lazy-loaded page shells,
route-change scroll handling and a friendly 404 — so later prompts only need to fill in
each page's content.

**Layout & routing infrastructure (`src/components/layout/`)**
- `PublicLayout.jsx` — shared public chrome: `<Header/>` + `<main>` (`<Outlet/>` wrapped in
  a `<Suspense>` boundary with the shared `<PageLoader/>`) + `<Footer/>` + global lead
  drawer + floating enquiry/WhatsApp + back-to-top + mobile bottom nav/drawer.
- `ScrollToTop.jsx` — on navigation, scrolls to top on PUSH/REPLACE, defers to the browser
  on back/forward (POP), and smooth-scrolls to a hash anchor (with header offset, retrying
  once for lazily-mounted targets).
- `PageLoader.jsx` — shared navy-spinner `<Suspense>` fallback.

**Reusable chrome (`src/components/common/`)**
- `BackToTop/` — extracted from the old inline App.jsx button.
- `FloatingActions/` — desktop-only floating WhatsApp + Enquiry stack (hidden on mobile,
  where the bottom nav covers these actions).
- `PageHero/` — lightweight navy hero **placeholder** (same `eyebrow`/`title`/`subtitle`
  prop shape the full prompt-07 hero will use).
- `ComingSoon/` — shared "under construction" body for the page shells.

**Page shells (`src/pages/<Name>/<Name>.jsx`)** — Home, About, Leadership, Courses,
CourseDetail, Departments, Faculty, Facilities, Gallery, Admissions, Notices, Events,
Contact and NotFound. Each renders `<PageHero/>` + `<ComingSoon/>` and sets its
`document.title` via the new `src/hooks/useDocumentTitle.js`. `CourseDetail` reads the
`:slug` param via `getCourseBySlug()` and renders the 404 for unknown slugs.

**Router (`src/App.jsx`)** — refactored to nest all public routes under `<PublicLayout/>`
with `React.lazy` code-splitting (route list below); `/thank-you` and `/admin/*` stay as
standalone Suspense-wrapped routes; `*` → `<NotFound/>`. Removed the old all-in-one
`HomePageContent`, the inline back-to-top button and the global lead-drawer wrapper (now
in `PublicLayout`). `ScrollProgressIndicator`, the skip-link, `SEOHead` and
`EngagementTracker` are retained.

**Route list**

| Path | Page | Notes |
|------|------|-------|
| `/` | Home | index route |
| `/about` | About | |
| `/leadership` | Leadership | |
| `/courses` | Courses | |
| `/courses/:slug` | CourseDetail | `b-com` / `bba` / `bca` / `b-a`; unknown slug → 404 |
| `/departments` | Departments | |
| `/faculty` | Faculty | |
| `/facilities` | Facilities | |
| `/gallery` | Gallery | |
| `/admissions` | Admissions | |
| `/notices` | Notices | |
| `/events` | Events | |
| `/contact` | Contact | |
| `/thank-you` | ThankYou | noindex, standalone |
| `/admin/login`, `/admin/*` | Admin | protected, noindex |
| `*` | NotFound | friendly 404 |

### Phase 0.3 — Content data layer

Third prompt of the rebuild (`prompts/03-content-data-layer.md`). Encodes ALL college
content from `prompts/00-DESIGN-SYSTEM.md` §6 as structured, pure (no-React) data
modules so pages stay data-driven. Every image field references a §7 placeholder via
`placeholder()` from `src/utils/assets.js`; unknown values use `'TODO: …'` literals.

**New `src/data/` modules**
- `collegeInfo.js` — identity & contact object (name, Assamese name, taglines,
  established 2004, Icon Academy Trust, Gauhati University, Samarth code 842 + portal
  URL, full address + parts, phones, email, maps query, hours). Helpers `phoneHref`,
  `whatsappHref`, `emailHref`.
- `navigation.js` — header menu tree (About & Courses dropdowns), `navCta` (Apply Now),
  and footer link groups, matching the §5 site map.
- `coursesData.js` — 4 FYUGP programs (B.Com / BBA / BCA / B.A.) with exact §6 fees
  breakdowns (totals ₹10,900 / ₹11,000, monthly ₹1,800/₹2,000, application ₹300),
  eligibility, highlights, careers, documents and badges. `getCourseBySlug()` helper.
- `departmentsData.js` — `streams[]` (Arts 7 / Commerce 7 / Science 4 subjects) with
  blurbs and slugged subjects.
- `leadershipData.js` — 7 "From the Desk of …" holders (President & Principal
  `featured`); message copy stubbed as `TODO` until prompt 37.
- `facilitiesData.js` — 10 campus facilities (Iconify icon + title + blurb).
- `statsData.js` — 6 animated counters; soft numbers flagged `approximate`.
- `admissionData.js` — 4-step Samarth process, eligibility/fees notes, prospectus info.
- `facultyData.js` — 8 seed staff (full list in prompt 37); placeholder photos.
- `testimonialsData.js` — 6 alumni voices (one `TODO` quote pending transcription).
- `galleryData.js` — 12 placeholder photos (categorised) + 3 seed videos
  (`youtubeId: 'TODO'`).
- `seedNotices.js` / `seedEvents.js` — fallback content matching the prompt 28/30 API
  record shapes (2 seed notices; the 4 signature events — College Week, Cooking
  Competition, ICON Shield, ICON Trophy).
- Removed superseded generic stub files (`featuresData.js`, `locationData.js`,
  `servicesData.js`, `serviceDetailsData.js`) — replaced by the named modules above.

**TODO values needing client input:** social URLs (Facebook / YouTube / Instagram),
gallery YouTube video IDs, prospectus PDF URL, leadership message excerpts, remaining
faculty qualifications & list, one alumni quote. Soft stats (18+ departments, 40+
faculty, 1000s alumni) flagged `approximate` for verification.

### Phase 0.2 — Design tokens, typography & placeholder system

Second prompt of the rebuild (`prompts/02-design-system-tokens.md`). Implements the
visual foundation defined in `prompts/00-DESIGN-SYSTEM.md` §2–4, §7.

**Design tokens (Navy + Gold)**
- Rewrote `src/styles/variables.css` with the full §2–4 token set: canonical
  `--color-*` palette, signature gradients (`--gradient-navy/gold/hero`), the §3
  type scale (h1 `clamp(2rem,4vw,3.25rem)` … body `1rem/1.7`, eyebrow tracking
  `0.12em`), §4 spacing (4–96px), radii (cards 16 / buttons 10 / pills 999 /
  inputs 10), shadows (`--shadow-sm/md/lg`) and motion (`--ease-shuttle`,
  reveal 0.5s / 24px / 0.08s stagger). Container widths set to 1200/1320px.
  Legacy alias variables (`--accent-gold`, `--primary-dark`, `--accent-orange`,
  admin tokens, etc.) are remapped onto the new palette so existing
  `*.module.css` keeps rendering.
- Mirrored the palette in `src/theme/muiTheme.js`: `primary` Deep Navy `#1A2A52`,
  `secondary` Gold `#C8A04D`, `error` Warm-Red CTA `#E0301E`, `success` `#1E8E5A`,
  background `#F7F8FB` / paper `#FFFFFF`, text `#14233D`/`#5B6678`. Added a `gold`
  palette + `navy` scale, responsive Poppins/Inter typography, `shape.borderRadius:10`,
  shadow scale aligned to §4, and component overrides — Button (radius 10, navy
  `containedPrimary`, gold `containedSecondary`, red-gradient `containedError` CTA,
  gold focus ring), Card (radius 16, shadow-sm, lift to shadow-md).

**Global styles & fonts**
- `src/styles/global.css`: body now `--color-bg` / `--color-text` at `1.7`
  line-height; links navy → gold hover; navy text selection; added the
  `.eyebrow` label utility; aligned the font `@import` to the loaded weights.
- `public/index.html`: Google Fonts trimmed to **Poppins 600/700** + **Inter
  400/500/600** (preload + noscript). Title, meta description, `theme-color`
  `#1A2A52` and the navy/gold initial-loader were already in place from 0.1.

**Colour migration (grep clean)**
- Replaced every remaining old CIT hex across the source tree — `#0C2D48`→`#1A2A52`,
  `#081F33`→`#111d3a`, `#1A5276`→`#2C3E6B`, `#D82618`→`#E0301E` — in
  UnifiedLeadForm, Modal, MobileDrawer, MobileNavigation, LeadFormDrawer,
  AdminTopbar, LeadDetail, App.css, swalHelper, ThemeContext and the ThankYou
  page/confetti (now navy/gold/red/green). `grep` for `#0C2D48`/`#D82618` is clean.

**Placeholder image system (§7)**
- Added `scripts/gen-placeholders.mjs` (Node ESM, no deps) + the
  `gen:placeholders` npm script. It writes a labelled navy/gold SVG (gold border,
  centered white filename + dimensions, IC mark) for every §7 asset, with a
  curated logo lockup. `npm run gen:placeholders` (re)creates all files.
- Generated **49** placeholders into `public/images/placeholders/` (+ `.gitkeep`):
  logo, favicon, hero-campus/students/library, about-college-building/campus-aerial,
  vision-mission, 7 leadership portraits, course-bcom/bba/bca/ba, dept-arts/commerce/science,
  6 facility-*, faculty-placeholder, gallery-1…12, 4 event-*, testimonial-avatar,
  prospectus-cover, map-location, og-default. SVGs are saved as `<base>.svg`.
- Added `src/utils/assets.js` exporting `placeholder(name)` (resolves a logical
  name, with or without extension, to `/images/placeholders/<base>.svg`) and the
  `IMAGES` constant map, so components never hardcode image paths.

### Phase 0.1 — Rebrand & cleanup (remove CIT + ad-tech)

First prompt of the Icon Commerce College rebuild (`prompts/01-rebrand-and-cleanup.md`).
Converts the CIT engineering-admissions boilerplate into a clean Icon Commerce
College foundation.

**Project metadata**
- Renamed package to `icon-commerce-college`; updated description, keywords, author.
- Rewrote `CLAUDE.md` and `README.md` for the new multi-page college site + admin;
  both now point to `prompts/00-DESIGN-SYSTEM.md` as the single source of truth.
- Reset `.env` / `.env.example` to Icon Commerce College contact info and lead
  defaults; removed all Meta/Google-Ads/conversion variables; added
  `REACT_APP_NOTICES_API_URL` and `REACT_APP_EVENTS_API_URL`; blanked GTM.

**Removed ad-tech stack (lean analytics decision)**
- Deleted `src/utils/metaPixel.js`, `metaCAPI.js`, `googleAds.js`,
  `enhancedConversions.js`, `gclidManager.js`, `consentMode.js`, `eventDedup.js`,
  and `src/admin/utils/googleAdsExport.js`.
- Deleted `public/api/meta-capi.php` and `public/api/google-offline-conversions.php`.
- Removed all imports/usages (App.jsx initializers, UnifiedLeadForm tracking,
  LeadDetail Meta-CAPI conversion feature, LeadManagement Google-Ads export).
- GTM (`gtm.js` / `useGTMTracking`) kept and now no-ops cleanly unless
  `REACT_APP_GTM_ID` + `REACT_APP_ENABLE_ANALYTICS` are set; the hardcoded GTM
  container snippet was removed from `index.html`.

**Removed CIT / engineering content**
- Deleted all CIT landing-page sections (`HeroSection`, `AboutSection`,
  `ServicesSection`, `StatsSection`, `FeaturesSection`, `LocationSection`,
  `CTASection`, `ContactSection`, `SecondaryCTASection`, `WhyChooseCIT`,
  `HighlightsSection`) — rebuilt fresh in Phase 2. The home route is now a
  minimal placeholder with an "Enquire Now" CTA.
- Deleted the unused legacy `LeadForm` wrapper and the CIT ad-tech admin
  **Guideline** module (`Guideline.jsx` + `guidelineContent/`) per the design doc.
- Emptied `src/data/*` content files to stubs (`export const x = []`), repopulated
  in prompt 03.

**Rebranded to Icon Commerce College (Navy + Gold, Gauhati University)**
- Header, Footer, MobileDrawer, MobileNavigation, ModalContext, LeadFormDrawer,
  UnifiedLeadForm, ThankYou, SEO config, theme/variables comments, `index.html`,
  `manifest.json`, `robots.txt`, `sitemap.xml`, and admin chrome
  (AdminLogin/AdminTopbar/Dashboard) now use Icon Commerce College branding,
  contact info, and a placeholder SVG logo
  (`/images/placeholders/logo-icon-commerce.svg`).
- Lead program options changed to B.Com / BBA / BCA / B.A.

**Known deferred items** (handled in later prompts): full Navy + Gold token
migration (prompt 02), multi-page routing (prompt 04), Header/Footer redesign
(prompts 05/06), college lead-form restructure (prompt 08), full SEO/schema
(prompt 10). The tele-calling admin module and the stale `CUSTOMIZATION_GUIDE.md`
/ `GTM_GUIDE.md` are left for Phase 3 / prompt 39 respectively.


### Server-side leads as the single source of truth (cross-device sync fix)

**Fixed**
- Leads now sync correctly across every browser and device. The public form
  writes each submission directly to the shared server store
  (`public/api/leads.php`), and the admin panel reads/writes only the server
  (auto-refreshing every 15s). Previously leads were kept in per-browser
  `localStorage` and never reliably reached the server, so the admin panel
  showed different data on different devices.
- `webhookSubmit.js` now `POST`s straight to `/api/leads.php?action=create`
  and reports honest success/failure; the lead is no longer stored only in the
  submitting browser.
- Duplicate prevention is now server-side (by mobile number), so it works
  across devices instead of per-browser.

**Removed**
- **Pabbly Connect** integration entirely — webhook URL, `USE_PABBLY` /
  `DUMMY_MODE` flags, the admin Pabbly mirror (`REACT_APP_ADMIN_PABBLY_WEBHOOK_URL`),
  `adminConfig.js`, the Pabbly setup guide tab, and `PABBLY_GUIDE.md`.
- All `localStorage` use for lead data (`lp_submitted_leads` / `lp_test_leads`).
  Per-device essentials (admin login session, theme preference, Google Ads
  gclid attribution) still use `localStorage` by design.

**Notes**
- Meta Pixel / CAPI and Google Ads tracking are kept (env-driven, IDs blank —
  ready for CIT's own Pixel/Ads IDs). No third-party/other-client IDs remain.
- Added a "Lead Storage" tab to the admin Guideline page documenting the new
  architecture.

## [1.0.0] - 2026-04-01

### Converted from Brand-Specific to Generic Boilerplate

**Content & Branding**
- Replaced all brand-specific text (company names, taglines, descriptions) with generic placeholder content
- Replaced all product images with `placehold.co` placeholder images
- Replaced all logo references with placeholder logo URLs
- Updated all contact info to generic `+91-XXXXXXXXXX` / `info@yourbusiness.com` patterns
- Updated all social media links to empty/placeholder values

**Data Files Renamed & Genericized**
- `servicesData.js` — Generic service/plan card data
- `serviceDetailsData.js` — Generic detailed service information
- `featuresData.js` — Generic feature categories and items
- `statsData.js` — Generic statistics/highlights
- `locationData.js` — Generic location and contact data

**Admin Panel (New)**
- Built admin authentication system with login page at `/admin/login`
- Created admin dashboard at `/admin/dashboard` with lead analytics
- Created admin layout with sidebar navigation and topbar
- Protected routes require authentication via `ProtectedRoute` component
- Admin credentials configurable via `.env` variables

**Lead Management System — LMS (New)**
- Built full-featured Lead Management page at `/admin/lms`
- Lead table with search, filter by status, sort, and pagination
- Status management (New, Contacted, Qualified, Converted, Lost)
- Notes system for adding per-lead notes
- CSV export functionality for offline use
- Google Ads offline conversion export format
- Conversion tracking data (mark as converted with value)
- Leads stored in localStorage (easily replaceable with backend API)

**GTM Integration (New)**
- Integrated Google Tag Manager with `initGTM()` utility
- Created `useGTMTracking` hook for automatic page-level tracking
- DataLayer events: `page_view`, `cta_click`, `generate_lead`, `scroll_depth`, `section_view`
- Engagement tracking via `EngagementTracker` component
- Google Consent Mode v2 support via `consentMode.js`
- Created `GTM_GUIDE.md` documentation

**Meta Conversions API — CAPI (New)**
- Browser-side Meta Pixel tracking via `metaPixel.js`
- Server-side CAPI endpoint at `public/api/meta-capi.php`
- Event deduplication via `eventDedup.js` (shared event IDs between browser & server)
- Test Event Code support for debugging in Meta Events Manager

**Google Ads Conversion Tracking (New)**
- Browser-side gtag.js conversion tracking via `googleAds.js`
- GCLID capture and persistent storage via `gclidManager.js`
- Enhanced conversions support via `enhancedConversions.js`
- Offline conversion import CSV export via `googleAdsExport.js`

**SEO System (New)**
- Dynamic SEO head management via `SEOHead` component
- Configurable schemas in `src/config/seo.js`
- JSON-LD structured data: Organization, LocalBusiness, FAQPage, BreadcrumbList, WebPage
- Proper meta tags, Open Graph, Twitter Cards in `index.html`
- `robots.txt` with admin route exclusions
- `sitemap.xml` template
- Created `SEO_GUIDE.md` documentation

**Webhook & Form System**
- Pabbly Connect webhook integration in `webhookSubmit.js`
- Dummy mode for local testing without webhook
- Lead duplicate prevention
- Multiple form sources tracked (hero, contact, drawer, secondary CTA)
- UTM parameter capture and GCLID enrichment
- Created `PABBLY_GUIDE.md` documentation

**Infrastructure & Performance**
- React 18 with concurrent features and lazy loading
- Idle-time section preloading via `requestIdleCallback`
- Error boundaries per section
- Web Vitals monitoring
- CSS Modules for component-scoped styles
- CSS custom properties in `variables.css`
- Responsive design with mobile-first approach
- PWA manifest and service worker support

**Files Added**
- `src/admin/` — Complete admin panel (components, pages, context, utils)
- `src/components/common/SEO/SEOHead.jsx` — Dynamic SEO management
- `src/components/common/EngagementTracker/EngagementTracker.jsx` — Analytics tracker
- `src/components/common/LeadFormDrawer/` — Slide-in lead form drawer
- `src/config/seo.js` — SEO configuration
- `src/hooks/useGTMTracking.js` — GTM tracking hook
- `src/utils/gtm.js` — GTM initialization
- `src/utils/consentMode.js` — Google Consent Mode
- `src/utils/metaPixel.js` — Meta Pixel helpers
- `src/utils/metaCAPI.js` — Meta CAPI client
- `src/utils/googleAds.js` — Google Ads tracking
- `src/utils/gclidManager.js` — GCLID persistence
- `src/utils/enhancedConversions.js` — Enhanced conversions
- `src/utils/eventDedup.js` — Event deduplication
- `public/api/meta-capi.php` — Server-side CAPI endpoint
- `public/api/google-offline-conversions.php` — Offline conversions endpoint
- `public/api/config.example.php` — API config template
- `PABBLY_GUIDE.md` — Pabbly webhook setup guide
- `GTM_GUIDE.md` — Google Tag Manager setup guide
- `SEO_GUIDE.md` — SEO configuration guide
- `CUSTOMIZATION_GUIDE.md` — Quick-start customization guide
- `CHANGELOG.md` — This file

**Dependencies Added**
- `canvas-confetti` — Thank You page confetti animation
- `react-router-dom` v7 — Client-side routing
- `react-intersection-observer` — Scroll-triggered animations
- `sweetalert2` + `sweetalert2-react-content` — Success/error modals
- `swiper` — Mobile carousels
- `@iconify/react` — MDI icon system
- `@mui/lab` — MUI experimental components
- `web-vitals` — Performance monitoring
