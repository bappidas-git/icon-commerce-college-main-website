# Cross-Page QA & Link Audit — Phase 4.5

**Prompt:** `prompts/38-cross-page-qa.md`
**Date:** 2026-06-06
**Build:** `npm run build` (CI=true) — ✅ compiled successfully, zero warnings/errors.
**Scope:** every public route (14) + 4 course slugs + `/thank-you` + 404, and the
6 admin routes; all header / footer / drawer / bottom-nav / in-page / breadcrumb
links; every Apply / Enquire / Prospectus / Callback / Visit CTA; the lead,
notice and event data flows.

Legend: ✅ pass · 🔧 issue found **and fixed** in this pass · ⚠️ known
placeholder/`TODO` gap for the client (not a defect) · ℹ️ observation.

---

## 0. Issues found & fixed

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | 🔧 Medium | **OG / Twitter / schema image 404.** `og:image`, `twitter:image` (`public/index.html`) and `defaultImage` (`src/config/seo.js`) plus the static Organization JSON-LD pointed at `…/og-default.jpg`, but the only on-disk asset is `og-default.svg` (the placeholder generator emits SVG for every name; `placeholder()` resolves `.jpg`→`.svg`, but these four references are raw strings that bypass it). The share-image URL 404'd. | Repointed all four references to `og-default.svg` (the existing file), matching the hero-preload and manifest convention, and added a "PRODUCTION SWAP → real 1200×630 raster" note in both files. |

No other broken links, wrong slugs, dead anchors, or missing `rel` attributes
were found.

---

## 1. Link audit

### 1.1 Internal navigation links → all resolve to a real route (§5 site map)

| Surface | Source | Targets | Status |
|---------|--------|---------|--------|
| Header desktop nav + dropdowns | `data/navigation.js` `mainNav` | `/`, `/about`, `/leadership`, `/faculty`, `/facilities`, `/courses`, `/courses/{b-com,bba,bca,b-a}`, `/departments`, `/gallery`, `/notices`, `/events`, `/contact` | ✅ |
| Header brand / logo | `Header.jsx` | `/` | ✅ |
| Footer Quick Links | `Footer.jsx` `quickLinks` | `/about`, `/courses`, `/departments`, `/admissions`, `/gallery`, `/contact` | ✅ |
| Footer Programs | `navigation.js` `footerNav` | `/courses/{b-com,bba,bca,b-a}` | ✅ |
| Footer Admin link | `Footer.jsx` | `/admin/login` | ✅ |
| Mobile drawer (tree + submenus) | `MobileDrawer.jsx` | same as `mainNav` | ✅ |
| Mobile bottom nav | `MobileNavigation.jsx` | `/`, `/courses`, `/notices` | ✅ |
| Breadcrumbs (all pages) | `Breadcrumbs.jsx` + `PageHero` `breadcrumb` | Home + current page | ✅ |
| Course cards / table | `ProgramCard.jsx`, `Courses.jsx`, `CourseDetail` related | `/courses/{slug}` from `coursesData` | ✅ slugs valid |
| Department → related programme chips | `DepartmentCard.jsx` | `/courses/{slug}` from `departmentsData.related` | ✅ all `related` slugs ∈ {b-com,bba,bca,b-a} |
| Home notice/event panels | `NoticeBoardSection.jsx` | `/notices`, `/events` | ✅ |
| In-page CTAs (About/Courses/Departments/Facilities/Leadership/CourseDetail/ThankYou) | per page | `/about`, `/courses`, `/leadership`, `/admissions`, `/gallery`, `/` | ✅ |
| 404 suggested links | `NotFound.jsx` | `/courses`, `/admissions`, `/notices`, `/contact` | ✅ |
| Admin sidebar + topbar + dashboard | `navItems.js`, `Dashboard.jsx` | `/admin/{dashboard,leads,leads/:id,notices,events,settings}` | ✅ |

### 1.2 Hash / anchor links

| Link | Target id | Status |
|------|-----------|--------|
| `LeadershipTeaser` & Leadership index → `/leadership#{leader.slug}` | `<article id={leader.slug}>` in `Leadership.jsx` | ✅ ids match; `ScrollToTop` applies the 80px header offset and retries once for the lazy-mounted page |
| Skip link `#main-content` | `<main id="main-content">` in `PublicLayout` | ✅ |

### 1.3 External / protocol links — `rel` & correctness

