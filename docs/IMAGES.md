# Images — placeholders & the production swap

The site ships with **labelled SVG placeholders** (navy/gold cards printed with
the filename + dimensions) under `public/images/placeholders/`, so every layout is
final before real photography exists. This is the complete list of slots, the
recommended size for each, and how to swap them in without touching component
code.

See also [`performance.md`](./performance.md) for the `<Img>` component and
[design-system §7](../prompts/00-DESIGN-SYSTEM.md) for the canonical name rule.

---

## How image paths resolve

Components never hardcode image paths. They call `placeholder('hero-campus')`
from **`src/utils/assets.js`**, which currently maps every logical name to
`/images/placeholders/<name>.svg` (the files the `npm run gen:placeholders`
script generates). So there is **one resolver** to point at real files.

> **Brand logo — already real.** The live logo is hosted on Cloudinary and
> centralised in `src/utils/assets.js` (`LOGO.normal` for light backgrounds,
> `LOGO.white` for dark, with `LOGO_SIZE` for CLS-safe dimensions). The header
> switches variant by background, the footer uses the white variant.
> `res.cloudinary.com` is preconnected in `index.html`. To change the logo, edit
> those two URLs. (A `logo-icon-commerce` placeholder still exists as a fallback.)

> **Campus photo — already real.** The college campus photograph is live too,
> via the same Cloudinary account, as `CAMPUS_IMAGE` in `src/utils/assets.js`.
> A small `REAL` override map in that file points the three campus slots —
> `hero-campus`, `about-college-building` and `about-campus-aerial` — at it, so
> every campus hero/building image across the site (home hero, About, Facilities,
> Contact, Leadership) uses the real photo without any component change. The Home
> hero LCP preload in `index.html` points at the same URL. To change the campus
> photo, edit `CAMPUS_IMAGE` (and the matching preload `href`).

> **Home-section photos — already real.** The Vision &amp; Mission accent
> (`vision-mission`), the four programme cards (`course-bcom`, `course-bba`,
> `course-bca`, `course-ba`) and the "why choose us" band (`why-choose-icc`, a
> dedicated name so the shared `hero-students` heroes stay untouched) are all
> live via the same `REAL` map in `src/utils/assets.js`. The course names flow
> through `coursesData`, so the real images also appear on the Courses cards and
> detail pages. To change any of them, edit its URL in `REAL`.

---

## Option A — drop-in replace (simplest, no code)

For any slot, replace the placeholder **file** with a real image **of the same
name**, and the site uses it immediately:

```
public/images/placeholders/hero-campus.svg   →  put a real hero-campus.svg here
```

This is the path the admin Settings "Swapping placeholder images" card describes.
It works, but you're constrained to the `.svg` extension and the placeholder
folder.

## Option B — real photos under `public/images/` (recommended)

1. **Add optimised files** under `public/images/` using the same kebab-case
   names, e.g. `public/images/hero-campus.jpg`, `public/images/course-bcom.webp`.
   Prefer **WebP/AVIF** (keep a JPG for OG/social), compress to ~80 quality, and
   export at roughly **2×** the display size from the table below.
2. **Point the resolver at them** in `src/utils/assets.js` — flip the default
   directory/extension, or add a small per-name override map:
   ```js
   // src/utils/assets.js — production override example
   const REAL = {
     'hero-campus': '/images/hero-campus.jpg',
     'course-bcom': '/images/course-bcom.webp',
     // …only the names you actually have real files for
   };
   export function placeholder(name) {
     const base = String(name).replace(/^.*\//, '').replace(/\.\w+$/, '');
     return REAL[base] || `/images/placeholders/${base}.svg`; // graceful fallback
   }
   ```
   Anything without a real file keeps its labelled placeholder, and `<Img>`'s
   `onError` fallback covers a mistyped path.
3. **Update the hero preload** in `public/index.html` to the real hero file and
   MIME type so the LCP keeps its high-priority head start:
   ```html
   <link rel="preload" as="image" href="%PUBLIC_URL%/images/hero-campus.jpg"
         type="image/jpeg" fetchpriority="high" />
   ```
