# Prompt 37 — Content Population (from the Prospectus)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§6) and the official prospectus text at
`Icon Academy Resources/prospectus.txt` (extracted) / `Prospectus_Final.pdf`.
**Depends on:** all data-driven pages (Phase 2/3).
**Goal:** Fill every `TODO` content stub with accurate, well-written copy sourced ONLY from
the prospectus / current site — no invented facts.

## Tasks

1. **Leadership messages** — full "From the Desk of" copy for all 7 desks (President Dipali
   Bora, Advisor Debasish Bora, Principal Dr. Mandira Saha, Rector Sawpon Dowerah, Director
   (Academic) Rajib Kumar Das, Director Dipanju Bora, Academic Advisor Dr. Nilanjan
   Bhattacharjee), lightly edited for clarity, into `leadershipData.js`.

2. **Faculty** — expand `facultyData.js` with the full prospectus list (names, designations,
   qualifications, department where stated): e.g. Mandira Sharma, Tridib Kr. Handique, Rikia
   Chakraborty, Kongkona Bhagawati, Dr. Rubi Das, Loveleena Bora, Pallabi Dutta, Dr.
   Urmimala Mahanta, Santashri Barman, Dr. Antara Gayan, Badamon Shisha Shadap, Dipannita
   Chakraborty, Ruma Das, Sumit Kr. Routh, Mridusmita Deka, Kankana Sharma, Nivedita Bayan
   Baishya, Urbimala Hazarika, Saurav Bhattacharjee, Sadhna Kashyap, Rimon Borah, Rinkumani
   Baishya, Manisha Das, Namrata Sharma, Sagarika Paul, Spondita Goswami, + guest faculty.
   (Use exact names/quals from the prospectus; coordinators flagged.)

3. **Testimonials** — finalize all alumni quotes in `testimonialsData.js` (the 11 alumni in §6).

4. **About / Vision / Mission** — polish from College Profile + Principal/President messages.

5. **Course detail** — careers/highlights per program; BCA program objectives & topics from
   the prospectus; ensure fees/eligibility exactly match.

6. **Facilities** — descriptions from the prospectus (library/journals, computer lab, smart
   classrooms, online classes via Google Meet, canteen, purified water, scholarships).

7. **Events seed** — College Week, Inter-College Cooking Competition 2026, ICON Shield
   (Rupam Patgiri memorial cricket), ICON Trophy (Jadav Dutta memorial cricket) with sensible
   `TODO` dates flagged for the client.

8. **General instructions / Student info (optional page or Admissions accordion)** — uniform,
   discipline, anti-ragging, attendance, scholarships, uniform vendor (Suman Dresses) — include
   if useful; otherwise summarize.

## Rules
- Source strictly from the prospectus/current site. Anything not present stays a clearly
  marked `TODO` for the client (don't fabricate dates, numbers, or names).

## Acceptance criteria
- No remaining placeholder lorem; `TODO`s only where the client must supply data.
- All names/quals/fees match the prospectus; `npm run build` passes.

## PR
Draft PR "Phase 4.4 — Content population from prospectus". List remaining client `TODO`s.
Update `CHANGELOG.md`.
