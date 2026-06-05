# Changelog

All notable changes to the Icon Commerce College website project.

## [Unreleased]

### Phase 3.4 — Notices API store

Twenty-eighth prompt of the rebuild (`prompts/28-notices-api-store.md`). A
server-side notices store that is the single source of truth for the notices
shown on the public site (Home notice board + `/notices`) and managed from the
admin panel. It mirrors `leads.php` exactly so every browser/device sees the
same notices — no localStorage copy. Wired to `REACT_APP_NOTICES_API_URL=/api/notices.php`
(already present in `.env`); consumed by `noticeService.js` (prompt 29) and the
public `useNotices()` hook (prompt 32).

**`public/api/notices.php`** — one file, four actions, JSON file store at
`api/data/notices.json` (flock-guarded read/write, `data/` auto-created on first
use and protected with a `.htaccess` "Deny from all", just like leads):
- `GET ?action=list` — **public, no auth** (the website reads notices here).
  Returns `published` notices, sorted **pinned-first then `date` desc**. When a
  valid `X-Admin-Key` is supplied it also returns **drafts** (`published=false`)
  so the admin panel can manage them.
- `POST ?action=create` — **admin key required**. Body `{ notice: {...} }`.
  Validates required `title` + `date` (400 otherwise); generates `id` (UUID v4),
  `created_at` and `updated_at` server-side when missing; coerces `pinned` /
  `published` to real booleans and an unknown `category` to `General`. Idempotent
  on a re-sent `id` (`duplicate: true`).
- `POST ?action=update` — **admin key required**. Body `{ id, patch: {...} }`.
  Last-write-wins merge with `id` / `created_at` immutable and `updated_at`
  refreshed; 404 if the `id` is unknown.
- `POST ?action=delete` — **admin key required**. Body `{ ids: [...] }`. Returns
  `removed` count.
- Record shape: `{ id, title, body, category (Admission|Examination|Event|General|Result|Holiday),
  date, pinned, published, attachment_url?, created_at, updated_at }`. Field-agnostic
  like leads — extra fields the client sends are stored untouched.
- **Auth** reuses the leads handshake (`config.php` → env → committed default
  matching `REACT_APP_LEADS_ADMIN_KEY`), so notices and leads always agree on the
  key. Responses are `{ success, notices|notice|error }` with 400/401/404/500
  codes; `503` if no key is configured. CORS + `OPTIONS` preflight handled.

**`.gitignore`** — the runtime data comment now reads "data stores (leads,
notices, events)" since `notices.json` joins `leads.json` under the
already-ignored `/public/api/data/`.

### Phase 3.3 — Admin lead management

Twenty-seventh prompt of the rebuild (`prompts/27-admin-lead-management.md`).
Adapts the proven Lead Management System to Icon Commerce College's admission
funnel — college statuses, the `program_interest` field, applicant quick
actions — and aligns the screen with the shared navy+gold admin UI kit. The
server-store sync (15s poll + `onLeadsChanged` + `BroadcastChannel`) is
unchanged.

**`leadStatus` (`src/admin/utils/leadStatus.js`)** — replaces the generic
consultation funnel (New · Hot · Warm · Cold · Seat Booked · Not Interested)
with the college admission funnel, the single source of truth for every admin
surface:
- **New · Contacted · Interested · Applying · Admitted · Not Interested**, each
  with a label + chip colour. Labels are kept short (the keys
  `application_started` / `admitted` are unchanged) so the inline status chip
  stays compact in the dense leads table.
- New `normalizeStatus()` folds legacy workflow keys
  (`consultation_booked` → `interested`, `procedure_scheduled` →
  `application_started`, `completed` → `admitted`) onto the current stages so
  stale records never render as a raw key or collapse to "New".
- `getStatusConfig()` / `statusLabel()` normalise first; `formatActivityAction()`
  also remaps legacy keys inside historical timeline text. `describeStatusChange()`
  retained.

