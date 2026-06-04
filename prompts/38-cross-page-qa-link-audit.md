# Prompt 38 — Cross-Page QA & Link Audit

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§5 site map).
**Depends on:** everything above.
**Goal:** End-to-end verification that the whole site + admin works and links are sound.

## Tasks

1. **Link audit** — crawl every internal link (header, footer, mobile drawer, bottom nav,
   in-page CTAs, breadcrumbs, course/department/notice/event links). Fix any 404s, wrong
   slugs, dead anchors, or external links missing `rel="noopener"`. Confirm Samarth, phone,
   email, WhatsApp, maps links are correct.

2. **CTA matrix** — verify every Apply/Enquire/Prospectus/Callback/Visit CTA opens the right
   drawer preset and submits to the lead store with the correct `source` and (where set)
   preset `program_interest`.

3. **End-to-end flows** (manual + scripted where possible):
   - Public lead submit → `/thank-you` → record visible in `/admin/leads`.
   - Prospectus: download only after lead capture.
   - Admin: create Notice → publish → appears on Home + `/notices`; unpublish → disappears.
   - Admin: create Event → appears on `/events` list + calendar + Home upcoming.
   - Admin: lead status change + note → persists + activity timeline.
   - Cross-tab sync (BroadcastChannel) and cross-"device" (server poll) for leads/notices/events.

4. **Regression** — all 14 public routes + 4 course slugs + admin routes render; 404 + error
   boundary behave; reduced-motion; mobile nav.

5. **Console/network** — zero console errors/warnings on every route; no failed requests
   (except intentionally-absent optional ones); no mixed content.

## Acceptance criteria
- Documented QA checklist all green (or issues filed/fixed). No broken links. `npm run build` passes.

## PR
Draft PR "Phase 4.5 — Cross-page QA & link audit". Attach the filled checklist. Update `CHANGELOG.md`.
