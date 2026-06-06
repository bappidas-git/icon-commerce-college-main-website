# Icon Commerce College — Website & Admin

The official, mobile-first **multi-page website** and **admin panel** for
**Icon Commerce College, Guwahati** (আইকন কমাৰ্চ কলেজ) — a Commerce, Arts &
Computer Application college established in **2004** under the **Icon Academy
Trust** and affiliated to **Gauhati University** (NEP 2020 / FYUGP).

The public site presents the college — programs, departments, faculty,
facilities, admissions — and captures admission enquiries (leads). A
password-protected admin panel lets staff manage those leads and publish
notices and events. Built with **React 18**, **Material UI v5** and
**Framer Motion**.

- **Programs:** B.Com · BBA · BCA · B.A. (all FYUGP, Gauhati University)
- **Admissions:** via the Samarth portal — **College Code 842**
- **No database:** all site content is version-controlled in `src/data/*`;
  leads, notices and events use a small **PHP + JSON** store under `public/api/`.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| UI framework | React 18 (route-level `React.lazy` + `Suspense`) |
| Component lib | Material UI v5 (`@mui/material`, `@emotion/*`) |
| Animation | Framer Motion (guarded by `prefers-reduced-motion`) |
| Styling | CSS Modules + CSS Custom Properties (`src/styles/variables.css`) |
| Routing | React Router v7 |
| Icons | Iconify (`@iconify/react`, MDI set) |
| Alerts | SweetAlert2 |
| Carousel | Swiper (testimonials only, lazy-loaded) |
| Tooling | Create React App (`react-scripts`), `source-map-explorer` |
| Backend | PHP 7+ JSON file stores (`public/api/*.php`) — no DB |

---

## Project structure

```
icon-commerce-college-main-website/
├── public/
│   ├── api/                  # PHP + JSON stores (leads, notices, events)
│   │   ├── leads.php  notices.php  events.php
│   │   ├── config.example.php   # → copy to config.php, set ADMIN_API_KEY
│   │   └── data/             # JSON written here (must be writable)
│   ├── images/placeholders/  # labelled SVG placeholders (swap for real photos)
│   ├── prospectus/           # downloadable prospectus PDF (lead-gated)
│   ├── index.html  manifest.json  robots.txt  sitemap.xml  .htaccess
├── src/
│   ├── components/sections/  # page sections
│   ├── components/common/    # Header, Footer, Img, UnifiedLeadForm, SEO, …
│   ├── data/                 # ← all editable site content lives here
│   ├── config/seo.js         # per-route SEO metadata + schema.org
│   ├── context/              # Modal + Theme providers
│   ├── hooks/                # useGTMTracking, useNotices, useEvents, …
│   ├── utils/                # webhookSubmit, gtm, validators, assets, seo, …
│   ├── admin/                # admin panel (pages, components, context, utils)
│   ├── pages/                # full route pages (Home, About, Courses, …)
│   ├── theme/muiTheme.js     # MUI theme (mirrors the CSS tokens)
│   └── App.jsx               # lean router (lazy routes)
├── scripts/gen-placeholders.mjs   # regenerates the labelled placeholders
├── docs/                     # this documentation set
└── prompts/                  # the phased rebuild plan (00-DESIGN-SYSTEM first)
```

---

## Local development

**Prerequisites:** Node.js 18+ and npm.

```bash
npm install              # install dependencies
cp .env.example .env     # then fill in the values (see the table below)
npm start                # dev server at http://localhost:3000
npm run build            # production build → build/
```

Other scripts:

| Script | Purpose |
|--------|---------|
| `npm run gen:placeholders` | Regenerate the labelled SVG placeholders in `public/images/placeholders/` |
| `npm run analyze` | After `npm run build`, open an interactive bundle treemap |
| `npm test` | CRA test runner |

> **PHP note:** `npm start` serves the React app only. The lead / notice / event
> forms POST to PHP endpoints, so to exercise them locally run the build behind a
> PHP-capable server (e.g. `php -S localhost:8000 -t build`) or test against a
> staging host. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Environment variables

Only the variables below are read by the app (CRA inlines `REACT_APP_*` at
**build time** — change one and you must rebuild). Copy `.env.example` to `.env`
and set them.

| Variable | Required | Default | Purpose |
|----------|:--------:|---------|---------|
| `REACT_APP_LEADS_API_URL` | ✅ | `/api/leads.php` | Leads endpoint. Use a full URL only if the API lives on another domain. |
| `REACT_APP_NOTICES_API_URL` | ✅ | `/api/notices.php` | Notices endpoint. |
| `REACT_APP_EVENTS_API_URL` | ✅ | `/api/events.php` | Events endpoint. |
| `REACT_APP_LEADS_ADMIN_KEY` | ✅ | committed dev key | Shared admin handshake (`X-Admin-Key`) for list/create/update/delete. **Must match** `ADMIN_API_KEY` in `public/api/config.php`. |
| `REACT_APP_ADMIN_USERNAME` | ✅ | `admin` | Admin panel login username. |
| `REACT_APP_ADMIN_PASSWORD` | ✅ | `icc@2026` | Admin panel login password. **Change for production.** |
| `REACT_APP_GTM_ID` | optional | _(empty)_ | Google Tag Manager container id, e.g. `GTM-XXXXXXX`. |
| `REACT_APP_ENABLE_ANALYTICS` | optional | `false` | Master analytics switch — set `true` only when `REACT_APP_GTM_ID` is set. |

