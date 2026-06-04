# Prompt 27 — Admin Lead Management

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§8); existing `leadService.js`, `leadStatus.js`, `LeadManagement.jsx`, `LeadDetail.jsx`.
**Depends on:** 25, 26.
**Goal:** Adapt the proven Lead Management System to the college fields/statuses with the
new admin styling. Keep the server-store sync intact.

## Tasks

1. **leadStatus.js** — define college-appropriate statuses (single source of truth), e.g.:
   `new` (New) · `contacted` (Contacted) · `interested` (Interested) · `application_started`
   (Application Started) · `admitted` (Admitted/Seat Booked) · `not_interested` (Not Interested).
   Each with label + colour. Provide `describeStatusChange()`.

2. **LeadManagement.jsx** — `/admin/leads`:
   - DataTable columns: Name · Mobile · Email · Program Interest · State · Source · Status · Date.
   - Filters: search, status, source, date range (today/week/month/custom). Bulk select →
     change status / delete (ConfirmDialog). CSV export (and import if retained). Status chips
     editable inline. Pagination. Auto-refresh via `syncLeadsFromServer()` poll + `onLeadsChanged`.

3. **LeadDetail.jsx** — `/admin/leads/:leadId`:
   - Full lead info, source/UTM, submitted/updated times; editable status; append-only notes;
     activity timeline; quick actions (Call `tel:`, WhatsApp, Email). Mirror writes to the
     server via `leadService` (status/notes/activity patches, merge-safe).

4. Keep `leadService.js` largely as-is; just ensure the `program_interest` field flows
   through (consistent with prompt 08's decision) and CSV headers match.

## Acceptance criteria
- Leads created from the public form appear here (cross-device) and can be filtered, status-
  changed, noted, exported, and deleted; changes persist to `data/leads.json`.
- Responsive tables; `npm run build` passes.

## PR
Draft PR "Phase 3.3 — Admin lead management". Update `CHANGELOG.md`.
