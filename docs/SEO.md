# SEO Guide

SEO for the site is **centralised and data-driven**. Almost everything you'll
edit is in one file — **`src/config/seo.js`** — with `public/index.html` holding
static fallbacks for crawlers that don't run JavaScript, and
`public/sitemap.xml` / `public/robots.txt` carrying the domain.

| Where | What it holds |
|-------|---------------|
| `src/config/seo.js` | Site-level settings, per-route titles/descriptions/keywords, schema.org data, FAQs |
| `src/utils/seo.js` + `src/components/common/SEO` | Runtime injection of `<title>`, meta tags and JSON-LD from the config above |
| `public/index.html` | Static `<title>`, meta and JSON-LD fallbacks |
| `public/sitemap.xml` | One `<url>` per public route |
| `public/robots.txt` | Allow/disallow + `Sitemap:` / `Host:` |

After any change, `npm run build` and redeploy (these are baked in at build time).

---

## 1. Site-level settings — `seoConfig`

Top of `src/config/seo.js`:

```js
siteName: "Icon Commerce College",
siteUrl: "https://iconcommercecollege.in",          // ← your production URL
defaultTitle: "Icon Commerce College, Guwahati | …",
titleTemplate: "%s | Icon Commerce College",         // inner pages
defaultDescription: "…",
defaultImage: "/images/placeholders/og-default.svg", // ← swap to a real raster
locale: "en_IN",
twitterHandle: "",                                   // TODO: set @handle
```

- **`siteUrl`** drives canonical URLs and the schema — set it to the real domain.
- **`defaultImage`** is the social share card. It currently points at the SVG
  placeholder so the URL resolves; **replace it with a real 1200×630 JPG/PNG**
  (social platforms don't render SVG) and update the matching `og:image` /
  `twitter:image` in `public/index.html`. See [`IMAGES.md`](./IMAGES.md).

---

## 2. Per-route metadata — `seoConfig.pages`

Every public route has an entry with `crumb` (breadcrumb label), `title`,
`description` and `keywords`:

```js
pages: {
  home:    { crumb: "Home",    title: "…", description: "…", keywords: "…" },
  courses: { crumb: "Courses", title: "…", description: "…", keywords: "…" },
  // …about, leadership, departments, faculty, facilities, gallery,
  //   admissions, notices, events, contact…
  thankYou: { crumb: "Thank You", title: "…", robots: "noindex, nofollow" },
  notFound: { crumb: "Page Not Found", title: "…", robots: "noindex, follow" },
  admin:    { crumb: "Admin", title: "…", robots: "noindex, nofollow" },
}
```

To re-word a page's title/description, edit its entry here. Keep **titles ≤ ~60
chars** and **descriptions ≤ ~160 chars**. Course **detail** pages
(`/courses/:slug`) generate their metadata at runtime from `coursesData.js`, so
you don't hand-write an entry per course.

**Noindex routes** (`/thank-you`, `/admin/*`, the 404) are handled by the
`robots` field above — no `.htaccess` rules needed.

---

## 3. Schema.org (JSON-LD)

Generated at runtime from `seoConfig`; static copies in `index.html` are
fallbacks. You only edit the config.

- **Organization / CollegeOrUniversity** — `seoConfig.organization` and
  `seoConfig.localBusiness`: name, `url`, `logo`, `phone`, `email`, `address`,
  `foundingDate`, opening hours, the UG `courses` catalog, and:
  - **`sameAs`** — add the official Facebook/YouTube/Instagram URLs (currently
    `[]`, a `TODO`).
  - **`geo`** — add the campus latitude/longitude (currently empty, a `TODO`).
- **FAQPage** — `seoConfig.faqs`: `{ question, answer }` pairs (rendered on Home +
  Admissions and emitted as FAQ rich-result schema). The Admissions page also
  pulls from `admissionFaqs` in `src/data/admissionData.js`.
- **BreadcrumbList** — built from each page's `crumb`.

Validate with Google's [Rich Results Test](https://search.google.com/test/rich-results).

---

## 4. Sitemap & robots — set your domain

**`public/sitemap.xml`** — one `<url>` per public route. Update every `<loc>` to
your domain and bump `<lastmod>`. Exclude `/admin/*`, `/thank-you` and `/api/*`
(they're not listed, and shouldn't be).

**`public/robots.txt`:**

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin
Disallow: /thank-you

Sitemap: https://iconcommercecollege.in/sitemap.xml
Host: https://iconcommercecollege.in
```

Update the `Sitemap:` and `Host:` lines to your production domain.

---

## 5. Outstanding `TODO`s for launch

- Set `twitterHandle` once the college has an official handle.
- Fill `organization.sameAs` with the real social profile URLs (also update
  `collegeInfo.social` in `src/data/collegeInfo.js`).
- Fill `localBusiness.geo` with the Chandmari campus coordinates.
- Replace `og-default` with a real 1200×630 raster share image.

---

## 6. Pre-deploy checklist

- [ ] `siteUrl` and all `sitemap.xml` `<loc>`s use the production domain.
- [ ] `robots.txt` `Sitemap:`/`Host:` use the production domain.
- [ ] Real 1200×630 OG image in place; `og:image`/`twitter:image`/`defaultImage`
      agree.
- [ ] Titles ≤ 60 chars, descriptions ≤ 160 chars.
- [ ] `/admin/*` and `/thank-you` resolve to `noindex`.
- [ ] Schema validates in the Rich Results Test.
- [ ] Sitemap submitted to Google Search Console.
