# 00 — Design System & Project Reference (READ FIRST)

This is the **single source of truth** for the Icon Commerce College rebuild. Every
other prompt references this file. Do not contradict it.

---

## 1. Brand & identity

- **Name:** Icon Commerce College
- **Assamese name (use in logo lockup / footer):** আইকন কমাৰ্চ কলেজ
- **Location label:** Guwahati, Assam
- **Tagline (primary):** "Where Knowledge Meets Character"
- **Tagline (secondary):** "Empowering Commerce, Arts & Computer Application graduates since 2004."
- **Established:** 2004
- **Trust / parent body:** Icon Academy Trust
- **Affiliation:** Affiliated to **Gauhati University** (NEP 2020 / FYUGP)
- **Samarth College Code:** 842
- **Governing portal for admission:** https://assamadmission.samarth.ac.in/

Logo is a placeholder (`/images/placeholders/logo-icon-commerce.png`). The real crest is
maroon + gold; we are modernizing to **Navy + Gold** but the logo asset stays as supplied.

---

## 2. Colour system (Deep Navy + Gold)

Define these as CSS variables in `src/styles/variables.css` AND mirror them in
`src/theme/muiTheme.js`. Use CSS variables in `*.module.css`.

```
--color-primary:        #1A2A52;  /* Deep Navy — headers, primary surfaces, headings   */
--color-primary-dark:   #111d3a;  /* Navy 900 — gradients, footer                       */
--color-primary-light:  #2C3E6B;  /* Navy 600 — hovers                                  */
--color-accent:         #C8A04D;  /* Gold — accents, underlines, icons, dividers        */
--color-accent-dark:    #A8823A;  /* Gold dark — hover                                  */
--color-accent-soft:    #F3E9D2;  /* Gold tint — card backgrounds, badges               */
--color-cta:            #E0301E;  /* Warm Red — primary CTA buttons ONLY                */
--color-cta-dark:       #B91E10;
--color-success:        #1E8E5A;
--color-info:           #2563EB;
--color-text:           #14233D;  /* Body text (navy-ink)                               */
--color-text-muted:     #5B6678;  /* Secondary text                                     */
--color-bg:             #F7F8FB;  /* Page background                                    */
--color-surface:        #FFFFFF;  /* Cards                                              */
--color-border:         #E6E9F0;
--color-navy-overlay:   rgba(26, 42, 82, 0.72); /* hero image overlays                  */
```

**Signature gradients**
```
--gradient-navy:  linear-gradient(135deg, #1A2A52 0%, #111d3a 100%);
--gradient-gold:  linear-gradient(135deg, #C8A04D 0%, #A8823A 100%);
--gradient-hero:  linear-gradient(120deg, rgba(17,29,58,0.92) 0%, rgba(26,42,82,0.78) 55%, rgba(26,42,82,0.45) 100%);
```

**Usage rules**
- Navy = structure (header, footer, headings, hero overlay, primary buttons).
- Gold = emphasis only (section eyebrow labels, underlines, icon chips, stat numbers, dividers). Never large gold fills behind body text.
- Warm Red (`--color-cta`) = the single primary action per view ("Apply Now", "Enquire Now", "Download Prospectus"). Don't overuse.

---

## 3. Typography

- **Headings:** `'Poppins', sans-serif` (600/700). Load via `public/index.html` `<link>`.
- **Body:** `'Inter', sans-serif` (400/500).
- Scale (clamp, responsive): h1 `clamp(2rem, 4vw, 3.25rem)`, h2 `clamp(1.6rem, 3vw, 2.4rem)`,
  h3 `clamp(1.25rem, 2vw, 1.6rem)`, body `1rem/1.7`, small `0.875rem`.
- Section "eyebrow" label: uppercase, letter-spacing `0.12em`, gold, `0.8rem`, 600.
- Max content width: `1200px` container; wide sections `1320px`.

---

