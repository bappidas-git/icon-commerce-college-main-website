# Prompt 08 — Lead Capture Core (form, submit, validation)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§8 lead architecture & fields).
**Depends on:** 01–07.
**Goal:** Adapt the existing lead pipeline to Icon Commerce College fields and styling,
keeping the proven server-store flow intact.

## Tasks

1. **UnifiedLeadForm** — `src/components/common/UnifiedLeadForm/`: fields
   - `name` (required), `mobile` (required, Indian 10-digit), `email` (optional, valid if present),
   - `program_interest` select: B.Com · BBA · BCA · B.A. · Undecided,
   - `state` select: Assam (default), Arunachal Pradesh, Manipur, Meghalaya, Mizoram,
     Nagaland, Tripura, Sikkim, Other,
   - `message` (optional textarea).
   Inline validation (reuse/extend `src/utils/validators.js`), accessible labels/errors,
   navy+gold styling, loading + disabled states, honeypot anti-spam field.
   Props: `source`, `compact`, `onSuccess`, preset `program_interest`.

2. **webhookSubmit** — `src/utils/webhookSubmit.js`: keep `getConfig()` and the
   `POST /api/leads.php?action=create` flow. Update the lead payload builder to the college
   fields (rename `service_interest` → keep server key `service_interest` for compatibility
   but map from `program_interest`; OR migrate cleanly to `program_interest` and update
   `leads.php` + admin accordingly — pick ONE and document it). Keep UTM/gtm capture,
   `lead_id`, `status:'new'`, `submitted_at`, `notes:[]`, `activity:[...]`, dedupe by mobile.
   On success → GTM `generate_lead` event (guarded) → redirect/callback to `/thank-you`.

3. **leads.php** — update field comments/labels to college fields; keep all endpoints &
   the merge/locking logic unchanged. Ensure `program_interest`/`state` persist.

4. **swalHelper** — keep; restyle success/error dialogs to navy+gold.

## Acceptance criteria
- Submitting a valid form writes a record to `data/leads.json` and routes to Thank-You.
- Invalid mobile/email blocked with clear messages; duplicate mobile handled gracefully.
- `npm run build` passes; no PII logged to console.

## PR
Draft PR "Phase 1.2 — Lead capture core". Note the field-key decision (`program_interest`).
Update `CHANGELOG.md`.