> **Heads-up:** the other `REACT_APP_*` entries in `.env.example` (phone, email,
> address, maps key, social URLs, hero video, etc.) are **not wired to the UI** —
> they're informational placeholders. The college's real identity and contact
> details live in **`src/data/collegeInfo.js`**, not in env. Edit them there.

The leads/notices/events stores share **one** admin key. A mismatch between
`REACT_APP_LEADS_ADMIN_KEY` and the server's `ADMIN_API_KEY` returns `401` and
silently breaks every admin write — see [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md#the-admin-key-handshake).

---

## Editing site content (no database)

All public-facing copy is plain data in **`src/data/*`** — edit the file, rebuild,
redeploy. Full walkthrough in [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md).

| Content | File |
|---------|------|
| College identity, address, phones, email, social | `src/data/collegeInfo.js` |
| Courses (B.Com / BBA / BCA / B.A.) — fees, eligibility, careers | `src/data/coursesData.js` |
| Departments (Arts / Commerce / Science) | `src/data/departmentsData.js` |
| Leadership "From the Desk of …" messages | `src/data/leadershipData.js` |
| Faculty / teaching staff | `src/data/facultyData.js` |
| Facilities | `src/data/facilitiesData.js` |
| Gallery (photos + videos) | `src/data/galleryData.js` |
| Testimonials / alumni | `src/data/testimonialsData.js` |
| Home stats counters | `src/data/statsData.js` |
| Admission steps, documents, FAQs | `src/data/admissionData.js` |
| Header / footer navigation | `src/data/navigation.js` |
| Seed notices / events (fallback before admin posts) | `src/data/seedNotices.js` · `src/data/seedEvents.js` |
| SEO titles / descriptions / schema | `src/config/seo.js` |

**Notices and events** are managed at runtime from the **admin panel** (no code) —
see [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md).

---

## Images

The site ships with **labelled SVG placeholders** under
`public/images/placeholders/`. To go live, drop a real photo in with the **same
filename** — no code change needed. Recommended dimensions per slot and the
full workflow are in [`docs/IMAGES.md`](docs/IMAGES.md).

---

## Leads, notices & events storage

There is **no database**. Each is a small server-side **JSON store** written by a
PHP endpoint, and that store is the **single source of truth**:

- Public forms `POST` to `/api/leads.php` → `api/data/leads.json`.
- The admin panel reads/writes the same stores (polling every 15s), so every
  browser and device sees identical data. There is **no** `localStorage` copy.
- **Notices** (`notices.php`) and **events** (`events.php`) copy this exact
  pattern, including the shared admin-key handshake.

Lock the API to a private key by setting `ADMIN_API_KEY` in
`public/api/config.php` and the matching `REACT_APP_LEADS_ADMIN_KEY` in `.env`.
See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Admin panel

Visit `/admin/login` (linked from the footer). Sign in with the
`REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD` credentials. The panel
provides a **Dashboard**, **Leads** (statuses, notes, CSV export), **Notices**,
**Events** (list + calendar) and **Settings**. All admin routes are `noindex`.
Full walkthrough: [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md).

---

## Deployment (summary)

1. Set env vars, then `npm run build`.
2. Upload the contents of `build/` to a **PHP-capable** host's web root.
3. Ensure `api/` ships with the build and `api/data/` is **writable** by PHP.
4. Copy `public/api/config.example.php` → `config.php` and set `ADMIN_API_KEY`
   (matching `REACT_APP_LEADS_ADMIN_KEY`).
5. The bundled `.htaccess` handles SPA routing, caching and compression.
6. Serve over **HTTPS**; confirm `robots.txt` / `sitemap.xml` use your domain.

Step-by-step: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Documentation

| Doc | What it covers |
|-----|----------------|
| [`prompts/00-DESIGN-SYSTEM.md`](prompts/00-DESIGN-SYSTEM.md) | **Single source of truth** — design tokens, content data, site map, conventions |
| [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) | Edit every kind of content without writing code |
| [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md) | Login, leads, notices, events, settings, cross-device sync |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Build, upload, PHP/`.htaccess`, env/config, HTTPS, SEO |
| [`docs/IMAGES.md`](docs/IMAGES.md) | Placeholder names, dimensions and the swap workflow |
| [`docs/SEO.md`](docs/SEO.md) | Titles, descriptions, schema.org, sitemap & robots |
| [`docs/performance.md`](docs/performance.md) | Code-splitting, the `<Img>` component, bundle sizes |
| [`docs/qa-checklist.md`](docs/qa-checklist.md) | Cross-page QA & link audit record |
| [`GTM_GUIDE.md`](GTM_GUIDE.md) | Optional Google Tag Manager / analytics setup |
| [`CHANGELOG.md`](CHANGELOG.md) | Detailed, phase-by-phase changelog |

---

## License

UNLICENSED — © Icon Commerce College.
