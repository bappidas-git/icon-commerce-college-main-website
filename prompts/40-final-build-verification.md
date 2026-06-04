# Prompt 40 — Final Build Verification & Handover

**Read first:** `prompts/00-DESIGN-SYSTEM.md`.
**Depends on:** all prompts 01–39 merged.
**Goal:** A final, holistic verification pass and handover-ready state.

## Tasks

1. **Clean build** — fresh `npm ci && npm run build` with zero errors and no new ESLint
   warnings. Confirm production build serves correctly (`serve build` or equivalent) with
   client-side routing + deep links (with the documented `.htaccess`).

2. **Feature checklist (must all pass):**
   - [ ] Modern, responsive, navy+gold multi-page site (Home, About, Leadership, Courses +4
         details, Departments, Faculty, Facilities, Gallery, Admissions, Notices, Events, Contact).
   - [ ] Consolidated courses/departments (no 24-page sprawl).
   - [ ] Lead capture across the site → PHP/JSON store → visible in admin.
   - [ ] Lead-gated prospectus download; Prospectus removed from main nav.
   - [ ] Admin: Dashboard, Leads (+detail), Notices CRUD, Events/Calendar CRUD, Settings.
   - [ ] Admin-posted Notices & Events appear on the public site after publish.
   - [ ] No CIT / engineering / ad-tech leftovers; no tele-calling module.
   - [ ] Placeholder images everywhere (named per §7) ready for client swap.
   - [ ] SEO (titles/meta/canonical/schema), sitemap, robots, manifest correct.
   - [ ] Accessibility AA; reduced-motion; Lighthouse perf/a11y targets met.
   - [ ] Docs complete (README + docs/*).

3. **Security sanity** — admin routes `noindex` + protected; admin-key handshake documented as
   not-a-secret; no secrets/PII in the client bundle or git; `data/` protected by `.htaccess`;
   external links `rel="noopener"`; basic input validation on all PHP endpoints.

4. **Cross-browser smoke** — latest Chrome, Firefox, Safari (desktop) + mobile Chrome/Safari.

5. **Handover notes** — list every remaining client `TODO` (real images, social/YouTube URLs,
   exact event dates, prospectus PDF, GTM id, final admin credentials) in the PR + a
   `docs/HANDOVER.md`.

## Acceptance criteria
- Every checklist item ticked or has a tracked follow-up; clean prod build; handover doc present.

## PR
Draft PR "Phase 4.7 — Final build verification & handover". Attach the completed checklist
and `docs/HANDOVER.md`. Update `CHANGELOG.md`.