| Link | Built from | `rel`/safety | Status |
|------|-----------|--------------|--------|
| Samarth portal (header, footer, drawer, Admissions, Courses, CourseDetail, ThankYou, HomeCTA) | `collegeInfo.samarthUrl` = `https://assamadmission.samarth.ac.in/` | `rel="noopener noreferrer"` (explicit, or auto-added by `Button` when `target="_blank"`) | ✅ |
| Google Maps (footer, contact) | `mapsSearchUrl` via `collegeInfo.mapsQuery` | `rel="noopener noreferrer"` | ✅ |
| Phone | `phoneHref()` → `tel:+9193653…` | n/a | ✅ digits-only, correct |
| Email | `emailHref()` → `mailto:iconcom.2004@gmail.com` | n/a | ✅ |
| WhatsApp (footer, drawer, floating, contact, thankyou) | `whatsappHref()` → `https://wa.me/9193653…` | `rel="noopener noreferrer"` | ✅ |
| Social (FB / YouTube / Instagram) | `collegeInfo.social.*` | `rel="noopener noreferrer"`; `isHttpUrl()` guard renders `#` while URLs are `TODO` | ✅ / ⚠️ URLs are `TODO` (client to supply) |
| Contact map `<iframe>` | `mapsEmbedUrl` (`output=embed`, keyless) | `title` set, `loading="lazy"`, `referrerPolicy` set | ✅ |
| Gallery video `<iframe>` | `youtubeId` | only mounted when a **real** id exists; `TODO` ids show a fallback panel, never a broken embed | ✅ / ⚠️ ids `TODO` |

**Every `target="_blank"` in `src/` carries `rel="noopener noreferrer"`** — verified
across all 27 occurrences (the shared `Button` primitive injects it automatically:
`rel={target === '_blank' ? 'noopener noreferrer' : rel}`).

---

## 2. CTA matrix

Drawer presets (`context/ModalContext.jsx` `DRAWER_TITLES`): `apply-now`,
`enquiry`, `prospectus`, `callback`, `visit`, `default`. Each sets the drawer
title/subtitle and the lead `source`; a per-CTA `source` override is respected.

| CTA location | Preset | `source` recorded | `program_interest` preset | Status |
|--------------|--------|-------------------|---------------------------|--------|
| Header "Apply Now" | apply-now | apply-now | — | ✅ |
| Mobile drawer / bottom-nav "Apply" | apply-now | apply-now | — | ✅ |
| Footer "Apply Now" | apply-now | apply-now | — | ✅ |
| Footer "Download Prospectus" | prospectus | prospectus | — | ✅ |
| Footer enquiry mini-strip (inline) | — (direct submit) | `footer` | Undecided | ✅ |
| Floating action "Enquire" | enquiry | enquiry | — | ✅ |
| Hero `EnquiryButton` | apply-now | hero | — | ✅ |
| Home CTA "Apply" / "Prospectus" | apply-now / prospectus | home-cta | — | ✅ |
| Program card "Apply" | apply-now | (default) | `course.shortName` | ✅ matches dropdown options exactly |
| Courses page "Apply" / "Prospectus" | apply-now / prospectus | courses-cta | — | ✅ |
| Course detail "Apply" | apply-now | (per button) | `course.shortName` | ✅ |
| Course detail `ProspectusButton` | prospectus | course-detail | `course.shortName` | ✅ |
| About "Apply" / "Prospectus" / "Visit" | apply-now / prospectus / visit | about-cta | — | ✅ |
| Departments "Enquire" / "Prospectus" | enquiry / prospectus | departments-cta | — | ✅ |
| Facilities "Book a Visit" | visit | facilities-cta | — | ✅ |
| Admissions hero / steps "Apply" | apply-now | admissions-hero / admissions-how | — | ✅ |
| Contact inline form ("Request a Callback") | — (direct submit) | `contact` | user-selected | ✅ |

- **Program preselect chain is consistent:** `openLeadDrawer('apply-now', { programInterest })`
  → `drawerConfig.programInterest` → `LeadFormDrawer programInterest` → `UnifiedLeadForm`
  seeds `program_interest`. `course.shortName` values (`B.Com.`, `BBA`, `BCA`, `B.A.`)
  are byte-for-byte identical to `PROGRAM_OPTIONS`, so the MUI Select preselects
  correctly (no silent empty-value).