## 4. Spacing, radius, elevation, motion

- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96. Section vertical padding: `clamp(56px, 8vw, 112px)`.
- Radius: cards `16px`, buttons `10px`, chips/pills `999px`, inputs `10px`.
- Shadows: `--shadow-sm: 0 2px 8px rgba(20,35,61,.06)`, `--shadow-md: 0 8px 30px rgba(20,35,61,.10)`, `--shadow-lg: 0 20px 50px rgba(20,35,61,.16)`.
- **Animation (minimalist "shuttle"):**
  - Reveal-on-scroll: opacity 0→1, translateY 24px→0, duration 0.5s, ease `[0.22,1,0.36,1]`.
  - Stagger children by 0.06–0.1s ("shuttle" cascade).
  - Hover: cards lift `translateY(-4px)` + shadow-md; buttons subtle scale `1.02`.
  - Use Framer Motion; centralize variants in `src/utils/motion.js` (created in prompt 07).
  - Always guard with `prefers-reduced-motion` (the helper must return static variants when reduced).

---

## 5. Site map (consolidated structure)

Public routes:
```
/                         Home
/about                    About (profile, history, vision & mission, accreditation)
/leadership               Messages from the Desks (President, Principal, etc.)
/courses                  Programs overview (B.Com, BBA, BCA, BA)
/courses/:slug            Course detail — slugs: b-com | bba | bca | b-a
/departments              Departments grouped by Arts / Commerce / Science (single page)
/faculty                  Teaching staff
/facilities               Campus facilities
/gallery                  Photo + Video gallery
/admissions               Admission process, eligibility, fees, Samarth, prospectus (lead-gated)
/notices                  Notices listing (dynamic, from admin)
/events                   Events + calendar (dynamic, from admin)
/contact                  Contact form, map, info
/thank-you                Post-submit confirmation (noindex)
*                         404 Not Found
```
Admin routes (under `/admin`, all noindex):
```
/admin/login
/admin/dashboard
/admin/leads            + /admin/leads/:leadId
/admin/notices
/admin/events
/admin/settings
```
> Tele-calling and all CIT ad-tech guideline pages are **removed** in this rebuild.

---

## 6. Content data (canonical — taken from the official Prospectus & current site)

Put this in `src/data/*` (prompt 03). Keep it accurate; mark gaps as `TODO`.

### College contact
- Address: **Rajgarh Road, Near Byelane No-3, Chandmari, Guwahati, Assam – 781003, India**
- Phone: **+91 93653 75782**, **+91 93653 83289**
- Email: **iconcom.2004@gmail.com**
- Google Maps: embed by query "Icon Commerce College, Rajgarh Road, Guwahati" (placeholder iframe ok)
- Social: Facebook + YouTube ("College Profile (ICON Commerce College)") — use `TODO` URLs.

### Programs (cards + detail). All: NEP-2020 FYUGP, Gauhati University, 3/4 Years (6/8 Semesters).
| Slug | Program | Total 1st-sem fees | Monthly tuition | Application | Notes |
|------|---------|-------------------|-----------------|-------------|-------|
| `b-com` | Bachelor of Commerce (B.Com.) | ₹10,900 | ₹1,800 | ₹300 | Eligibility: HS (10+2) any stream (Comm/Sci/Arts) under AHSEC/equiv. |
| `bba`  | Bachelor of Business Administration (BBA) | ₹11,000 | ₹2,000 | ₹300 | HS (10+2) any stream. |
| `bca`  | Bachelor of Computer Applications (BCA) | ₹11,000 | ₹2,000 | ₹300 | HS (10+2); Maths/CS preferred; CSE/IT Diploma eligible. |
| `b-a`  | Bachelor of Arts (B.A.) | ₹10,900 | ₹1,800 | ₹300 | HS (10+2) any stream; Honours needs min 45%. |

