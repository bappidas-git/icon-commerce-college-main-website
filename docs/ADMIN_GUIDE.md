# Admin Guide

The admin panel lets college staff manage **leads** (admission enquiries) and
publish **notices** and **events** — no code, no database. It lives under
`/admin`, every route is `noindex`, and it shares the same lead/notice/event
stores as the public site, so what you publish here appears on the website within
seconds.

> Setup for deployers (env vars, the admin key, writable `api/data/`) is in
> [`DEPLOYMENT.md`](./DEPLOYMENT.md). This guide is for **using** the panel.

---

## 1. Logging in

1. Go to **`/admin/login`** (also linked from the website footer).
2. Enter the username and password.
   - These come from the `REACT_APP_ADMIN_USERNAME` and
     `REACT_APP_ADMIN_PASSWORD` build variables. The development defaults are
     **`admin` / `icc@2026`** — **change them before going live.**
3. Optionally tick **Remember me**.

**Sessions** last **24 hours**, stored in the browser's `localStorage`
(`admin_auth`); after that you're signed out automatically. Use **Sign out**
(Settings page) to end a session early.

**Changing the password:** there is no in-app password field — the password *is*
the `REACT_APP_ADMIN_PASSWORD` environment variable. Update it on the host and
**rebuild/redeploy** to change it.

---

## 2. Dashboard

The landing page after login. It reads live from the leads store and shows:

- **Stat tiles** — total leads, new today, leads this week, and the **conversion
  rate** (leads at the **Admitted** stage ÷ total).
- **Leads over time** — a 7-day mini bar chart.
- **Recent leads** — the latest six, with a click-through to each lead.
- **Top source** — the most common `source` across all leads.
- **Quick actions** — jump straight to *Add Notice* / *Add Event*.

The sidebar (Dashboard · Leads · Notices · Events · Settings) is the complete
admin surface.

---

## 3. Leads

`/admin/leads` — a searchable, sortable, paginated table of every enquiry.

### Where leads come from

Public enquiry forms (hero, drawer, contact, prospectus, etc.) `POST` to
`/api/leads.php?action=create`. Each is saved server-side in `api/data/leads.json`
— the **single source of truth** — with its `source`, `program_interest`, UTM
parameters, page URL and timestamp. The admin table reads straight from there.

### Filtering & search

- **Search** matches name, email, mobile, program interest or state.
- **Status**, **Source** and **Date range** (Today / This week / This month /
  Custom) filters narrow the list. Sorted newest-first by default.

### Lead statuses (the admissions funnel)

| Status | Meaning |
|--------|---------|
| **New** | Just submitted, not yet actioned |
| **Contacted** | Reached out to the applicant |
| **Interested** | Applicant is interested |
| **Applying** | Application started |
| **Admitted** | Seat booked / enrolled — counts as a conversion |
| **Not Interested** | Closed / not proceeding |

Change a status inline from the table, or on the lead's detail page. Every change
is timestamped in the lead's activity timeline.

### Lead detail (`/admin/leads/:id`)

Open a lead to see all captured fields and to:

- **Change its status** (logged to the activity timeline).
- **Add notes** — free-text notes, each timestamped and kept in history.
- **Record a conversion** value/type when admitted.
- Review the full **activity timeline** (created → contacted → … ).

### Export / import / delete

- **Export CSV** — downloads the currently shown leads (respecting filters) as a
  spreadsheet. Generated in your browser; nothing is uploaded.
- **Import CSV** — bulk-add leads from a CSV; duplicates are skipped by mobile
  number. Imported rows are written to the server store too.
- **Delete** — single or bulk delete (mirrored to the server).

---

## 4. Notices

`/admin/notices` — manage the announcements shown on `/notices` and the Home page.

- **Add Notice** → fill in **Title**, **Body**, **Category**, **Date**, and
  optionally **Pin** it. Categories: *Admission, Examination, Event, General,
  Result, Holiday*.
- **Publish vs draft** — a notice is only public when **Published**. Toggle
  publish/unpublish from the row actions; drafts stay hidden from the website.
