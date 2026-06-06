# Content Guide — editing the site without a database

Everything on the public site is **plain data in version-controlled files** under
`src/data/*` (plus `src/config/seo.js` for SEO). There is **no CMS and no
database**. To change content you edit the file, then rebuild and redeploy.

**Notices** and **Events** are the exception — those are managed at runtime from
the admin panel (see [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md)); the files in `src/data`
only seed them before any are published.

---

## The edit → publish loop

1. Open the relevant file in `src/data/` (table below) and edit the values.
2. Keep the **shape** of each record identical to the entries around it — same
   keys, same types. Only change the text/numbers.
3. Save, then rebuild and redeploy:
   ```bash
   npm run build      # produces build/
   ```
   Upload the new `build/` (see [`DEPLOYMENT.md`](./DEPLOYMENT.md)).

> **Why rebuild?** This is a compiled React app — content is baked into the
> bundle at build time. There is no live editor; the trade-off is a fast, secure,
> DB-free site.

### Conventions you'll see everywhere

- **`TODO: …`** — a value the college still has to supply (e.g. social URLs,
  YouTube IDs). The UI degrades gracefully on a `TODO` (hides the link/embed)
  rather than showing something broken. Replace the whole string when you have
  the real value.
- **`placeholder('name')`** — resolves to a labelled image in
  `public/images/placeholders/`. Don't change these calls; swap the **image
  file** instead (see [`IMAGES.md`](./IMAGES.md)).
