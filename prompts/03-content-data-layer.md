# Prompt 03 — Content Data Layer

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6 is the canonical content).
**Depends on:** 01, 02.
**Goal:** Encode ALL college content as structured, typed-ish data modules so pages are
data-driven and easy to maintain. No copy is hardcoded in page components later.

## Files to create under `src/data/`

1. `collegeInfo.js` — single object: name, assameseName, tagline, established (2004), trust
   ("Icon Academy Trust"), affiliation ("Gauhati University"), samarthCode "842",
   samarthUrl, address (full + parts), phones [..], email, mapsQuery, social {facebook:TODO,
   youtube:TODO, instagram:TODO}, hours. Export helpers `phoneHref`, `whatsappHref`.

2. `navigation.js` — header menu tree (label, path, optional children for Courses dropdown
   → 4 programs, and About dropdown → About/Leadership/Faculty/Facilities). Plus footer
   link groups. Match the site map in design-system §5.

3. `coursesData.js` — array of 4 programs, each:
   `{ slug, name, shortName, level:'Undergraduate (FYUGP, NEP 2020)', duration:'3/4 Years (6/8 Semesters)',
   affiliation:'Gauhati University', image:'course-<x>.jpg', summary, eligibility,
   highlights:[...], careers:[...], fees:{ rows:[{particular,amount}], total, tuitionMonthly, application },
   documents:[...], badge? }`. Use the exact fees & eligibility from design-system §6.

3b. `departmentsData.js` — `{ streams: [{ key:'arts'|'commerce'|'science', label, blurb,
   image, subjects:[{name, slug, blurb? }] }] }` using the three lists in §6.

4. `leadershipData.js` — array of the 7 desk-holders (name, role, qualifications, image
   placeholder, message — use the prospectus excerpts; long copy can be a `TODO` short
   stub now and is finalized in prompt 37). Mark `featured:true` for President/Principal.

5. `facilitiesData.js` — array (icon iconify name, title, description) for the 10 facilities in §6.

6. `statsData.js` — counters array (value, suffix, label) from §6 stats.

7. `admissionData.js` — steps[] (4), eligibilityNote, feesNote, prospectus info.

8. `facultyData.js` — array (name, designation, qualifications, department, image:'faculty-placeholder.jpg').
   Seed with the names in §6 (full list expanded in prompt 37).

9. `testimonialsData.js` — array (name, role/affiliation, quote, avatar:'testimonial-avatar.jpg')
   from §6 alumni list (use 5–6 strong quotes now; rest in prompt 37).

10. `galleryData.js` — photos[] (src placeholder gallery-1..12, caption, category) +
    videos[] (title, youtubeId:'TODO', thumb).

11. `seedNotices.js` & `seedEvents.js` — small arrays matching the API record shapes
    (defined in prompts 28/30) so the UI has fallback content before the admin posts any.
    Include the signature events (College Week, Cooking Competition, ICON Shield, ICON Trophy)
    and the two seed notices from §6.

## Rules
- Every image field references a name from design-system §7 (via `placeholder()`/`IMAGES`).
- Keep modules pure (no imports of React). Add brief JSDoc on each exported shape.
- Where a real value is unknown, use a string literal that starts with `'TODO: '`.

## Acceptance criteria
- `npm run build` passes; importing any data module returns the documented shape.
- A throwaway `console.table(coursesData)` shows 4 programs with correct fees.

## PR
Draft PR "Phase 0.3 — Content data layer". Note any `TODO` values that need client input.
Update `CHANGELOG.md`.
