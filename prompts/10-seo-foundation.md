# Prompt 10 — SEO Foundation

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§1, §5).
**Depends on:** 01–09.
**Goal:** Per-route SEO with correct titles/meta/canonical/OG + schema.org for an
educational institution, plus sitemap/robots/manifest.

## Tasks

1. **SEO config** — `src/config/seo.js`: `siteName`, `siteUrl` (`https://iconcommercecollege.in`),
   default title/description/OG image (`og-default.jpg`), organization block
   (CollegeOrUniversity: name, alternateName "ICC", url, logo, address from §6, phone,
   email, sameAs social TODO), and a `pages` map with title/description/keywords/robots for
   every route in §5 (admin + thank-you = `noindex,nofollow`). Add `faqs[]` for the FAQ schema.

2. **SEOHead** — `src/components/common/SEO/SEOHead.jsx`: on route change set
   `<title>`, meta description, canonical, OG/Twitter tags from the `pages` map (with
   per-page overrides via props so detail pages, e.g. each course, set their own).
   Inject JSON-LD: Organization/CollegeOrUniversity (once), WebSite + SearchAction,
   BreadcrumbList (from current route), FAQPage (on Home/Admissions), and `Course` schema on
   course detail pages. Remove schemas on admin routes. Keep the direct-DOM approach (no
   react-helmet) consistent with the boilerplate.

3. **Per-page hook** — export `useSeo(overrides)` or accept props so pages built in Phase 2
   can pass `{title, description, image, schema}`.

4. **Static files**
   - `public/sitemap.xml` — list all public routes (incl. 4 course slugs) with the real domain.
   - `public/robots.txt` — allow all, disallow `/admin`, point to sitemap.
   - `public/manifest.json` — name "Icon Commerce College", theme `#1A2A52`, icons
     (favicon/apple-touch placeholders), shortcuts (Courses, Admissions, Contact).
   - `public/index.html` — base meta, OG defaults, favicon links, JSON-LD fallback for crawlers w/o JS (optional).

## Acceptance criteria
- Each route shows the correct title/description/canonical (verify via View Source after build).
- Rich-Results test passes for Organization, Breadcrumb, FAQ, and a sample Course page.
- Admin/Thank-You are `noindex`; sitemap/robots valid.
- `npm run build` passes.

## PR
Draft PR "Phase 1.4 — SEO foundation & schema". Update `CHANGELOG.md`.
