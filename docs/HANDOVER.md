# Handover — Icon Commerce College Website & Admin

**Phase 4.7 — Final build verification & handover** (`prompts/40-final-build-verification.md`)
**Date:** 2026-06-06
**Status:** ✅ Ready for handover. Clean production build, every feature-checklist
item verified, all remaining work is **client-supplied content** (tracked below).

This is the single-page handover record: the build-verification result, the
completed acceptance checklist, the security sanity record, and — most
importantly — the **consolidated list of everything the client still needs to
provide** before going fully live. For day-to-day guides see the
[docs index](./README.md); the design/content source of truth is
[`prompts/00-DESIGN-SYSTEM.md`](../prompts/00-DESIGN-SYSTEM.md).

---

## 1. Build verification

| Check | Command | Result |
|-------|---------|--------|
| Clean install | `npm ci` | ✅ exit 0 |
| Production build (warnings → errors) | `CI=true npm run build` | ✅ exit 0 — **zero errors, zero ESLint warnings** |
| Serves with client-side routing | `serve -s build` (or the bundled `.htaccess`) | ✅ home, deep links, assets & SPA fallback all 200 |

**Deep-link / routing smoke** (served `build/` with SPA fallback):

| Request | Expected | Result |
|---------|----------|--------|
| `/` | App shell (Home) | ✅ 200 |
| `/courses/b-com` (deep link) | App shell → React Router renders detail | ✅ 200, serves `index.html` |
| `/admin/dashboard` (deep link) | App shell → protected route | ✅ 200 |
| `/static/js/main.*.js` (real asset) | Served directly, not rewritten | ✅ 200, `text/javascript` |
| `/this-page-does-not-exist` | SPA fallback → React renders 404 | ✅ 200 shell |
| `/robots.txt` | Disallows `/admin/`, `/thank-you` | ✅ correct |

**Bundle (gzipped, this build — see [`docs/performance.md`](./performance.md)):**
`main.*.js` **236 kB** · `main.*.css` **21 kB** · largest lazy chunk **30 kB**
(Swiper/Testimonials, loads on scroll only) · **40 JS + 32 CSS** route/section
chunks. The admin panel is split out of the public entry bundle.

