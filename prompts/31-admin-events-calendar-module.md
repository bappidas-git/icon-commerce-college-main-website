# Prompt 31 — Admin Events & Calendar Module

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§8).
**Depends on:** 25, 30.
**Goal:** Let admins manage events with both a list and a calendar view, synced cross-device.

## Tasks

1. **eventService.js** — `src/admin/utils/eventService.js`: mirror `noticeService.js`
   (cache, `syncEventsFromServer()`, 15s poll, `onEventsChanged()`, `getEvents(filters)`,
   `getEventById`, `createEvent`, `updateEvent`, `deleteEvent(s)`; public list read, admin-key writes;
   env `REACT_APP_EVENTS_API_URL`).

2. **Events admin page** — `src/admin/pages/Events.jsx` (`/admin/events`):
   - **Toggle:** Calendar view (month grid; events on their day; click a day to add an event
     on that date or open existing) and List view (DataTable: Title · Category · Start ·
     End · Venue · Published, with Edit/Delete/Publish actions). Search + category + upcoming/past filter.
   - "Add Event" button → form dialog (prefill date when added from a calendar day).
   - Reuse/extract the month-grid component built for the public Events page (prompt 24) so
     admin + public share one calendar component.

3. **Event form** — `src/admin/components/EventFormDialog.jsx`: title, category, description,
   start_date, end_date, start_time, end_time, venue, image_url (placeholder name),
   published toggle. Validation (end ≥ start) + Toast. Create/edit. Writes via `eventService`.

4. Wire Dashboard "Upcoming Events" tile + "Add Event" quick action.

## Acceptance criteria
- Create/edit/delete/publish events from list AND calendar; persists to `data/events.json`;
  syncs across tabs/devices. Multi-day + timed events render correctly.
- Responsive (calendar collapses gracefully on mobile); `npm run build` passes.

## PR
Draft PR "Phase 3.7 — Admin events & calendar". Update `CHANGELOG.md`.
