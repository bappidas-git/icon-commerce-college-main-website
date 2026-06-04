# Prompt 06 — Footer

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§1, §6 contact).
**Depends on:** 01–05.
**Goal:** Replace the CIT footer with a polished, informative multi-column footer.

## Tasks — `src/components/common/Footer/Footer.jsx`

1. **Top band (navy gradient)** with 4–5 columns:
   - **About** — logo + 2-line description + social icons (Facebook/YouTube/Instagram, TODO links).
   - **Quick Links** — About, Courses, Departments, Admissions, Gallery, Contact.
   - **Programs** — B.Com, BBA, BCA, BA (link to `/courses/:slug`).
   - **Reach Us** — full address, both phones (click-to-call), email (mailto), office hours.
   - **Admissions** — Samarth pill (College Code 842), "Download Prospectus" button
     (opens lead-gated prospectus flow — built in 23), "Apply Now" CTA.

2. **Accreditation / affiliation strip** — "Affiliated to Gauhati University · NEP 2020 ·
   Samarth Code 842 · Estd. 2004" with small badge chips (gold borders).

3. **Newsletter / enquiry mini-strip (optional)** — single email+mobile inline field that
   feeds the lead store (source `footer`). Keep minimal; can defer wiring to prompt 08.

4. **Map** — small embedded Google Map (iframe by `mapsQuery`) or `map-location.jpg`
   placeholder linking to Google Maps.

5. **Bottom bar** — "© <year> Icon Commerce College. All rights reserved." + Privacy
   Policy / Terms links (open existing Modal with placeholder legal copy) + a discreet
   "Admin" link to `/admin/login`.

## Design
- Navy bg, gold section headings + dividers, muted-white body text, hover underlines.
- Fully responsive: columns stack on mobile, address/phone tappable.

## Acceptance criteria
- All links valid; phones/email/Samarth work; map renders; responsive at 360/768/1280.
- No CIT/engineering references; `npm run build` passes.

## PR
Draft PR "Phase 0.6 — Footer". Update `CHANGELOG.md`.
