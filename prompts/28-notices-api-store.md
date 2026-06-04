# Prompt 28 — Notices API Store (PHP/JSON)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§8); existing `public/api/leads.php` as the pattern.
**Depends on:** 25.
**Goal:** A server-side notices store mirroring the leads/telecalls pattern — the single
source of truth for notices shown on the public site.

## Tasks — `public/api/notices.php`

1. Copy the structure of `leads.php`: JSON file `api/data/notices.json`, `.htaccess` deny,
   flock-based read/write, same admin-key resolution (`config.php` → env → committed default
   that matches `REACT_APP_LEADS_ADMIN_KEY`), CORS headers.

2. **Endpoints** (one file):
   - `GET  ?action=list` — **public, no auth** (the website reads notices). Returns published
     notices (optionally all if admin key present, including drafts).
   - `POST ?action=create` — **admin key required**. Body `{ notice: {...} }`.
   - `POST ?action=update` — **admin key required**. Body `{ id, patch: {...} }`.
   - `POST ?action=delete` — **admin key required**. Body `{ ids: [...] }`.

3. **Notice record shape**:
   ```json
   {
     "id": "uuid",
     "title": "string",
     "body": "string (plain/markdown)",
     "category": "Admission|Examination|Event|General|Result|Holiday",
     "date": "ISO date (display/publish date)",
     "pinned": false,
     "published": true,
     "attachment_url": "optional string",
     "created_at": "ISO", "updated_at": "ISO"
   }
   ```
   Sort: pinned first, then `date` desc. Validate required fields (title, date); generate
   `id`/timestamps server-side if missing.

4. Keep responses `{ success, notices|error }`. No HTML/PII leakage. Mirror leads' safety
   (input validation, 400/401/404/500 codes).

## Acceptance criteria
- `curl` create/list/update/delete works; published filter respected on public list;
  unauthorized writes rejected; data persists in `data/notices.json`.
- Matches the env var `REACT_APP_NOTICES_API_URL=/api/notices.php`.

## PR
Draft PR "Phase 3.4 — Notices API store". Include curl examples in the description. Update `CHANGELOG.md`.
