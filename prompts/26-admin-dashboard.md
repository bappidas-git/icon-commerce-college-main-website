# Prompt 26 — Admin Dashboard

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§8).
**Depends on:** 25 (and reads from leadService; notices/events stats become live after 29/31).
**Goal:** An at-a-glance admin home.

## Tasks — `src/admin/pages/Dashboard.jsx`

1. **Stat tiles** (StatTile): Total Leads · New (today) · This Week · Conversion %
   (reuse `getLeadStats()`); Upcoming Events count; Active Notices count
   (these two may show 0/placeholder until prompts 29/31 add the services, then wire them).
2. **Recent leads** table (last 5–8) with status chip + link to detail.
3. **Leads-over-time** mini chart (simple SVG/CSS bars by day/week — no heavy chart dep) or
   a compact list; keep lightweight.
4. **Quick actions**: "Add Notice", "Add Event", "Export Leads", "View Site".
5. **Upcoming events** mini-list + **latest notices** mini-list (live after 32/29/31).
6. Auto-refresh via the existing poll/`onLeadsChanged` subscription.

## Acceptance criteria
- Tiles compute from real lead data; recent leads link to detail; quick actions route correctly.
- Responsive; refreshes when lead data changes; `npm run build` passes.

## PR
Draft PR "Phase 3.2 — Admin dashboard". Update `CHANGELOG.md`.