**Production routing/caching** is handled by the bundled `public/.htaccess`
(copied to `build/.htaccess`): SPA rewrite, `/api/` left untouched, long-immutable
caching for hashed assets, always-revalidate HTML, gzip, and the security headers
below. Nginx equivalents are in [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 2. Feature checklist — all verified ✅

- [x] **Modern, responsive, navy + gold multi-page site** — Home, About,
      Leadership, Courses (+ 4 detail pages), Departments, Faculty, Facilities,
      Gallery, Admissions, Notices, Events, Contact, Thank-You, 404
      (`src/pages/*`, routed in `src/App.jsx`).
- [x] **Consolidated courses / departments (no 24-page sprawl)** — exactly 4
      courses (`b-com`/`bba`/`bca`/`b-a`) in `src/data/coursesData.js` (one
      overview + one dynamic detail route); a single departments page grouped
      Arts / Commerce / Science in `src/data/departmentsData.js`.
- [x] **Lead capture → PHP/JSON store → admin** — forms POST to
      `/api/leads.php?action=create` via `src/utils/webhookSubmit.js`; the store
      `api/data/leads.json` is the single source of truth; admin Leads reads/writes
      it via `src/admin/utils/leadService.js` (15s poll).
- [x] **Lead-gated prospectus download; Prospectus removed from main nav** —
      `ProspectusButton` opens the lead drawer and only downloads after a
      successful submit (`src/components/common/ProspectusDownload/`); "Prospectus"
      is absent from `mainNav`/`footerNav` (`src/data/navigation.js`).
- [x] **Admin: Dashboard, Leads (+ detail), Notices CRUD, Events/Calendar CRUD,
      Settings** — `src/admin/pages/{Dashboard,LeadManagement,LeadDetail,Notices,Events,Settings}.jsx`.
- [x] **Admin-posted Notices & Events appear on the public site** — public
      `Notices`/`Events` pages read the same stores via `useNotices()`/`useEvents()`
      (`/api/notices.php`, `/api/events.php`), published-only, with seed fallback.
- [x] **No CIT / engineering / ad-tech leftovers; no tele-calling module** —
      full `src/`+`public/` grep for `CIT`, `tele*`, `engineering`, `B.Tech`,
      `ad-tech`, `dialer`, `callcenter` → **zero** hits.
- [x] **Placeholder images everywhere (named per design-system §7)** — all art
      resolves through `placeholder()` → `public/images/placeholders/*.svg`
      (`src/utils/assets.js`). The only intentional real asset is the brand logo
      (see §4).
- [x] **SEO (titles/meta/canonical/schema), sitemap, robots, manifest** —
      `src/config/seo.js` + `SEOHead` (per-route meta, canonical, Organization /
      CollegeOrUniversity / FAQ / Breadcrumb JSON-LD); `public/sitemap.xml`,
      `public/robots.txt`, `public/manifest.json` all present and correct.
- [x] **Accessibility AA; reduced-motion** — skip-link (`App.jsx`), `alt` enforced
      by `<Img>`, `aria-label` on icon buttons, semantic landmarks, and the
      `prefers-reduced-motion` guard in `src/utils/motion.js`
      (`useReducedMotionVariants`) plus the global `<MotionConfig reducedMotion="user">`.
- [x] **Docs complete** — `README.md` + `docs/{CONTENT_GUIDE,ADMIN_GUIDE,DEPLOYMENT,IMAGES,SEO,performance,qa-checklist}.md`
      and this handover.

> Lighthouse perf/a11y targets and the cross-browser pass are **manual QA steps**
> (this environment has no browser) — see §5.

---

## 3. Security sanity ✅

- **Admin routes `noindex`** — `src/config/seo.js` sets `robots: "noindex, nofollow"`
  for `/admin/*` and `/thank-you`; `public/robots.txt` also `Disallow: /admin/`.
- **Admin protected** — `ProtectedRoute` + `AdminAuthProvider` gate every
  `/admin/*` route behind login.
- **Admin-key handshake documented as *not a secret*** — every `REACT_APP_*` value
  is inlined into the public bundle by CRA, so the admin login and `X-Admin-Key`
  are a **client-side soft gate by design**, not a cryptographic secret. The real,
  server-side key lives in `public/api/config.php` (**git-ignored**; copy from
  `config.example.php`). This matches the design-system note. See §6 for the
  production credential change.
- **No real secrets/PII in the bundle or git** — Google Maps key, GTM id, social
  URLs and hero-video are all empty; `config.php` and `api/data/*.json` are
  git-ignored. The only committed credentials are the documented dev defaults
  (`admin` / `icc@2026` / the shared dev key), which also live in `.env.example`.
- **Data store protected** — `public/api/data/.htaccess` = `Require all denied` /
  `Deny from all`, so the JSON stores are never web-readable.
- **PHP input validation** — endpoints handle CORS/OPTIONS, gate writes on
  `HTTP_X_ADMIN_KEY` (401 on mismatch), and validate the payload
  (`is_array`, required fields, `400`/`404` on bad input) — `public/api/leads.php`,
  `notices.php`, `events.php`.
- **External links hardened** — all 26 `target="_blank"` links carry
  `rel="noopener noreferrer"` (the shared `<Button>` auto-injects it for `_blank`).
- **Security headers** — `.htaccess` sets `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`.

> **Observation (not a defect):** a `.env` with the *dev defaults* is committed
> (it duplicates `.env.example`; both build and app fall back to the same values
> in code, so it carries no information beyond the template). The README's
> intended workflow is "copy `.env.example` → `.env`". Before production, set real
> values in the environment (§6); optionally untrack the committed `.env`
> (`git rm --cached .env` and add `/.env` to `.gitignore`).

---

## 4. The one intentional real asset — the brand logo

Per design-system §1 ("the logo asset stays as supplied"), the **real college
logo** is live (not a placeholder), hosted on Cloudinary:

- `src/utils/assets.js` → `LOGO.normal` / `LOGO.white`
- `src/config/seo.js` → Organization schema `logo`

Everything else is a labelled placeholder. **Optional:** if the client prefers a
fully self-hosted site, download both logo variants into `public/images/` and
repoint those two references.

---

## 5. Cross-browser & Lighthouse (manual QA)

No browser runs in the build/CI environment, so these are **client/QA sign-off
steps**, not automated here. The app targets modern browsers via the production
`browserslist` (`>0.2%`, `not dead`, `not op_mini all`).

- [ ] Latest **Chrome, Firefox, Safari** (desktop) — layout, nav, lead form,
      admin login.
- [ ] **Mobile Chrome / Safari** — drawer, bottom nav, sticky CTAs, forms.
- [ ] **Lighthouse** (mobile preset) — perf & a11y targets per
      [`docs/performance.md`](./performance.md).

The route/link/CTA and data-flow audit is already recorded in
[`docs/qa-checklist.md`](./qa-checklist.md) (Phase 4.5).

---

## 6. Client TODO list — what's still needed to go fully live

None of these block the build or the demo; they are **content/config the college
must supply**. ~50 `TODO` markers in `src/` track these inline. Grouped by theme:

### Credentials & keys (do before production)
- [ ] **Admin login** — set `REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD`
      (currently `admin` / `icc@2026`), then rebuild. *(`src/admin/utils/adminAuth.js`)*
- [ ] **API admin key** — set a private `ADMIN_API_KEY` in `public/api/config.php`
      **and** the matching `REACT_APP_LEADS_ADMIN_KEY` in the build env (they must
      match, or admin writes 401). *(`config.example.php`, `.env`)*

### Real images (drop in with the same filename — no code change)
- [ ] Replace the labelled placeholders in `public/images/placeholders/` with real
      photos (campus, hero, leadership portraits, courses, departments, facilities,
      gallery, events, testimonials). See [`docs/IMAGES.md`](./IMAGES.md) for the
      name → slot → recommended-dimensions map.
- [ ] **Social share image** — swap `og-default.svg` for a real **1200×630**
      raster (JPG/PNG). *(`src/config/seo.js:22`, `public/index.html`)*
- [ ] *(Optional)* self-host the brand logo (see §4).

### Documents
- [ ] **Prospectus PDF** — replace the 1 KB placeholder
      `public/prospectus/icon-commerce-college-prospectus.pdf` with the real
      prospectus (the lead-gated download serves this file in place).
- [ ] **Syllabus links** — set the Gauhati University FYUGP syllabus URL per
      programme (`SYLLABUS_TODO` in `src/data/coursesData.js`, applied at the four
      course objects). Until set, the detail page shows a "syllabus coming soon"
      state.

### Contact, social & analytics
- [ ] **Social URLs** — Facebook / YouTube / Instagram in
      `src/data/collegeInfo.js:63–65` (and `sameAs` / Twitter handle in
      `src/config/seo.js`).
- [ ] **Gallery YouTube IDs** — `src/data/galleryData.js:58,63,68`.
- [ ] **Google Maps** — set `REACT_APP_GOOGLE_MAPS_API_KEY` (optional) and verify
      the Chandmari `geo` coordinates in `src/config/seo.js`.
- [ ] **GTM / analytics** — set `REACT_APP_GTM_ID` and `REACT_APP_ENABLE_ANALYTICS=true`
      when ready (see [`GTM_GUIDE.md`](../GTM_GUIDE.md)).

### Content to confirm
- [ ] **Event dates** — confirm the 2026-27 dates in `src/data/seedEvents.js`
      (`TODO (client)`), or manage them entirely from the admin Events module.
- [ ] **History & stats** — verify the years in `src/pages/About/About.jsx` and the
      "soft" counters (18+ departments, 40+ faculty, 1000s alumni) in
      `src/data/statsData.js`.

---

## 7. Deploy in one glance

1. Set the production env vars (§6), then `npm run build`.
2. Upload the contents of `build/` to a **PHP-capable** web root.
3. Ship `api/` with the build; make `api/data/` **writable** by PHP.
4. Copy `api/config.example.php` → `api/config.php`, set `ADMIN_API_KEY`.
5. Serve over **HTTPS**; confirm `robots.txt` / `sitemap.xml` use the real domain.

Full step-by-step: [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md).
</content>
</invoke>
