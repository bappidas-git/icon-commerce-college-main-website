# Prompt 30 — Events API Store (PHP/JSON)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§8); `public/api/leads.php` + prompt 28 as the pattern.
**Depends on:** 25.
**Goal:** A server-side events/calendar store, mirroring notices.php.

## Tasks — `public/api/events.php`

1. Same structure as `notices.php`/`leads.php`: JSON file `api/data/events.json`,
   `.htaccess` deny, flock locking, admin-key resolution, CORS.

2. **Endpoints**:
   - `GET  ?action=list` — public, no auth (website calendar reads events). Optional
     `?from=&to=` date-range filter for the public calendar.
   - `POST ?action=create` — admin key. `{ event: {...} }`.
   - `POST ?action=update` — admin key. `{ id, patch: {...} }`.
   - `POST ?action=delete` — admin key. `{ ids: [...] }`.

3. **Event record shape**:
   ```json
   {
     "id": "uuid",
     "title": "string",
     "description": "string",
     "category": "Academic|Cultural|Sports|Examination|Holiday|Workshop|General",
     "start_date": "ISO date",
     "end_date": "ISO date (optional, for multi-day)",
     "start_time": "HH:mm (optional)",
     "end_time": "HH:mm (optional)",
     "venue": "string (optional)",
     "image_url": "optional placeholder name",
     "published": true,
     "created_at": "ISO", "updated_at": "ISO"
   }
   ```
   Sort by `start_date`. Validate required (title, start_date). Generate id/timestamps if missing.

4. Responses `{ success, events|error }`; proper status codes; input validation.

## Acceptance criteria
- `curl` CRUD works; date-range filter works; unauthorized writes rejected; persists to
  `data/events.json`. Matches `REACT_APP_EVENTS_API_URL=/api/events.php`.

## PR
Draft PR "Phase 3.6 — Events API store". curl examples in description. Update `CHANGELOG.md`.
