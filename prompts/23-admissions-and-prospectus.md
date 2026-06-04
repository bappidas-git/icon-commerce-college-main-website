# Prompt 23 — Admissions Page + Lead-Gated Prospectus Download

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 admission, fees; §8 leads).
**Depends on:** 01–10 (lead pipeline from 08/09).
**Goal:** A complete `/admissions` page AND a professional **lead-gated** prospectus
download (fixing the current flow where clicking "U.G. Prospectus" auto-downloads a file
with no lead capture, and removing Prospectus from the main nav).

## Tasks

### A. Admissions page — `src/pages/Admissions/Admissions.jsx`
1. **PageHero** — "Admissions 2026–27", subtitle "Affiliated to Gauhati University · NEP
   2020 (FYUGP)", breadcrumb Home / Admissions; CTA Apply Now.
2. **How to Apply (4 steps)** — numbered timeline from `admissionData.js`:
   (1) Register on Samarth portal (Code 842), (2) choose ICON COMMERCE COLLEGE + stream,
   (3) verification → admission online/at college, (4) confirmation SMS. Prominent
   "Go to Samarth Portal ↗" button (the official URL) + "Apply / Enquire" drawer CTA.
3. **Eligibility** — per-program eligibility summary (cards or table) with the HS (10+2)
   rules, BCA Maths/CS preference, BA Honours 45%.
4. **Fee structure** — tabbed or stacked fee tables for all 4 programs (from data) + the
   GU/non-refundable N.B. note + monthly tuition + application fee.
5. **Documents required** — checklist (HS marksheet, Registration/Migration Certificate,
   Gap Certificate affidavit if applicable).
6. **Scholarships** — short note (Government-approved schemes via the college; contact Nodal Officer).
7. **Admission FAQ** — Accordion (eligibility, fees, dates `TODO`, hostel `TODO`, contact) +
   FAQPage schema.
8. **CTA band** — Apply / Download Prospectus / Call admissions.

### B. Prospectus download (lead-gated) — `src/components/common/ProspectusDownload/`
- A `prospectus` drawer preset (already in ModalContext from prompt 09) hosting
  `UnifiedLeadForm` (source `prospectus`).
- Flow: user clicks any "Download Prospectus" CTA → drawer opens → on **successful lead
  submit**, trigger the actual file download (`/prospectus/icon-commerce-college-prospectus.pdf`
  placeholder path — add a small placeholder PDF or `TODO` note) AND show success.
- Provide a reusable `<ProspectusButton variant=… />` used by Hero, Footer, Admissions,
  Course pages. Never download before the lead is captured.
- **Remove "Prospectus" from the main navigation** (it's surfaced via CTAs/Admissions only),
  per the brief.

## Acceptance criteria
- Prospectus never downloads without a captured lead; lead lands in `data/leads.json`
  with source `prospectus`; download fires on success.
- Admissions page accurate (fees/eligibility/steps), Samarth link correct, FAQ schema valid.
- No "Prospectus" item in the header nav. Responsive; `npm run build` passes.

## PR
Draft PR "Phase 2.13 — Admissions + lead-gated prospectus". Update `CHANGELOG.md`.