- **`callback` preset** is defined and label-mapped in `EnquiryButton`; the Contact
  page intentionally fulfils the callback role with an inline `UnifiedLeadForm`
  (`source="contact"`) rather than the drawer. No dead preset. ✅

---

## 3. End-to-end flows (verified by code inspection)

> The shared lead/notice/event stores are PHP+JSON endpoints (`public/api/*.php`);
> a live PHP host is required to exercise these at runtime. The wiring below was
> traced end-to-end in code; mark a live pass on staging before launch.

| Flow | Path traced | Status |
|------|-------------|--------|
| Public lead submit → `/thank-you` → admin | `UnifiedLeadForm` `POST /api/leads.php` → on success sets `sessionStorage.lead_submitted` → `navigate('/thank-you')`; admin `leadService.syncLeadsFromServer()` 15s poll renders it | ✅ |
| Prospectus lead-gated download | `onSubmitSuccess` runs **after** `result.success` and **before** `navigate`; `PublicLayout.handleDrawerSubmitSuccess` triggers `triggerProspectusDownload()` only when `drawerConfig.preset === 'prospectus'`. File is never fetched pre-capture. | ✅ |
| Notice publish → Home + `/notices`; unpublish → gone | `useNotices()` filters published-only, seed fallback; admin create/publish writes `notices.php` | ✅ |
| Event create → `/events` list + calendar + Home upcoming | `useEvents()` + `NoticeBoardSection` upcoming filter; admin writes `events.php` | ✅ |
| Lead status change + note → persists + timeline | `LeadDetail` / `leadService` activity log | ✅ |
| Cross-tab (BroadcastChannel) + cross-device (server poll) | services broadcast on mutate + 15s poll | ✅ |
| ℹ️ Edge: a **duplicate** lead re-requesting the prospectus returns early on `result.duplicate` and does **not** fire the download. Acceptable (dedup), but a returning user is gated out of the file. Candidate future tweak. | `UnifiedLeadForm` L489–495 | ℹ️ |

---

## 4. Regression — routes & resilience

| Route | Renders | Status |
|-------|---------|--------|
| `/` `/about` `/leadership` `/courses` `/departments` `/faculty` `/facilities` `/gallery` `/admissions` `/notices` `/events` `/contact` | lazy page shell under shared `PublicLayout` | ✅ all 12 |
| `/courses/b-com` `/courses/bba` `/courses/bca` `/courses/b-a` | `CourseDetail` via `getCourseBySlug` | ✅ 4 slugs |
| `/courses/{unknown}` | `CourseDetail` renders `<NotFound/>` | ✅ |
| `/thank-you` | standalone, noindex; `sessionStorage` gate | ✅ |
| `*` (unknown) | `<NotFound/>` (navy hero, suggested links) | ✅ |
| `/admin/login` → `/admin/dashboard` `/admin/leads(/:id)` `/admin/notices` `/admin/events` `/admin/settings` | `ProtectedRoute` + `AdminLayout` nested routes; unknown `/admin/*` → dashboard | ✅ |
| Error boundary | top-level `<ErrorBoundary>` wraps the router | ✅ |
| Reduced motion | `MotionConfig reducedMotion="user"` + `prefers-reduced-motion` CSS + per-component `useReducedMotion()` guards | ✅ |
| Mobile nav | bottom nav + slide-in drawer below `lg`, focus-trapped, closes on route change | ✅ |

---

## 5. Console / network

- ✅ `npm run build` (CI=true) compiles with **no ESLint warnings or errors**.
- ✅ No mixed content: all external resources (fonts, Iconify, Cloudinary logo,
  Maps, Samarth, WhatsApp) are `https`.
- ✅ No broken asset references after the §0 fix — every `placeholder()` name and
  every raw `/images/placeholders/*` string resolves to an on-disk `.svg`.
- ℹ️ Admin emits intentional `console.log`/`console.warn` diagnostics during the
  lead sync (`AdminLayout`); these are admin-only and informational, not errors.
- ⚠️ Optional-by-design / `TODO` (client to supply, not defects): social profile
  URLs, gallery YouTube ids, per-programme GU syllabus PDFs, the real prospectus
  PDF, and a real raster `og-default` share image.

---

## Acceptance

- ✅ Documented QA checklist — all green (one issue found **and fixed**; remaining
  items are flagged client `TODO`s, not defects).
- ✅ No broken links / dead anchors / missing `rel`.
- ✅ `npm run build` passes (CI=true, zero warnings).