Fee breakdown (B.Com/B.A.): Admission ₹5,500 · Library ₹800 · ID-Card/Entry ₹100 · Misc ₹4,500 → Total ₹10,900.
Fee breakdown (BCA/BBA): Admission ₹5,500 · Library ₹900 · ID-Card/Entry ₹100 · Misc ₹4,500 → Total ₹11,000.
N.B. GU registration/enrolment/exam fees extra, subject to change; fees non-refundable.

Document verification (all programs): HS marksheet; Registration/Migration Certificate; Gap Certificate (affidavit) if applicable.

### Departments (group → list)
- **Arts:** Assamese, Economics, Education, English, Philosophy, History, Political Science
- **Commerce:** Accountancy, Finance, Management, Business Administration, Economics, English, Environmental Science
- **Science:** Computer Application, Mathematics & Statistics, Botany, Chemistry

### Leadership — "From the Desk of …" (name, role, qualifications, message excerpt in prospectus text)
- **Smt. Dipali Bora** — President, Governing Body
- **Sri Debasish Bora** — Advisor
- **Dr. Mandira Saha** — Principal (M.Com., M.Phil., Ph.D.)
- **Sri Sawpon Dowerah** — Rector
- **Rajib Kumar Das** — Director (Academic)
- **Smt. Dipanju Bora** — Director
- **Dr. Nilanjan Bhattacharjee** — Academic Advisor (M.Com., M.B.A., Ph.D.)
(Full message text is in the prospectus; prompt 16/37 supplies the copy. Photos = placeholders.)

### Facilities (icon + title + blurb)
Qualified & Experienced Faculty · Digital Library · Computer Lab · Smart Classrooms ·
Online Classes (Google Meet) · College Canteen (hygienic, affordable) · Free Wi-Fi / Internet ·
Playground (Sports & Events) · Purified Drinking Water · Government Scholarship assistance.

