# Prompt 04 — Routing Scaffold & Page Shells

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§5 site map).
**Depends on:** 01–03.
**Goal:** Turn the single-page app into a proper multi-page router with a shared public
layout, lazy-loaded page shells, scroll restoration, and a 404 — so later prompts just
fill each page in.

## Tasks

1. **Public layout** — `src/components/layout/PublicLayout.jsx`:
   renders `<Header/>` + `<main>` (Outlet) + `<Footer/>` + global lead drawer + floating
   enquiry/WhatsApp + BackToTop + mobile bottom nav. Use `react-router` `<Outlet/>`.
   (Header/Footer get rebuilt in 05/06; import the existing stubs for now.)

2. **ScrollToTop** — `src/components/layout/ScrollToTop.jsx`: on route change scroll to top
   (unless there's a hash, then smooth-scroll to the anchor with header offset — reuse the
   existing hash logic from `App.jsx`).

3. **Router** — refactor `src/App.jsx` to:
   ```
   <BrowserRouter>
     <ThemeProviders/> <SEOHead/> <ScrollToTop/>
     <Routes>
       <Route element={<PublicLayout/>}>
         /  about  leadership  courses  courses/:slug  departments
         faculty  facilities  gallery  admissions  notices  events  contact
       </Route>
       /thank-you
       /admin/login,  /admin/*  (existing protected admin shell)
       *  -> NotFound
     </Routes>
   </BrowserRouter>
   ```
   Lazy-load every page with `React.lazy` + a shared `<PageLoader/>` Suspense fallback
   (navy spinner). Keep the ErrorBoundary wrapper.

4. **Page shells** — create `src/pages/<Name>/<Name>.jsx` for: Home, About, Leadership,
   Courses, CourseDetail, Departments, Faculty, Facilities, Gallery, Admissions, Notices,
   Events, Contact, NotFound. Each shell renders a `<PageHero title/>` (placeholder built
   in 07) + a "Coming soon" block + correct `document.title`. CourseDetail reads `:slug`
   and 404s on unknown slug.

5. **NotFound** — friendly 404 with navy hero, "Back to Home" CTA, suggested links.

6. Remove the old all-in-one `HomePageContent` once Home shell exists (Home content is
   assembled across prompts 11–14).

## Acceptance criteria
- Every route in §5 renders its shell without errors; unknown URL → 404; unknown course
  slug → 404.
- Browser back/forward + scroll restoration work; hash links still smooth-scroll.
- `npm run build` passes; route-level code-splitting visible in build output.

## PR
Draft PR "Phase 0.4 — Multi-page routing scaffold". Include a route list. Update `CHANGELOG.md`.