- **Icons** are [Iconify](https://icon-sets.iconify.design/mdi/) MDI names like
  `mdi:bookshelf`. Pick any `mdi:*` name from that site.
- **Currency / Assamese text** is just text — type it directly (UTF-8).

---

## Where each kind of content lives

| Content | File | Exported as |
|---------|------|-------------|
| College identity & contact | `src/data/collegeInfo.js` | `collegeInfo` |
| Courses (B.Com / BBA / BCA / B.A.) | `src/data/coursesData.js` | `coursesData` |
| Departments (Arts / Commerce / Science) | `src/data/departmentsData.js` | `departmentsData` |
| Leadership messages | `src/data/leadershipData.js` | `leadershipData` |
| Faculty / teaching staff | `src/data/facultyData.js` | `facultyData`, `guestFaculty` |
| Facilities | `src/data/facilitiesData.js` | `facilitiesData`, `facilitySpotlights`, `campusGlimpses` |
| Gallery | `src/data/galleryData.js` | `galleryPhotos`, `galleryVideos`, `galleryCategories` |
| Testimonials / alumni | `src/data/testimonialsData.js` | `testimonialsData` |
| Home stats counters | `src/data/statsData.js` | `statsData` |
| Admission steps / docs / FAQ | `src/data/admissionData.js` | `admissionSteps`, `documentsRequired`, `admissionFaqs` |
| Navigation menus | `src/data/navigation.js` | `mainNav`, `footerNav`, `navCta` |
| SEO metadata & schema | `src/config/seo.js` | `seoConfig` (see [`SEO.md`](./SEO.md)) |

---

## College info & contact — `collegeInfo.js`

The single source of truth for the college's identity, address, phone numbers,
email and social links. Used by the header, footer, contact page, SEO and the
admin Settings snapshot.

```js
export const collegeInfo = {
  name: 'Icon Commerce College',
  assameseName: 'আইকন কমাৰ্চ কলেজ',
  tagline: 'Where Knowledge Meets Character',
  established: 2004,
  affiliation: 'Gauhati University',
  samarthCode: '842',
  samarthUrl: 'https://assamadmission.samarth.ac.in/',
  address: { full: 'Rajgarh Road, …, Guwahati, Assam – 781003, India', parts: { … } },
  phones: ['+91 93653 75782', '+91 93653 83289'],
  email: 'iconcom.2004@gmail.com',
  social: { facebook: 'TODO: …', youtube: 'TODO: …', instagram: 'TODO: …' },
  hours: { days: 'Monday – Saturday', time: '9:30 AM – 4:30 PM' },
};
```

- **Phone numbers:** edit the `phones` array — `tel:` / WhatsApp links are derived
  automatically (digits are stripped). The first number is the primary one.
- **Social links:** replace the `TODO:` strings with full `https://` URLs. Until
  then the social icons render inert (they won't link anywhere broken).
- This is **not** driven by `.env` — edit the file directly.

---

## Courses — `coursesData.js`

The four UG programs, plus the shared NEP-2020/FYUGP curriculum structure
(`fyugpCurriculum`). Powers the Courses overview, each `/courses/:slug` detail
page, and (for fees/eligibility) the Admissions page.

Each course object:

| Field | Meaning |
|-------|---------|
| `slug` | URL segment — **`b-com` / `bba` / `bca` / `b-a`**. ⚠️ Don't change these; they're linked from menus, departments, the sitemap and SEO. |
| `name` / `shortName` | Full name / compact label (`B.Com.`). `shortName` must match the lead-form program options. |
| `summary`, `eligibility`, `eligibilityShort` | Descriptive copy + eligibility line. |
| `highlights`, `careers` | Bullet lists (arrays of strings). |
| `objectives`, `topics` | Optional (BCA uses them) — render only when present. |
| `fees` | `{ rows:[{particular, amount}], total, tuitionMonthly, application, note }`. |
| `documents` | Verification checklist (array of strings). |
| `syllabusUrl` | GU syllabus PDF — currently a `TODO`; replace per programme. |
| `image`, `badge` | `placeholder('course-bcom')`; optional ribbon (e.g. `'Most Popular'`). |

To **update fees**, edit the shared `FEES_BCOM_BA` / `FEES_BCA_BBA` objects near the
top (B.Com & B.A. share one; BCA & BBA share the other) so the figures stay
consistent across cards, detail pages and admissions.

To **add a course**, copy a full course object, give it a new unique `slug`, and
add that slug to the menus in `navigation.js` and to `public/sitemap.xml`.

---

## Departments — `departmentsData.js`

Three streams (`arts`, `commerce`, `science`), each with a list of subjects built
by the `subj(name, icon, blurb, description, related)` helper:

- `related` lists the course **slugs** a subject feeds into (e.g. `['b-com']`).
  Use only valid slugs (`b-com`/`bba`/`bca`/`b-a`); leave `[]` for a subject with
  no matching degree (the card just omits the "related programme" chip).
- The subject `slug` (used for anchors) is generated automatically from the name.

---

## Leadership — `leadershipData.js`

The seven "From the Desk of …" desk-holders, in display order. Each leader:

```js
{
  name: 'Dr. Mandira Saha',
  role: 'Principal',
  qualifications: 'M.Com., M.Phil., Ph.D.',  // '' to hide the line
  image: placeholder('principal-dr-mandira-saha'),
  featured: true,                            // President & Principal highlighted
  message: [ 'First paragraph…', 'Second paragraph…' ],  // one string per <p>
}
```

`message` is an **array of paragraphs** — add/remove array items to change the
message. Each becomes its own `<p>` inside the desk's blockquote.

---

## Faculty — `facultyData.js`

- `facultyData` — the full teaching roster (powers the `/faculty` directory).
- `guestFaculty` — rendered in a separate "Guest Faculty" section.

Each member: `name`, `designation`, `qualifications` (`''` to omit), `department`
(one of `Commerce` / `Arts` / `Science` / `Computer Application` — drives the
directory filter), `image`, optional `featured` (pulls them into the Leadership &
Coordinators highlight strip) and optional `bio`.

> `department` is an **inferred UI grouping** for filtering, not an official
> posting — confirm/refine with the college.

To add a member, copy an entry, edit the fields, keep `image: FACULTY_IMG`.

---

## Facilities — `facilitiesData.js`

- `facilitiesData` — the grid of facilities (`icon` + `title` + `description`).
- `facilitySpotlights` — three richer two-column rows with an image + feature
  points.
- `campusGlimpses` — three image tiles.

Edit the title/description text; pick `mdi:*` icons; keep the `placeholder()`
image calls.

---

## Gallery — `galleryData.js`

- `galleryPhotos` — 12 captioned photos, each with a `category` from
  `galleryCategories` (`Campus`, `Events`, `Classrooms`, `Sports`, `Cultural`).
  Captions live in the `photoSeed` array; the image is `gallery-1 … gallery-12`.
- `galleryVideos` — each has a `title` and a `youtubeId`. The IDs are `TODO` —
  replace with the real **YouTube video ID** (the part after `watch?v=`). Until
  then the video tile shows a fallback instead of a broken embed.

To add a photo, add a `{ caption, category }` to `photoSeed` and a matching
`gallery-13.svg` placeholder (and register it — see [`IMAGES.md`](./IMAGES.md)).

---

## Testimonials — `testimonialsData.js`

Alumni cards for the Home carousel: `{ name, role, quote, avatar }`. Edit/add
entries; keep `avatar: AVATAR`.

---

## Home stats — `statsData.js`

Animated counters. Each stat is either numeric or a display string:

```js
{ value: 2004, prefix: 'Since ', label: 'Years of Excellence' }
{ value: 40, suffix: '+', label: 'Faculty Members', approximate: true }
{ display: 'Gauhati University', label: 'Affiliated To' }
```

`approximate: true` flags a soft number to verify with the college; it doesn't
change rendering.

---

## Admissions — `admissionData.js`

- `admissionSteps` — the 4-step process (`number`, `title`, `description`, `icon`).
- `documentsRequired` — verification checklist (array of strings).
- `admissionFaqs` — `{ question, answer }` pairs (also emitted as FAQPage
  schema). Keep answers honest — point to the office/Notices rather than
  inventing dates.

> Per-program **fees and eligibility** are **not** here — they're read from
> `coursesData.js` so there's one source of truth. Edit fees there.

---

## Navigation — `navigation.js`

- `mainNav` — header menu tree (`About` and `Courses` have `children` dropdowns).
- `footerNav` — footer link groups.
- `navCta` — the header "Apply Now" button.

Every `path` must resolve to a real route. If you add a page/course, add its link
here and to `public/sitemap.xml`.

---

## Notices & Events (managed in the admin panel)

These are **not** edited in code day-to-day. Staff create, publish, pin and
delete them from `/admin/notices` and `/admin/events`; published items appear on
`/notices`, `/events` and the Home page. They persist in the PHP/JSON stores
(`api/data/notices.json`, `api/data/events.json`) — the single source of truth.

`src/data/seedNotices.js` and `src/data/seedEvents.js` only provide **fallback
content shown before the admin publishes anything** (and define the record shape:
notices have `title`, `body`, `category`, `date`, `pinned`, `published`; events
have `title`, `description`, `category`, `start_date`, optional `end_date` /
`start_time` / `end_time` / `venue` / `image_url`, `published`).

Full walkthrough: [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md).

---

## SEO text

Page titles, meta descriptions, keywords and schema.org data live in
`src/config/seo.js`. See [`SEO.md`](./SEO.md) for how to edit them and update
`public/sitemap.xml` / `public/robots.txt`.