- **Pin** a notice to force it to the top of the list (pinned notices show a pin
  marker).
- **Edit / Delete** from the row actions. Filter by category and search by
  title/body.

Published notices appear on `/notices`, and the latest surface on the Home page's
notice board. All notices persist in `api/data/notices.json`.

---

## 5. Events & calendar

`/admin/events` — manage events shown on `/events` (list + calendar) and the Home
"upcoming" panel. Two views over the **same** store:

- **List** — a table (title, category, dates, venue, published) with edit /
  publish / delete row actions and a category + upcoming/past filter.
- **Calendar** — a month grid (the same component the public Events page uses).
  Click a day to add an event on that date.

**Add Event** → **Title**, **Description**, **Category** (*Academic, Cultural,
Sports, Examination, Holiday, Workshop, General*), **Start date** (and optional
**End date** for multi-day), optional **start/end time**, **venue** and **image**.
As with notices, an event is public only when **Published**; drafts are visible to
admins but hidden from the website. Events persist in `api/data/events.json`.

---

## 6. Settings

`/admin/settings` — your "control room":

- **Account** — who you're signed in as, session start/expiry and time remaining,
  and **Sign out**. (Reminder that the password is the `REACT_APP_ADMIN_PASSWORD`
  env var.)
- **Connection status** — live status of the three shared stores (Leads / Notices
  / Events). Each is pinged with `?action=list` and shows a coloured pill
  (Connected / Unauthorized / No server key / Not configured / Unreachable) and
  its endpoint URL (copyable).
- **Admin-key handshake** — see below.
- **Data export** — download a snapshot of **Leads (CSV)**, **Notices (JSON)** or
  **Events (JSON)**. Files are built in your browser; nothing is uploaded.
- **Help & guide** — quick in-app reference cards.
- **Branding & content** — a read-only snapshot of `collegeInfo`, with a reminder
  that site content is edited in `src/data/*` and rebuilt (see
  [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md)).

---

## 7. Cross-device sync (how everyone sees the same data)

There is **no `localStorage` copy** of leads/notices/events. The server JSON
stores are the single source of truth, and the panel stays in sync by:

- **Polling the server every ~15 seconds** — a lead captured on a phone shows up
  on a laptop's admin within ~15s, and a notice published on one device appears
  on another shortly after.
- **`BroadcastChannel`** — a change made in one browser tab/window instantly
  refreshes the panel's other tabs/windows **on the same browser** (cross-device
  is handled by the poll above).

Because every write is mirrored to the server immediately, two admins on
different devices converge on the same data automatically (last write wins on a
field-by-field basis).

---

## 8. The admin-key handshake

Reading public data (the published notices/events list) is anonymous, but every
**admin action** — listing leads, creating/updating/deleting any record — must
authenticate with a shared key sent as the **`X-Admin-Key`** header.

- The panel sends `REACT_APP_LEADS_ADMIN_KEY` (baked in at build time).
- The PHP API accepts it if it matches **`ADMIN_API_KEY`** — set in
  `public/api/config.php`, falling back to the committed default in
  `leads.php` / `notices.php` / `events.php`.
- **All three stores share this one key.**

The **Admin-key handshake** row on the Settings page tells you exactly where you
stand:

| Pill | Meaning | Fix |
|------|---------|-----|
| **Verified** | Server accepted the key — list/update/delete authorised. | — |
| **Key mismatch** (401) | The build's key ≠ the server's `ADMIN_API_KEY`. | Make `REACT_APP_LEADS_ADMIN_KEY` and `ADMIN_API_KEY` identical, then rebuild. |
| **Server missing key** (503) | The server has no admin key configured. | Set `ADMIN_API_KEY` in `public/api/config.php`. |
| **Not set** | `REACT_APP_LEADS_ADMIN_KEY` is empty in this build. | Set it in `.env` and rebuild. |

A mismatch returns `401` and **silently breaks every admin write** (you'll be
unable to see leads or create notices/events) — so this is the first thing to
check if the panel "loads but is empty". See
[`DEPLOYMENT.md`](./DEPLOYMENT.md#the-admin-key) for the exact setup.