**`leadService` (`src/admin/utils/leadService.js`)** — kept as-is except for
making `program_interest` flow through cleanly (prompt 08's field decision):
- `normalizeLead()` guarantees the canonical `program_interest` and the legacy
  `service_interest` mirror are always present and equal (preferring an existing
  `program_interest`), and normalises `status`, so every surface can read either
  key for any record.
- Search now matches on program interest; CSV export header is **"Program
  Interest"** (value reads `program_interest`); CSV import maps "Program
  Interest" / "Course Interested" / "Service Interest" → `program_interest` and
  mirrors both keys + normalises status on import.
- Conversion rate counts the `admitted` stage (was the now-removed `completed`).

**`LeadManagement` (`src/admin/pages/LeadManagement.jsx` + `.module.css`)** —
`/admin/leads`:
- DataTable columns **Name · Mobile · Email · Program Interest · State · Source ·
  Status · Date** (the course column is now **Program Interest**, reading the
  canonical field). Search placeholder updated.
- Adopts the shared **`AdminPageHeader`** (gold eyebrow / navy title / icon) and
  four shared **`StatTile`**s (Total Leads · New Today · Conversion · Top Source),
  replacing the bespoke header and stat cards that still carried pre-rebrand
  boilerplate colours (a red-tinted "blue" stat icon, etc.).
- Active-filter chips and the selected-row highlight move from leftover
  blue/red tints to the navy palette.
- Filters (search · status · source · date range), bulk select → change
  status / delete (confirm dialog), inline status chips, CSV export/import,
  pagination and auto-refresh are all retained.

**`LeadDetail` (`src/admin/pages/LeadDetail.jsx` + `.module.css`)** —
`/admin/leads/:leadId`:
- **Quick Actions** card — one-tap **Call** (`tel:`), **WhatsApp**
  (`wa.me`, +91 prefixed) and **Email** (`mailto:`); each disables cleanly when
  the underlying mobile/email is absent.
- "Course Interested" → **Program Interest**; adds a **Last Updated** time
  alongside Submitted At. Editable status, append-only notes, activity timeline
  and source/UTM panel unchanged (all merge-safe via `leadService`).

**`Dashboard` (`src/admin/pages/Dashboard.jsx`)** — recent-leads table column
relabelled **Program** and reads `program_interest`, matching the new
terminology.

**Visual-QA fixes (desktop 1440 / tablet 834 / mobile 390 screenshots)**
- **Leads table no longer overflows** — the dense column set plus the long
  "Admitted / Seat Booked" inline status select pushed the table ~119px past its
  container on desktop, clipping the **Actions** column off-screen and truncating
  the **Date** column on tablet. Fixed by the shorter status labels, a compact
  "Program" header, tighter cell padding, a width-capped status select, and
  single-line/ellipsised Name + Email cells. All columns (incl. Actions) now fit
  at every breakpoint.
- **Tablet header/body alignment** — Source is now `hideTablet`, but the body
  Source cell was still rendered on tablet (it wasn't wrapped in the `!isTablet`
  guard like Email/Program), shifting the body one column out of step with the
  header. The body Source cell is now guarded too, so header and body line up.

### Phase 3.2 — Admin dashboard

Twenty-sixth prompt of the rebuild (`prompts/26-admin-dashboard.md`). Rebuilds
the admin home as an at-a-glance overview on the shared admin UI kit, replacing
the boilerplate holdover dashboard (which had stale pre-rebrand red accents and
no notices/events surface).

**`Dashboard` (`src/admin/pages/Dashboard.jsx` + `.module.css`, rebuilt)**
- **Header** — uses the shared `AdminPageHeader` (gold eyebrow / navy title)
  with a refresh button + live date pill in the actions slot.
- **Stat tiles** — six shared `StatTile`s: Total Leads · New Today · This Week ·
  Conversion % (from `getLeadStats()`), plus Upcoming Events and Active Notices
  counts. Navy/Gold/Green/Blue/Teal/Pink tones (Warm Red stays reserved for the
  single public CTA per design system §2).
- **Leads — last 7 days** — a lightweight pure-CSS bar chart (no chart dep) of
  daily lead counts, fed by a new `last7Days` series on `getLeadStats()`
  (local-midnight day buckets, DST-safe). `role="img"` with a summarising label.
- **Recent Admission Leads** — the six newest leads as a desktop table / mobile
  cards, each row linking to `/admin/leads/:leadId`, with status chips from the
  shared `leadStatus` config.
- **Quick actions** — Add Notice, Add Event (navy primary, route to the
  modules), Export Leads (CSV) and View Site (opens the public site in a new
  tab).
- **Upcoming Events** + **Latest Notices** mini-lists read the existing
  `useNotices()` / `useEvents()` hooks (seed data today; they switch to the live
  `notices.php` / `events.php` stores in prompt 32 without changing shape, so the
  dashboard goes fully live with no further edits here). Upcoming events filter
  to today-or-later with a soonest-event fallback so the preview is never empty.
- **Auto-refresh** — initial server sync, the 15s visibility-gated poll and the
  `onLeadsChanged` subscription keep tiles, chart and recent leads current.

**`getLeadStats()` (`src/admin/utils/leadService.js`)** — now also returns a
`last7Days` array (`{ key, label, count }`, oldest→newest) for the chart and
widens `recentLeads` from 5 to 6. No other consumers of these fields change.

**Visual-QA fixes (desktop 1440 / tablet 834 / mobile 390 screenshots)**
- **Conversion rate** — `getLeadStats()` counted a non-existent `converted`
  status, so the Dashboard + Lead Management "Conversion" stat always read 0%.
  Now counts `completed` ("Seat Booked"), the enrolled/won funnel stage.
- **Upcoming Events tile vs list** — the tile counted only not-yet-ended events
  while the mini-list fell back to showing past events, so the card could read
  "0" yet list four past events. The preview now derives from the same
  upcoming-only set as the tile, with a "No upcoming events scheduled." empty
  state, so they always agree.
- **Seed events refreshed** (`src/data/seedEvents.js`) — the four signature
  annual events were dated Jan–Apr 2026 (already past), leaving nothing
  genuinely "upcoming" on the dashboard or the public Events/NoticeBoard. Shifted
  to the upcoming 2026-27 session (ICON Shield Aug 2026 · College Week Sep 2026 ·
  Cooking Competition Nov 2026 · ICON Trophy Jan 2027).

### Phase 3.1 — Admin cleanup & shell

Twenty-fifth prompt of the rebuild (`prompts/25-admin-cleanup-and-shell.md`).
Strips the leftover CIT ad-tech admin modules and rebuilds the admin shell for
the college feature set (Leads · Notices · Events · Settings) with a Navy+Gold
sidebar layout and a reusable shared-UI kit that the Leads/Notices/Events
modules build on in the next prompts.

**Removed (CIT ad-tech modules)**
- Deleted the tele-calling module end-to-end: `src/admin/pages/TeleCalling.jsx`,
  `TeleCallDetail.jsx`, `src/admin/components/TelecallFormDialog.jsx`,
  `src/admin/utils/telecallService.js`, `telecallStatus.js` and the
  `public/api/telecalls.php` store.
- Dropped the unused `TELECALLS_API_URL` config from `src/utils/webhookSubmit.js`
  (and from `getConfig()`); no source references remain (grep-clean).

**Admin shell**
- **`AdminSidebar` (new)** — navy gradient sidebar with the five sections
  (Dashboard · Leads · Notices · Events · Settings), gold active indicator
  (left rule + gold icon/label), brand mark and footer. A fixed column on
  desktop; an off-canvas drawer with overlay on ≤1024px.
- **`AdminLayout`** — reworked into a sidebar + topbar + routed-content shell.
  Lazy-loads every page, warms the shared leads cache on mount (lead sync only),
  owns the mobile-drawer state and closes it on navigation. Routes:
  `/admin/dashboard`, `/admin/leads` (+`/admin/leads/:leadId`), `/admin/notices`,
  `/admin/events`, `/admin/settings` (unknown admin paths redirect to Dashboard).
- **`AdminTopbar`** — restyled to the section header: college name + current
  section title (derived from the route via `navItems.js`), a "View site" link,
  the logged-in user and logout, plus the hamburger that opens the drawer.
- **`navItems.js` (new)** — single source of truth for the admin nav; the sidebar
  renders it and the topbar derives the active section title from it.
- **Lead route rename** — the Leads list/detail moved from `/admin/lms` to
  `/admin/leads` (+`/admin/leads/:leadId`); Dashboard, LeadManagement and
  LeadDetail links updated to match.

**Auth** — `AdminAuthContext`, `adminAuth.js`, `ProtectedRoute` kept as-is (24h
localStorage session + remember-me, env credentials). `AdminLogin` restyled to a
navy+gold card (gold top rule, logo, lock CTA) with refreshed copy.

**Shared admin UI kit (`src/admin/components/ui/`, new)** — reused across modules:
`AdminPageHeader` (eyebrow/title/subtitle/actions), `StatTile` (metric card with
tones), `DataTable` (sortable, searchable, paginated, empty-state), `ConfirmDialog`
(MUI), `FormField` (labelled wrapper), `Toast` + `useToast` (MUI Snackbar). Barrel
`index.js` re-exports them.

**Placeholder module pages** — `Notices`/`Events` render the shared header + an
empty `DataTable` preview; `Settings` is functional (session StatTiles, read-only
endpoint config with copy-to-clipboard `Toast`, and a confirmed sign-out via
`ConfirmDialog`). Full publishing tools arrive in prompts 29/31/33.

**Responsive polish** (post screenshot QA across desktop/tablet/mobile) —
`DataTable` empty state now renders at card width outside the horizontal-scroll
area so its message is never clipped on narrow screens; the sidebar drawer brand
keeps "Icon Commerce" on one line (corner-anchored close button) to match
desktop; `StatTile` values truncate with an ellipsis instead of overflowing.

**Tokens** — added `--admin-accent-dark`, `--admin-accent-soft`, `--admin-cta`,
`--admin-cta-dark` to the admin palette in `src/styles/variables.css`.

### Phase 2.14 — Contact, Notices & Events (public)

Twenty-fourth prompt of the rebuild (`prompts/24-contact-notices-events.md`).
Replaces the `/contact`, `/notices` and `/events` `ComingSoon` shells with full,
responsive, dynamic-ready pages. Notices/Events read seed data through the
shared hooks now and switch to the live PHP stores in prompt 32 without page
changes (same record shapes).

**Shared date helpers (`src/utils/dateUtils.js`, new)**
- Dependency-free helpers shared by NoticeCard / EventCard / EventCalendar.
  Parses `YYYY-MM-DD` as **local** midnight (`parseISODate`) so dates never
  drift a day across time zones. Adds `formatLongDate`, `formatFullDate`,
  `formatDateRange` (single/same-month/same-year/cross-year), `formatTime` +
  `formatTimeRange`, `dateTile`, `isNew`, `isPastEvent`, `dayInEvent`,
  `toISOKey`, `startOfMonth`/`addMonths`/`isSameDay` and the month/weekday name
  tables.

**Hooks (`src/hooks/useNotices.js`, `src/hooks/useEvents.js`)**
- Now expose the list under **`items`** (the generic shape prompt 24 specifies)
  alongside the existing `notices` / `events` keys (same array reference), so the
  new pages use `items` while the Home NoticeBoard band stays untouched. Sorting
  is unchanged (notices: pinned first, then newest; events: soonest first).

**Contact (`src/pages/Contact/Contact.jsx` + `.module.css`)**
- **PageHero** "Contact Us" + breadcrumb. Two-column band: left = the shared
  `<UnifiedLeadForm source="contact">` (full fields incl. message); right = a
  navy details card from `collegeInfo` — address (→ Google Maps), both phones
  (click-to-call), email (mailto), office hours, a Samarth "College Code 842"
  pill, a WhatsApp chip and social icons (live once real URLs replace the
  `TODO`s, per the Footer convention).
- Full-width **embedded Google Map** (keyless `output=embed` iframe by
  `mapsQuery`) paired with a **"How to reach us"** card (Rajgarh Road, Chandmari)
  and an "Open in Google Maps" link.
- SEO via `useSeo()` (the LocalBusiness/CollegeOrUniversity JSON-LD with address,
  phone, hours and map is already injected site-wide by `<SEOHead/>`, so the page
  reuses it instead of emitting a duplicate).

**Notices (`src/pages/Notices/Notices.jsx` + `.module.css`, `NoticeCard.jsx` + `.module.css`)**
- **PageHero** "Notices & Announcements" + breadcrumb. Control bar: search box
  (title + body) and category filter chips (derived from the data). List of
  `NoticeCard`s (pinned first, then newest — ordering owned by `useNotices()`)
  with a **"Load more"** pager (6 per page; resets on search/filter change) and a
  result count.
- **NoticeCard** — date chip, per-category badge, **"Pinned"** / **"New"** flags
  (recent = within 30 days), title and a 3-line clamped body that **expands
  inline** ("Read more"/"Show less", `aria-expanded`); the toggle only appears
  when the clamped body actually overflows or an optional attachment is present.
- `EmptyState` for "no notices yet" and "no matching notices" (with a Clear
  filters action). SEO via `useSeo()` (/notices route defaults).

**Events (`src/pages/Events/Events.jsx` + `.module.css`, `EventCard.jsx` + `.module.css`, `EventCalendar.jsx` + `.module.css`)**
- **PageHero** "Events" + breadcrumb. Control bar: category filter chips + a
  **List / Calendar** segmented toggle (filter applies to both views).
- **List view** — **Upcoming** and **Past** groups of `EventCard`s (date block,
  category badge, title, date-range · time · venue meta, description); past
  events read muted. Upcoming shows a friendly note when empty.
- **Calendar view** — `EventCalendar`, a lightweight **month grid** (no extra
  deps) highlighting event days (multi-day spans mark every covered day), with
  Prev/Next/Today navigation. It opens on the most relevant month for the
  current filter (next upcoming, else most recent) and auto-selects that month's
  first event day; **clicking a day** shows that day's events below via
  `EventCard`.
- `EmptyState` for "no events yet" and "no events in this category". SEO via
  `useSeo()` (/events route defaults). The four signature events (College Week,
  Cooking Competition, ICON Shield, ICON Trophy) come from the existing seed.

**Drive-by:** named the `formatters.js` default export before exporting it
(`import/no-anonymous-default-export`) so the whole project compiles clean under
`CI=true` (warnings-as-errors). `npm run build` passes.

### Phase 2.13 — Admissions + lead-gated prospectus

Twenty-third prompt of the rebuild (`prompts/23-admissions-and-prospectus.md`).
Replaces the `/admissions` `ComingSoon` shell with the full admissions page and
makes the "Download Prospectus" flow **lead-gated** — the prospectus file is
never fetched until a lead is captured.

**Admission data (`src/data/admissionData.js`)**
- Added `documentsRequired` (verification checklist, §6), `scholarshipNote`
  (Government-approved schemes via the college / Nodal Officer) and `admissionFaqs`
  (eligibility, how-to-apply, fees, dates `TODO`, hostel `TODO`, contact). Dates
  and hostel answers stay honest — they point to the Notices page / admission
  office rather than inventing specifics (client `TODO`s flagged in comments).
- `prospectus.file` now points to the real shipped placeholder PDF
  (`/prospectus/icon-commerce-college-prospectus.pdf`) instead of a `TODO` string.

**Lead-gated prospectus download (`src/components/common/ProspectusDownload/`)**
- `downloadProspectus.js` — `triggerProspectusDownload()` + `PROSPECTUS_FILE`
  (single source of truth = `admissionData.prospectus.file`). Downloads via a
  transient `<a download>` (same-origin, so the post-submit `/thank-you` redirect
  is unaffected); fails quietly if the file path is still a `TODO` placeholder.
- `ProspectusButton.jsx` — the canonical reusable CTA. It NEVER downloads
  directly; it opens the lead drawer with the `prospectus` preset
  (`UnifiedLeadForm`, source `prospectus`) and passes every `<Button/>` prop
  through (variant, size, fullWidth…). Accepts optional `source` + `programInterest`.
- Wired the actual download into the **global** drawer success flow: `ModalContext`
  now records the drawer `preset`, and `PublicLayout` passes an `onSubmitSuccess`
  to `LeadFormDrawer` that fires `triggerProspectusDownload()` only when
  `preset === 'prospectus'`. So **every** prospectus CTA across the site (Hero,
  Footer, Courses, Course detail, About, Departments, Home CTA, Admissions) now
  downloads the file on a successful submit — and only then.
- Adopted `<ProspectusButton/>` in the **Hero** and **Course detail** (rail + CTA,
  preserving the per-course program preselect); the Footer keeps its bespoke
  footer-styled button but flows through the same gated download.

**Placeholder PDF (`public/prospectus/icon-commerce-college-prospectus.pdf`)** — a
small, valid 1-page placeholder so the gated download has a real same-origin file.
`TODO` (client): replace with the official prospectus.

**Admissions page (`src/pages/Admissions/Admissions.jsx` + `.module.css`)**
- **PageHero** — "Admissions 2026-27", subtitle "Affiliated to Gauhati University ·
  NEP 2020 (FYUGP)", Home / Admissions breadcrumb, Apply Now CTA, `hero-students` bg.
- **How to Apply** — 4-step numbered process from `admissionData.steps`, plus a
  prominent "Go to Samarth Portal ↗" (official URL) and an "Apply / Enquire" drawer CTA.
- **Eligibility** — general note + per-programme cards (eligibility text from
  `coursesData`, the single source of truth).
- **Fee structure** — accessible `<Tabs>` (one per programme) of fee-breakdown
  tables + monthly tuition + application fee + the GU/non-refundable N.B. note
  (figures from `coursesData`).
- **Documents & Scholarships** — verification checklist + scholarship callout.
- **Admission FAQ** — `<Accordion>` rendered from `admissionData.faqs`, with the
  matching **FAQPage** JSON-LD kept in sync via `useSeo({ faqs })`.
- **CTA band** — navy + gold band: Apply Now / Download Prospectus (lead-gated) /
  Call Admissions, plus the Samarth "College Code 842" pill.
- Reveal-on-scroll is reduced-motion safe; card/hover lifts are CSS-only. The fee
  table and CTA band reuse the established CourseDetail styling.

**Navigation** — confirmed there is **no "Prospectus" item** in the header nav,
the mobile drawer or the mobile bottom nav (all derive from `data/navigation.js`,
which has none); the prospectus is surfaced only via CTAs and the Admissions page,
per the brief. No nav change was required.

**Build/QA** — `npm run build` passes (the one remaining warning is the pre-existing
`src/utils/formatters.js` anonymous-default-export, untouched here); the new/changed
files lint clean.

**Visual QA (Desktop 1440 / Tablet 820 / Mobile 390 + the prospectus drawer)** —
captured the assembled page and the lead-gated drawer at all three breakpoints. The
hero, 4-step grid, eligibility cards, fee Tabs/table, Documents & Scholarships, FAQ
accordion and the navy CTA band all render and stack correctly (steps/eligibility →
1 col on mobile, fee tabs wrap to two centred rows, CTA buttons stack).
- **Fix from QA:** the hero `<h1>` year now uses a non-breaking hyphen
  (`Admissions 2026‑27`) so it never breaks mid-token (`2026-` / `27`) during the
  `font-display:swap` FOUT or at very narrow widths — it wraps at the space instead.

### Phase 2.12 — Gallery page

Twenty-second prompt of the rebuild (`prompts/22-gallery-page.md`). Replaces the
`/gallery` `ComingSoon` shell with a single page that unifies the old separate
photo and video galleries:

    PageHero → intro → accessible Tabs ("Photos" | "Videos")
      • Photos → category filter chips + responsive masonry + lightbox
      • Videos → responsive cards + lazy-loaded YouTube modal

**Gallery data (`src/data/galleryData.js`)** — unchanged. The page renders
entirely from the existing exports (`galleryPhotos` — 12 labelled placeholders;
`galleryVideos` — three seed videos with `TODO` YouTube ids; `galleryCategories`
— Campus · Events · Classrooms · Sports · Cultural).

**Gallery page (`src/pages/Gallery/Gallery.jsx` + `.module.css`)**
- **PageHero** — "Gallery", subtitle on campus/college life, Home / Gallery
  breadcrumb, `hero-students` background.
- **Tabs** — a centered, accessible `<Tabs>` tablist ("Photos" | "Videos", gold
  shuttle underline) below the shared `<Section>` header; the two panels own
  their own layout and modal state so the shell stays thin.
- **SEO** — `useSeo()` applies the existing `/gallery` route meta (title,
  description, keywords) from `src/config/seo.js`.

**PhotoGallery (`src/pages/Gallery/PhotoGallery.jsx` + `.module.css`)**
- **Filter chips** — `All` + the five `galleryCategories`, as a
  `role="group"` of `aria-pressed` toggle buttons (active = navy).
- **Masonry** — a responsive CSS-columns masonry (4 → 3 → 2 → 1) of the photo
  placeholders; images are `loading="lazy"` and tiles carry a deterministic
  aspect-ratio cycle so the uniform placeholders read as a real masonry. The
  grid reveals with a single reduced-motion-safe fade (per-tile transforms
  inside CSS columns are avoided — the Facilities precedent); tile + image hover
  lifts are CSS-only.
- **Lightbox** — clicking a tile opens an accessible, header-less `<Modal/>`
  (navy stage + caption bar) with prev/next buttons, a category badge and a
  `n / total` counter. Prev/next also respond to the ←/→ keys and Esc closes
  (handled by `<Modal/>`); focus moves into the dialog on open. Navigation and
  filtering both operate on the filtered set, and the lightbox content is only
  rendered while open.

**VideoGallery (`src/pages/Gallery/VideoGallery.jsx` + `.module.css`)**
- **Cards** — responsive grid (3 → 2 → 1) of video cards (thumbnail + gold play
  badge + title), each a single accessible button; thumbnails are
  `loading="lazy"`.
- **Video modal** — clicking a card opens a `<Modal/>` with a 16:9 YouTube embed
  that is only mounted while the modal is open and never autoplays on load (for
  performance). Seed videos still carry a `TODO` id, so those show a tasteful
  "coming soon" panel instead of a broken iframe — the embed wires up
  automatically once the client fills in a real YouTube id.
- Entrance is reduced-motion-safe (`<RevealGroup>`); card/thumbnail hover lifts
  are CSS-only. `npm run build` stays green and the new files lint clean.

**Visual QA (multi-viewport screenshots — Desktop / Tablet / Mobile)**
- Captured the assembled page at Desktop (1440), Tablet (820) and Mobile (390)
  across every state (photos masonry, category filters, lightbox, videos tab and
  video modal). Tabs, filters, the lightbox (prev/next + caption + counter) and
  the video modal all behaved correctly; the masonry reflows 4 → 3 → 1 columns
  and the modals adapt to a bottom-sheet on mobile.
- **Fix from review:** filtering to a small category (1–3 photos) left the
  `column-count` masonry stranding tiles in the leftmost columns with the rest
  of the row empty. The grid now caps its effective columns **and** width to the
  photo count (`column-count: min(--cols, --photo-count)` + a width cap that is a
  no-op once the row is full), so any filtered set stays centered at a consistent
  tile size while the full "All" view is unchanged.

### Phase 2.11 — Facilities page

Twenty-first prompt of the rebuild (`prompts/21-facilities-page.md`). Replaces the
`/facilities` `ComingSoon` shell with a polished campus page:

    PageHero → intro (learning environment + focus areas) → facilities grid →
    feature spotlights (alternating image + copy rows) → campus glimpses →
    "Visit our campus" CTA (Book a Campus Visit drawer + gallery link).

**Facilities data (`src/data/facilitiesData.js`)**
- Added two exports alongside the existing `facilitiesData` (the 10 facilities,
  unchanged): `facilitySpotlights` — three richer two-column rows (Digital
  Library · Computer Lab · Sports & College Week) each with an image, lead and
  feature points; and `campusGlimpses` — three image tiles (Smart Classrooms ·
  Canteen · Wi-Fi) reusing the remaining labelled placeholders. All copy is
  grounded in the design-system / prospectus facts (College Week, ICON Shield in
  memory of Rupam Patgiri, ICON Trophy in memory of Jadav Dutta) — nothing
  invented. Images resolve through `utils/assets` `placeholder()`.

**SEO (`src/utils/seo.js`)**
- Added `generateFacilityListSchema(facilities)` — an `ItemList` of the campus
  facility names, applied via `useSeo()` on `/facilities`. Mirrors the existing
  `generateDepartmentListSchema` / `generateFacultyListSchema` pattern; purely
  additive. (The `/facilities` route meta already existed in `src/config/seo.js`.)

**FacilityCard (`src/pages/Facilities/FacilityCard.jsx` + `.module.css`)**
- A compact facility tile: gold icon chip, title and one-line blurb. Following
  the WhyChoose / Highlights precedent it is plain markup with a CSS-only hover
  lift and is wrapped in `<Reveal>` by the page, so the entrance animation routes
  through `useReducedMotionVariants()` and never double-animates against a
  motion-driven card.

**Facilities page (`src/pages/Facilities/Facilities.jsx` + `.module.css`)**
- **PageHero** — "Campus & Facilities", subtitle on the student-first campus,
  Home / Facilities breadcrumb, `hero-campus` background.
- **Intro** — one-line on the learning environment plus a focus-area strip
  (Academics · Technology · Sports & Culture · Student Support) — category
  labels, no invented numbers.
- **Facilities grid** — all 10 facilities render from `facilitiesData` as
  `FacilityCard`s in a centered flex-wrap grid (the Faculty highlight-strip
  precedent) so the cards read as a balanced 5 + 5 on wide screens and any
  trailing partial row stays centered (cards stretch to equal height per row).
- **Feature spotlights** — three alternating image + copy rows from
  `facilitySpotlights` (image with a floating gold badge; eyebrow, heading, lead
  and a checked feature list), each anchored by `id` for deep links.
- **Campus glimpses** — three image tiles from `campusGlimpses` with a navy
  gradient caption overlay (`<figure>`/`<figcaption>`).
- **CTA** — navy + gold-glow band: "Visit our campus" with a single Warm-Red
  "Book a Campus Visit" button (opens the `visit` lead drawer) and a link to the
  `/gallery` page.
- Reveal-on-scroll is reduced-motion safe (`<Reveal>`/`<RevealGroup>`); all card
  and image hover lifts are CSS-only. `npm run build` stays green.

**Visual QA (multi-viewport screenshots — Desktop / Tablet / Mobile)**
- Facilities grid: the original responsive `auto-fill` grid left the 10 cards as a
  left-heavy 4 + 4 + 2 on desktop (two empty columns trailing). Switched to the
  centered flex-wrap pattern so desktop reads as a balanced 5 + 5, tablet as a
  centered 3 + 3 + 3 + 1, and phones as full-width single cards — no stranded
  trailing row at any width.
- Verified hero, intro, alternating spotlights, glimpse tiles and the CTA across
  all three breakpoints (reveal-on-scroll, stacking and the navy CTA contrast all
  correct).

### Phase 2.10 — Faculty page

Twentieth prompt of the rebuild (`prompts/20-faculty-page.md`). Replaces the
`/faculty` `ComingSoon` shell with a professional teaching-staff directory:

    PageHero → intro (prospectus credentials) → Leadership & Coordinators
    highlight strip → searchable/filterable faculty directory → Guest Faculty.

**Faculty data (`src/data/facultyData.js`)**
- Enriched each member with a `featured` flag (Principal, Academic Advisor and
  the three programme coordinators — the highlight strip) and documented an
  optional `bio` (left to prompt 37). The coordinators' placeholder
  `qualifications` string was changed from a literal `'TODO: …'` (which would
  have leaked into the UI) to `''`, so the card cleanly omits the line — no
  fabricated credentials.
- Added a `guestFaculty` export for the two prospectus-named guest faculty
  (Biswajit Bhattacharya; Dr. Nripendra Nath Medhi). Only their names are
  confirmed, so department/qualifications are intentionally omitted rather than
  invented; they render in their own section, not the filterable grid.

**SEO (`src/utils/seo.js`)**
- Added `generateFacultyListSchema(faculty)` — an `ItemList` of `Person`
  entries (each `worksFor` the college, with `jobTitle`/`honorificSuffix` when
  known), applied via `useSeo()` on `/faculty`. Mirrors the existing
  `generateDepartmentListSchema` / `generateCourseListSchema` pattern; purely
  additive.

**FacultyCard (`src/pages/Faculty/FacultyCard.jsx` + `.module.css`)**
- A self-contained profile tile: gold-ringed avatar (placeholder), name,
  designation, qualifications and a department chip. CSS-only hover lift (kept
  off the entrance transform). When a member has a `bio` it grows an accessible
  expand toggle (real `<button>` with `aria-expanded`/`aria-controls`; panel
  `role="region"`, reduced-motion-safe height animation) — no toggle renders
  today, so nothing fabricated is shown.

**Faculty page (`src/pages/Faculty/Faculty.jsx` + `.module.css`)**
- **PageHero** — "Our Faculty", subtitle "Experienced, qualified &
  research-active educators…", Home / Faculty breadcrumb.
- **Intro** — prospectus-sourced lead plus a credential strip (Ph.D · M.Phil ·
  NET · SLET) and three faithful points (highly qualified · research-active ·
  mentor-based guidance). No invented numbers beyond the prospectus.
- **Leadership & Coordinators highlight** — a centered strip pulling the
  Principal, Academic Advisor and B.Com/BBA, BCA and B.A. coordinators to the
  top; they also stay in the directory so a search for them still resolves.
- **Directory** — department filter chips (derived from the data, count desc;
  `aria-pressed`, `role="status"` result count) AND a live name search
  (`role="search"`, custom clear button) that combine; an `EmptyState` with a
  "Clear filters" action when nothing matches. Responsive grid (4 / 3 / 2 / 1
  columns).
- **Guest Faculty** — its own section for the two guest faculty.
- Reveal-on-scroll is reduced-motion safe (`<Reveal>`/`<RevealGroup>`); card
  hover lifts are CSS-only. `npm run build` stays green (no new warnings).

**Visual QA (multi-viewport screenshots — Desktop / Tablet / Mobile)**
- Fixed a duplicated gold eyebrow: the intro section read "Our People" — the same
  label as the PageHero — so it now reads "Teaching Excellence".
- Leadership & Coordinators strip: the five cards wrapped as a lopsided 4 + 1 on
  desktop. The featured cells now size so the strip is a single balanced row of
  five (≥1181px), wrapping to a centred 3 + 2 (≤1180px) and a single column
  (≤680px) — never an awkward 4 + 1 or 2 + 2 + 1. Guest cards got their own cell
  size (only two) so the pair stays prominent.
- Directory grid switched from `align-items: start` to `stretch` so cards in a
  row share one height (names/designations wrap to two lines on some cards, and
  some have no qualifications line) — bottoms now align cleanly.

### Phase 2.9 — Departments page

Nineteenth prompt of the rebuild (`prompts/19-departments-page.md`). Replaces the
`/departments` `ComingSoon` placeholder — and the old ~20 thin per-department routes
— with ONE clean, well-organised page that groups every subject under its academic
stream (Arts / Commerce / Science). Everything renders from `departmentsData`; no
separate routes.

**Departments data (`src/data/departmentsData.js`)**
- Enriched each subject with an `icon`, a one-line `blurb`, a short `description`
  (shown in the card accordion) and the `related` UG programme slug(s) it feeds into
  (resolved against `coursesData`). Streams gained a representative `icon`. The
  `subj()` helper and `@typedef`s were updated to match; the three stream/subject
  lists are unchanged (design-system §6). A few pure-science subjects (Botany,
  Chemistry) carry an empty `related` — the card simply omits the chip rather than
  inventing a link.

**SEO (`src/utils/seo.js`)**
- Added `generateDepartmentListSchema(streams)` — an `ItemList` of the (de-duplicated)
  department names, applied via `useSeo()` on `/departments`. Mirrors the existing
  `generateCourseListSchema` pattern; purely additive.

**DepartmentCard (`src/pages/Departments/DepartmentCard.jsx` + `.module.css`)**
- A tidy, self-contained tile: a stream-accented gold icon chip, the department name
  and a one-line blurb, plus an accessible accordion (real `<button>` with
  `aria-expanded` / `aria-controls`; panel `role="region"`) that expands to a short
  description and the related-programme link(s). Carries the deep-link anchor `id`.
  Height animation is reduced-motion safe (mirrors the shared `Accordion`).

**Departments page (`src/pages/Departments/Departments.jsx` + `.module.css`)**
- **PageHero** — "Departments", subtitle "Arts · Commerce · Science", Home / Departments
  breadcrumb.
- **Stream filter** — accessible filter chips (All · Arts · Commerce · Science) with
  per-stream counts (`aria-pressed`, keyboard-navigable, `role="status"` result
  count). "All" keeps every stream mounted so deep-links resolve.
- **Stream sections** — each stream gets a short image intro band (`dept-arts` /
  `dept-commerce` / `dept-science`) with its label, blurb and count, followed by a
  responsive department-card grid. Stream identity stays inside the Navy + Gold
  palette via per-section `--stream-accent` / `--stream-soft` custom properties
  (Arts/Science read gold, Commerce reads navy); section eyebrows stay gold.
- **Deep-links** — every card has a unique anchor `id`: bare slug where unique (so
  `/departments#accountancy` works as documented), stream-qualified where a name
  recurs across streams (`#arts-economics` vs `#commerce-economics`) to avoid
  duplicate ids. Cards use `scroll-margin-top` so the fixed header never covers them.
- **CTA** — navy + gold-glow band: "Not sure which stream is right for you?" with a
  single warm-red "Talk to Us" primary (opens the enquiry drawer), "Download
  Prospectus" and a tertiary link to `/courses`.
- Reveal-on-scroll is reduced-motion safe; card/image hover lifts are CSS-only.
  `npm run build` stays green (no new warnings).

**Visual QA (multi-viewport screenshots — Desktop / Tablet / Mobile)**
- Department cards size to their own content (`align-items: start`) so expanding
  one card's accordion no longer stretches its collapsed row-mates into tall,
  empty cards; the blurb reserves two lines (`min-height`) so collapsed rows stay
  uniform and the "Details" toggles align.
- The stream image badge is now consistently gold (brand emphasis) instead of the
  per-stream accent — a navy Commerce badge was invisible on the navy placeholder
  (and would be unreliable on dark photos).

### Phase 2.8 — Course detail template

Eighteenth prompt of the rebuild (`prompts/18-course-detail-pages.md`). Replaces the
`/courses/:slug` `ComingSoon` placeholder with one reusable, data-driven detail
template that renders distinct, professional pages for all four UG programmes
(B.Com · BBA · BCA · B.A.). Every figure (fees, eligibility, careers, curriculum)
comes from `coursesData` — no per-course markup, no fabricated data.

**Courses data (`src/data/coursesData.js`)**
- Added a shared, exported `fyugpCurriculum` (NEP-2020 / FYUGP structure summary,
  course-component cards and the multiple-entry / multiple-exit awards) — the
  generic, framework-level curriculum common to every programme, kept as a single
  swappable source of truth.
- Added a per-course `syllabusUrl` (currently a `TODO` for the Gauhati University
  syllabus PDF — client to supply). The `@typedef` was updated to match. Purely
  additive; existing consumers (cards, SEO, comparison table) are unaffected.

**PageHero (`src/components/common/PageHero/PageHero.jsx` + css)**
- Added an optional `children` slot rendered under the title (used here for the
  course meta-pill row: shortName badge · duration · affiliation). Backward
  compatible — pages that pass no children are unchanged.

**Tabs (`src/components/common/Tabs/Tabs.jsx` + css)**
- Added an opt-in `sticky` prop that pins the tablist below the fixed header while
  its panel scrolls (the course sub-nav). Default `false`, so the existing
  Departments/UIKit usages are unaffected.

**Course detail page (`src/pages/CourseDetail/CourseDetail.jsx` + `.module.css`)**
- **PageHero** — course name, a gold shortName badge + duration + affiliation
  pills, a Home / Courses / `<shortName>` breadcrumb and a single warm-red
  "Apply for `<shortName>`" CTA (opens the lead drawer preset to this programme).
- **Sticky Tabs sub-nav** — Overview · Eligibility · Fees · Curriculum · Careers
  (accessible WAI-ARIA tablist, gold "shuttle" underline):
  - *Overview* — summary, level/duration/affiliation facts and highlight ticks.
  - *Eligibility* — the per-programme HS (10+2) requirement (with BCA's Maths/CS
    preference and B.A. Honours 45% note) plus the document-verification checklist.
  - *Fees* — the full breakdown table (Admission/Library/ID-Card/Misc → Total),
    monthly tuition, application fee and the GU / non-refundable N.B. note.
  - *Curriculum* — the NEP-2020 FYUGP structure (course components + exit awards)
    and a "Detailed syllabus" button; while the GU link is a `TODO` it renders a
    disabled "coming soon" state rather than a broken link or embedded Drive viewer.
  - *Careers* — the career paths from data.
- **Sticky side rail (desktop)** — a quick-facts card (duration, eligibility,
  1st-sem fees, monthly tuition, intake, affiliation), Apply / Download Prospectus
  / "Talk to admissions" (tel:) actions and a related-programmes list.
- **Bottom CTA** — navy + gold-glow band with a Samarth "College Code 842" pill
  and Apply / Prospectus, plus an "Explore other programmes" `ProgramCard` grid of
  the remaining three programmes.
- Per-course SEO + the `Course` JSON-LD schema are applied by `useSeo()` via the
  `/courses/:slug` route resolver (`src/utils/seo.js`); an unknown slug renders the
  404 page. Reveal-on-scroll is reduced-motion safe; card/hover lifts are CSS-only.
  Verified all four slugs + a bad slug render correct, distinct content (SSR smoke
  render). `npm run build` stays green.

**Visual QA fix (multi-viewport screenshot review of the assembled pages)**
- **Floating Enquire button overlap (`src/components/common/FloatingActions/FloatingActions.module.css`)**
  — production-build screenshots of the course detail page showed the global
  bottom-right "Enquire" pill overlapping right-edge content (the course-detail
  side rail's secondary buttons) at common laptop widths (~1024–1366px). The wide
  gold pill now collapses to a compact 52px circle that hugs the corner and
  expands to its labelled "Enquire" pill on hover/focus (the action + name remain
  available to everyone via the button's `aria-label`). This shrinks the stack's
  footprint site-wide so the floating actions clear page content; verified on the
  course detail and Home pages across desktop/tablet/mobile with no regressions.
  Transitions are dropped under `prefers-reduced-motion`.

### Phase 2.7 — Courses overview

Seventeenth prompt of the rebuild (`prompts/17-courses-overview-page.md`). Replaces
the `/courses` `ComingSoon` placeholder with a single hub presenting all four UG
programmes (B.Com · BBA · BCA · B.A.), consolidating the old thin per-course
pages. Every figure renders from `coursesData` / `admissionData` / `collegeInfo`
— no fabricated data.

**Courses data (`src/data/coursesData.js`)**
- Added a compact `eligibilityShort` per course (e.g. "HS (10+2) — any stream",
  "HS (10+2) — Maths / CS preferred", "HS (10+2) — any stream (Hons. ≥ 45%)") for
  the comparison table, where the full `eligibility` sentence is too long. Purely
  additive — existing consumers (cards, course detail, SEO) are unaffected. The
  `@typedef` was updated to match.

**ProgramCard (`src/components/sections/ProgramsSection/ProgramCard.jsx` + css)**
- Reused the existing card (its docstring already noted "reusable on /courses")
  via two backward-compatible props: `source` (default `'home-programs'`; the
  /courses grid passes `'courses-grid'` so Apply leads are attributed correctly)
  and `showEligibility` (default `false`; the larger /courses cards opt in to
  render the eligibility one-liner). Home behaviour is unchanged by the defaults.

**SEO (`src/utils/seo.js`)**
- Added `generateCourseListSchema(courses)` — an `ItemList` of `Course` items in
  catalogue order — alongside the existing schema generators. The Courses page
  contributes it via `useSeo({ schema })`.

**Courses page (`src/pages/Courses/Courses.jsx` + `Courses.module.css`)**
- **PageHero** — "Our Programs" over the `hero-students` placeholder, "Programs"
  eyebrow, the NEP-2020 / FYUGP + Gauhati University subtitle and a Home /
  Courses breadcrumb.
- **Intro band** — a `SectionTitle` explaining the FYUGP structure (3-year / 6-sem
  degree, 4-year / 8-sem Honours) and the Samarth admission route (College Code
  842), over a four-up grid of gold-chip "structure" cards.
- **Program cards grid** — a responsive 2-up grid of large `ProgramCard`s (image,
  shortName badge, duration, eligibility one-liner, three highlight ticks,
  1st-semester fee and "View Details" → `/courses/:slug` + "Apply" → drawer).
- **Comparison table** — Program · Duration · Eligibility · 1st-Sem Total Fees ·
  Monthly Tuition, mapped from `coursesData`. A focusable, horizontal-scroll-safe
  region on desktop/tablet that collapses to stacked, `data-label`-prefixed cards
  on phones (a visually-hidden `<thead>` + `<caption>` keep it accessible).
- **Admission CTA** — a navy band with the four-step summary (from
  `admissionSteps`), a Samarth "College Code 842" pill linking to the portal, the
  single warm-red **Apply Now** plus a gold-outline **Download Prospectus**
  (both open the lead drawer) and a link to the full `/admissions` process.
- Reveal-on-scroll via `<Reveal>/<RevealGroup>` (reduced-motion safe; hover lifts
  are CSS-only and dropped under `prefers-reduced-motion`). Verified across
  desktop/tablet/mobile (headless screenshots) — all four programmes, fees and
  slug links render correctly. `npm run build` stays green.

**Visual QA fix (multi-viewport screenshot review — desktop/tablet/mobile + edge widths)**
- **Program-card grid breakpoint** — the grid previously dropped to a single
  column at ≤768px (coupled to the CTA-steps breakpoint), so tablet-portrait
  (768px) rendered oversized full-width cards with a ~440px-tall media block.
  Decoupled the two and now stack the cards to one column only at ≤700px, so
  tablet-portrait keeps a clean 2-up grid (~340px cards, actions uncramped) while
  phones still get a comfortable single column. Re-verified at 360/414/680/720/
  768px: no horizontal overflow and the card actions never wrap.

### Phase 2.6 — Leadership page

Sixteenth prompt of the rebuild (`prompts/16-leadership-desks-page.md`). Replaces
the `/leadership` placeholder with a dignified "Messages from the Desks" page
presenting all seven desk-holders. Identity, qualifications, photos and the
(interim) message copy are read from `leadershipData` — no fabricated facts; the
verbatim prospectus messages land in prompt 37.

**Leadership data (`src/data/leadershipData.js`)**
- Reordered to the canonical design-system §6 sequence (President → Advisor →
  Principal → Rector → Director (Academic) → Director → Academic Advisor) so the
  page can map the array directly. The Home `LeadershipTeaser` is unaffected (it
  resolves desks by name).
- Swapped the raw `TODO:` message strings for short, dignified, display-ready
  *interim* excerpts grounded in real college facts (Estd. 2004, Icon Academy
  Trust, Gauhati University / NEP 2020 FYUGP). A file-level `TODO (prompt 37)`
  marks them for replacement with the full prospectus copy.

**Leadership page (`src/pages/Leadership/Leadership.jsx` + `Leadership.module.css`)**
- **PageHero** — "Messages from the Desks" over the `about-college-building`
  placeholder, with a Home / Leadership breadcrumb and a "Leadership" eyebrow.
- **Leadership directory** — a responsive grid (4 → 3 → 2 → 1) of gold-ringed
  ProfileCards, one per desk, each a router `<Link>` to that desk's anchor
  (`/leadership#<slug>`, `slug = slugify(name)`) with a "Read message →"
  affordance.
- **"From the Desk of …" blocks** — seven alternating left/right message
  sections, each a plain `<section id={slug}>` (a stable, non-transformed scroll
  target with `scroll-margin-top` for the fixed header) carrying a portrait
  placeholder (gold quote disc), name, role, qualifications, the interim message
  with a gold quote accent, and a gold-ruled signature line. This makes the
  deep-links from the Home teaser (e.g. `/leadership#dr-mandira-saha`) land on
  the right message via the shared `<ScrollToTop>`.
- **Governing Body note** — a closing navy band on the `Icon Academy Trust`
  governance, with quick links to `/about` and `/admissions`.
- Reveal-on-scroll via `<Reveal>/<RevealGroup>` (reduced-motion safe; hover
  lifts are CSS-only and dropped under `prefers-reduced-motion`). SEO uses
  `useSeo()` (the `/leadership` route defaults live in `src/config/seo.js`) and
  contributes `Person` schema for the President and Principal. Removes the
  `ComingSoon` placeholder. `npm run build` stays green.

**Visual QA fixes (multi-viewport screenshot review — desktop/tablet/mobile)**
- **Directory grid** — switched from a fixed 4-column CSS grid to a centred
  flex layout (`flex: 1 1 260px; max-width: 300px`). Seven desks never divide
  evenly, so the old grid left an awkward incomplete final row — most visibly a
  lonely left-aligned card on tablet. The trailing row now centres at every
  width (desktop 4+3, tablet 2+2+2+1, phones full-width single column) while all
  cards keep a uniform width.
- **Reversed message blocks** — the gold quote disc now mirrors to the inner,
  text-facing corner of the portrait (it previously sat on the outer page-edge
  corner on right-hand portraits).
- Re-verified after the fixes: `npm run build` green, and the Home-teaser
  deep-links land correctly (direct `/leadership#dr-mandira-saha` load and an
  in-page card click both scroll the target desk to exactly the fixed-header
  offset).

### Phase 2.5 — About page

Fifteenth prompt of the rebuild (`prompts/15-about-page.md`). Replaces the
`/about` placeholder with a full, professionally written college story. The
page composes existing primitives/sections and adds About-specific blocks; all
copy is sourced from `collegeInfo` and the design system (§1/§6) — no fabricated
data — with uncertain timeline years flagged `TODO` for the client to confirm.

**About page (`src/pages/About/About.jsx` + `About.module.css`)**
- **PageHero** — "About Icon Commerce College" over the `about-campus-aerial`
  placeholder, with a Home / About breadcrumb and an "Our Story" eyebrow.
- **College Profile** — two-column intro: the `about-college-building`
  placeholder (gold "Estd. 2004" badge) beside three scannable paragraphs
  (Estd. 2004 · Icon Academy Trust · Gauhati University / NEP 2020 FYUGP ·
  permitted Samarth exam centre 842 · library, study materials, smart
  classrooms, computer lab, online classes, seminars/workshops and
  experienced, research-active faculty) plus a quick-facts list. Carries the
  required internal links — a navy **Explore our programmes** → `/courses` and
  a **Meet our leadership** → `/leadership`.
- **Vision & Mission** — reuses the prompt 12 `<VisionMission>` section (two
  gold-accented cards + side accent image) rather than duplicating it.
- **Core Values / Why ICC** — six icon cards (Academic Excellence, Holistic
  Development, Moral Integrity, Student-Centric Approach, Inclusive Community,
  Industry Readiness) as plain icon-card markup inside `<Reveal>/<RevealGroup>`
  (the WhyChoose precedent) with a CSS-only hover lift, 3 → 2 → 1 columns.
- **At a Glance** — a navy band that reuses `statsData` + the shared
  `<AnimatedCounter>` for the count-up figures, followed by gold accreditation
  chips (Gauhati University · NEP 2020 / FYUGP · Samarth Code 842 · Estd. 2004).
- **Milestones timeline** — a simple vertical gold-railed timeline
  (2004 founding → growth → NEP 2020 / FYUGP adoption → today); the
  not-firmly-documented years use descriptive markers and `TODO` comments.
- **CTA band** — navy + gold-glow closing band with a single warm-red **Apply
  Now** primary alongside gold-outline **Download Prospectus** and **Visit
  Campus** (all open the global lead drawer in the matching context) and a
  tertiary **See the full admission process** → `/admissions` link.
- Every block reveals on scroll via `<Reveal>/<RevealGroup>` (reduced-motion
  safe); hover transforms are dropped under `prefers-reduced-motion`. Page SEO
  is applied with `useSeo()` (the `/about` route defaults live in
  `src/config/seo.js`). `npm run build` stays green.

**Visual QA fixes (multi-viewport screenshot review)**
- **PageHero title contrast** — the inner-page hero `<h1>` was rendering
  navy-on-navy (nearly invisible): the global `h1 { color: var(--primary-dark) }`
  rule in `styles/global.css` overrode the white it should inherit from `.hero`.
  `PageHero`'s `.title` now sets an explicit white colour, fixing the hero title
  on **every** page that uses `<PageHero>`.
- **About CTA link** — moved the arrow on "See the full admission process" to
  trail the label (conventional "proceed" affordance).

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
