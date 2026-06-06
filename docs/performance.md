# Performance & Image Handling

How the Icon Commerce College site stays fast, and what to keep in mind when
swapping placeholders for real assets. Companion docs:
[`IMAGES.md`](./IMAGES.md) (asset swap + dimensions) and
[`DEPLOYMENT.md`](./DEPLOYMENT.md) (host config / caching / SPA routing).

> Numbers below are from a production build (`npm run build`) with the bundled
> SVG placeholders. Re-measure after dropping in real photography.

---

## 1. Code-splitting

- **Every route is `React.lazy`-loaded** in `src/App.jsx` (`Suspense` +
  `PageLoader` fallback), so each page ships as its own chunk.
- **The admin panel is split from the public bundle.** `AdminLayout` is lazy,
  and each admin page (Dashboard, Leads, Notices, Events, Settings) is further
  lazy-loaded inside it — none of that code is in the public entry bundle.
- **Heavy Home sections are code-split.** `src/pages/Home/Home.jsx` renders the
  hero + highlights eagerly (above the fold / LCP) and lazy-loads everything
  below the fold. The **Swiper** carousel (Testimonials) lands in its own
  ~30 kB-gzip chunk that only downloads when that section scrolls into view — it
  never touches the main bundle or any other page.
- **Idle preload of likely-next routes.** After first paint, `App` preloads the
  **Courses** and **Admissions** chunks during browser idle time
  (`requestIdleCallback`, with a `setTimeout` fallback for Safari). `lazy()` and
  the preloader share the same import thunk, so navigation to those pages is
  instant without competing with the initial render.

## 2. Images — the `<Img>` component

`src/components/common/Img` is the single image primitive used everywhere
(`grep -r "<img" src` returns only the component's own internals). It is a
drop-in `<img>` replacement that bakes in:

| Concern | Default behaviour |
| --- | --- |
| Lazy loading | `loading="lazy"` + `decoding="async"` (off the critical path) |
| Above-the-fold | `priority` prop → `loading="eager"` + `fetchpriority="high"` |
| CLS | forwards `width`/`height`/`aspectRatio`; per-component CSS keeps the box reserved |
| Loading state | gold→white shimmer placeholder, cleared on load, reduced-motion safe |
| Resilience | `onError` falls back to the labelled §7 placeholder (guarded against loops) |

It renders a **single `<img>`** and forwards `className` untouched, so existing
per-component sizing / `object-fit` / `border-radius` (which already prevent
layout shift) are preserved exactly — a behavioural upgrade, not a layout
change. The hero is a CSS background image, so it gets `fetchpriority="high"` via
a `<link rel="preload" as="image">` in `public/index.html` instead (see
[`IMAGES.md`](./IMAGES.md)).

## 3. Fonts

Loaded once, optimally, in `public/index.html`:

- `preconnect` to `fonts.googleapis.com` + `fonts.gstatic.com`.
- `display=swap` (no invisible text; text paints immediately in the system-font
  fallback, then swaps).
- **Subset to the weights actually used:** Inter 400/500/600 + Poppins 600/700.
- The redundant JS-injected font `<link>` in `src/index.js` (which pulled a
  wider 300–800 weight range, costing an extra request and a swap shift) was
  removed — `index.html` is now the single source.

## 4. Bundle hygiene

Removed dead dependencies left over from the boilerplate (verified 0 imports
across `src/`):

- **`@mui/lab`** — unused.
- **`react-intersection-observer`** — unused; the app has its own
  `src/hooks/useInView.js` on the native `IntersectionObserver`.

(Neither was bundled, since neither was imported — removal trims `node_modules`
and the manifest, not runtime size.) Added **`source-map-explorer`** to
`devDependencies` so `npm run analyze` works. **Swiper is retained** because the
Testimonials carousel uses it, and it is isolated to that one lazy chunk.

### Bundle sizes (gzipped, this build)

| Asset | Size (gzip) | Notes |
| --- | --- | --- |
| `main.*.js` | **236 kB** | shared entry — React, MUI core, Framer Motion, Emotion, Router, chrome |
| `main.*.css` | **21 kB** | global + shared styles |
| largest lazy chunk | **30 kB** | Swiper + Testimonials (loads on scroll only) |
| route/section chunks | ~1–12 kB each | 40 JS + 32 CSS chunks total |

Run `npm run analyze` (after `npm run build`) for the interactive treemap. The
biggest single contributor to `main.*.js` is MUI; reducing it further (slimmer
imports / a lighter UI layer) is a deliberate future task, not part of this pass.

## 5. Lighthouse (mobile)

**Targets:** Performance ≥ 90, Best-Practices ≥ 95 on Home (with placeholders).

This build can't be scored inside CI (no Chrome in the sandbox). Measure against
a served build or the deployed preview:

```bash
npm run build
npx serve -s build           # serve the production build locally
npx lighthouse http://localhost:3000 \
  --preset=perf --form-factor=mobile --only-categories=performance,best-practices
```

…or paste the deployed URL into [PageSpeed Insights](https://pagespeed.web.dev/).

What this pass does for each metric:

- **LCP** — hero image preloaded at high priority; fonts `display=swap` +
  preconnect; above-the-fold hero/highlights kept eager while everything else is
  split out.
- **CLS** — images keep a reserved box (`aspect-ratio` / `width`+`height`);
  fonts swap against a system-font fallback; lazy section fallbacks reserve
  height (`Home.jsx`).
- **TBT / main-thread** — route + section code-splitting; idle (not eager)
  preloading; passive scroll listeners.
- **Best-Practices** — every image has `alt`; no console errors on touched
  routes; security headers + correct caching via `.htaccess`; HTTPS on the host.

Record the actual scores in the PR once measured on the preview. With the SVG
placeholders the page is very light; the real test is after high-resolution
photography is added — follow [`IMAGES.md`](./IMAGES.md) so it stays fast.