### Admission process (4 steps)
1. Register on the **Samarth portal** (https://assamadmission.samarth.ac.in/) — College Code **842**.
2. Select preferred college **ICON COMMERCE COLLEGE** and stream (B.Com / BA / BBA / BCA).
3. After verification, take admission at college or online.
4. Approved candidates receive a confirmation SMS on their registered mobile.

### Stats (animated counters — use as shown; mark any uncertain as approximate)
- **Since 2004** (Years of excellence) · **4** UG Programs · **18+** Departments ·
  **40+** Faculty Members · **Gauhati University** affiliated · **1000s** of Alumni.
(Use "TODO/verify" comments for soft numbers.)

### Signature events (for Events page seed + Home)
- Annual College Week (indoor/outdoor games, quiz, debate, art & literature).
- Inter-College Cooking Competition.
- **ICON Shield** — annual cricket tournament (in memory of Rupam Patgiri).
- **ICON Trophy** — annual cricket tournament (in memory of Jadav Dutta).

### Notices (seed examples)
- "Admission Notification — 1st Semester UG Course, 2026-27"
- "Admission Process Guide for Applicants"

### Testimonials / Alumni (name — role; quote in prospectus)
Ankita Kumari Agarwal (BBA) · Ayushi Surana (BBA) · Shahid Ansari (Entrepreneur) ·
Akash Paul (Asst. Professor, Biswanath College) · Devika Adhyapak (Admin Asst., IIT Guwahati) ·
Dishangka Jiten Pathak (Jr. Accounts Asst. Trainee, IOCL) · Raghav Sarma (Advocate, Gauhati High Court) ·
Tulika Devi (Graduate Teacher) · Pritam Saha (Sr. BD Manager, SBI General) ·
Bikash Bezbaruah (Manager, IDFC First Bank) · Banani Bhagawati (PGT English).

### Faculty (sample — full list seeded in prompt 37; photos are placeholders)
Dr. Mandira Saha (Principal) · Dr. Nilanjan Bhattacharjee (Academic Advisor) ·
Mandira Sharma (M.Sc. Gold Medalist, M.Phil.) · Tridib Kr. Handique (M.C.A., Exam In-Charge) ·
Dr. Rubi Das (Coordinator B.Com/BBA) · Pallabi Dutta (Coordinator B.C.A.) ·
Santashri Barman (Coordinator BA) · Kongkona Bhagawati (M.Com, M.B.A.) … (+ more from prospectus).

---

## 7. Placeholder image convention

**Never use real/remote images.** Create labelled placeholders and reference these exact
paths so the client can swap them later. Provide a tiny generator (prompt 02/36) that
renders an SVG/JPG with the filename text centered on a navy/gold card.

Directory: `public/images/placeholders/`. Canonical names:
```
logo-icon-commerce.png
favicon.png
hero-campus.jpg              hero-students.jpg            hero-library.jpg
about-college-building.jpg   about-campus-aerial.jpg
vision-mission.jpg
principal-dr-mandira-saha.jpg   president-dipali-bora.jpg   advisor-debasish-bora.jpg
rector-sawpon-dowerah.jpg       director-academic-rajib-das.jpg  director-dipanju-bora.jpg
academic-advisor-nilanjan-bhattacharjee.jpg
course-bcom.jpg  course-bba.jpg  course-bca.jpg  course-ba.jpg
dept-arts.jpg  dept-commerce.jpg  dept-science.jpg
facility-library.jpg  facility-computer-lab.jpg  facility-canteen.jpg
facility-playground.jpg  facility-smart-classroom.jpg  facility-wifi.jpg
faculty-placeholder.jpg
gallery-1.jpg ... gallery-12.jpg
event-college-week.jpg  event-cooking-competition.jpg  event-icon-shield.jpg  event-icon-trophy.jpg
testimonial-avatar.jpg
prospectus-cover.jpg
map-location.jpg
og-default.jpg
```
When you need an image not in this list, add it here using the same `kebab-case` +
descriptive-name rule and note it in the PR description.

---

## 8. Lead / data architecture (reuse the boilerplate pattern)

- Public lead submit → `POST /api/leads.php?action=create` via `src/utils/webhookSubmit.js`.
- Admin reads/writes the PHP/JSON store; in-memory cache + 15s poll + `BroadcastChannel`.
- **Notices** and **Events** copy this exact pattern with new endpoints
  `/api/notices.php` and `/api/events.php` (+ `data/notices.json`, `data/events.json`)
  and services `noticeService.js` / `eventService.js`.
- Env vars (keep names): `REACT_APP_LEADS_API_URL`, `REACT_APP_LEADS_ADMIN_KEY`,
  `REACT_APP_ADMIN_USERNAME`, `REACT_APP_ADMIN_PASSWORD`, optional `REACT_APP_GTM_ID`.
  Add `REACT_APP_NOTICES_API_URL`, `REACT_APP_EVENTS_API_URL`.

### Lead fields (college)
`name` (req), `mobile` (req, Indian 10-digit), `email` (optional), `program_interest`
(B.Com/BBA/BCA/BA/Undecided), `state` (default Assam + NE + Other), `message` (optional),
plus auto: `lead_id`, `source`, `status`, `submitted_at`, `page_url`, UTM/gtm fields, `notes`, `activity`.

---

## 9. Coding conventions

- React 18 + MUI v5 + Framer Motion. CSS Modules per component (`*.module.css`) using the CSS variables above.
- One component per folder (`Component/Component.jsx` + `Component.module.css`), matching the existing structure.
- Keep `App.jsx` lean: route-level code-splitting with `React.lazy` + `Suspense`.
- Reuse existing utilities where possible; **do not** reintroduce removed ad-tech modules.
- Accessibility: semantic landmarks, alt text on every image (use the placeholder's descriptive name), focus states, `aria-label` on icon buttons, skip-link retained.
- Each PR: update `CHANGELOG.md`, keep `npm run build` green, no console errors on the touched routes.
