# Prompt 18 — Course Detail Pages (`/courses/:slug`)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 programs, fees, eligibility, documents).
**Depends on:** 01–10, 17.
**Goal:** One reusable, data-driven detail template for B.Com, BBA, BCA, BA — professional
and complete (replacing the current pages that just embed a Google-Drive syllabus).

## Tasks — `src/pages/CourseDetail/CourseDetail.jsx`

1. Read `:slug`; look up in `coursesData.js`; 404 on miss. Set per-course SEO + `Course` schema.
2. **PageHero** — course name + shortName badge, duration, affiliation, breadcrumb
   Home / Courses / <name>; primary "Apply for <shortName>" CTA (drawer preset program).
3. **Sticky sub-nav / Tabs**: Overview · Eligibility · Fees · Curriculum · Careers.
   - **Overview** — summary, level, duration, affiliation, highlights ticks.
   - **Eligibility** — HS (10+2) requirement per program (and BCA's Maths/CS preference;
     BA Honours 45% note), plus document-verification checklist.
   - **Fees** — render the fee table from data (Admission/Library/ID-Card/Misc → Total) +
     monthly tuition + application fee + the GU/non-refundable N.B. note.
   - **Curriculum** — NEP-2020 FYUGP structure summary; "Detailed syllabus" button linking
     to a `TODO` GU/syllabus URL (no clumsy embedded Drive viewer). List major papers if available, else generic structure.
   - **Careers** — career paths from data (e.g., BCA → IT/software/dev/sysadmin; B.Com →
     accounting/finance/banking; BBA → management/entrepreneurship; BA → civil services/teaching/etc.).
4. **Side rail (desktop)** — quick facts card (duration, fees, eligibility, intake) + Apply +
   Prospectus + "Talk to admissions" (phone) + related programs.
5. **Bottom CTA** + "Explore other programs" cards.

## Acceptance criteria
- All 4 slugs render correct, distinct content from data; bad slug → 404.
- Tabs accessible; fees/eligibility accurate; CTAs preset the correct program.
- Responsive; `npm run build` passes.

## PR
Draft PR "Phase 2.8 — Course detail template". Verify all 4 slugs. Update `CHANGELOG.md`.