4. **Swap the social share image** — replace `og-default` with a real **1200×630
   raster** (JPG/PNG; social platforms don't render SVG) and update the
   references in `public/index.html` and `src/config/seo.js`.
5. **Rebuild** (`npm run build`) and re-check Lighthouse (see `performance.md`).

> Tip: keep large source files out of git; commit only the optimised, web-ready
> versions.

---

## Recommended dimensions per slot

Intrinsic export sizes. Ship ~2× for crisp rendering on high-DPI phones, then let
the CSS box scale them down.

| Slot (logical name) | Size (px) | Aspect | Used on |
| --- | --- | --- | --- |
| `logo-icon-commerce` | 360 × 96 | ~15:4 | header, footer, drawer, admin login (logo is live via Cloudinary) |
| `favicon` | 256 × 256 | 1:1 | browser tab / PWA |
| `hero-campus`, `hero-students`, `hero-library` | 1600 × 900 | 16:9 | home + page heroes (LCP) |
| `about-college-building`, `about-campus-aerial`, `vision-mission` | 1200 × 800 | 3:2 | About / Vision sections |
| Leadership portraits — `principal-dr-mandira-saha`, `president-dipali-bora`, `advisor-debasish-bora`, `rector-sawpon-dowerah`, `director-academic-rajib-das`, `director-dipanju-bora`, `academic-advisor-nilanjan-bhattacharjee` | 600 × 750 | 4:5 | Leadership |
| `course-bcom`, `course-bba`, `course-bca`, `course-ba` | 800 × 600 | 4:3 | Courses cards/detail |
| `dept-arts`, `dept-commerce`, `dept-science` | 800 × 600 | 4:3 | Departments |
| `facility-library`, `facility-computer-lab`, `facility-canteen`, `facility-playground`, `facility-smart-classroom`, `facility-wifi` | 800 × 600 | 4:3 | Facilities |
| `faculty-placeholder` | 600 × 750 | 4:5 | Faculty cards (one shared placeholder) |
| `gallery-1` … `gallery-12` | 800 × 600 | 4:3 | Gallery (masonry crops these) |
| `event-college-week`, `event-cooking-competition`, `event-icon-shield`, `event-icon-trophy` | 1200 × 800 | 3:2 | Events |
| `testimonial-avatar` | 400 × 400 | 1:1 | Testimonials (one shared placeholder) |
| `prospectus-cover` | 800 × 1100 | ~3:4 | prospectus / admissions |
| `map-location` | 1200 × 600 | 2:1 | footer map thumbnail |
| `og-default` | 1200 × 630 | 1.91:1 | social share card — **keep as JPG/PNG** |

---

## Complete placeholder list (on disk)

All 48 names currently in `public/images/placeholders/` (as `.svg`):

```
logo-icon-commerce      favicon                 og-default
hero-campus             hero-students           hero-library
about-college-building  about-campus-aerial     vision-mission
president-dipali-bora           advisor-debasish-bora
principal-dr-mandira-saha       rector-sawpon-dowerah
director-academic-rajib-das     director-dipanju-bora
academic-advisor-nilanjan-bhattacharjee
course-bcom   course-bba   course-bca   course-ba
dept-arts     dept-commerce dept-science
facility-library  facility-computer-lab  facility-canteen
facility-playground  facility-smart-classroom  facility-wifi
faculty-placeholder   testimonial-avatar
gallery-1 … gallery-12
event-college-week  event-cooking-competition  event-icon-shield  event-icon-trophy
prospectus-cover    map-location
```

If you need a **new** slot, add it to `scripts/gen-placeholders.mjs` (so the dev
placeholder generates) and reference it via `placeholder('new-name')` in
`src/utils/assets.js`, using the same kebab-case rule — and note it in the PR.

---

## The prospectus PDF

The lead-gated prospectus download is a real file at
`public/prospectus/icon-commerce-college-prospectus.pdf` (currently a small
placeholder). Replace it in place with the real prospectus, keeping the filename.
