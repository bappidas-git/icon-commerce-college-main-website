# Prompt 29 — Admin Notices Module (service + CRUD UI)

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§8); existing `leadService.js` as the sync pattern.
**Depends on:** 25, 28.
**Goal:** Let admins create/edit/delete/publish notices from the panel, synced cross-device.

## Tasks

1. **noticeService.js** — `src/admin/utils/noticeService.js`: mirror `leadService.js`:
   in-memory cache, `syncNoticesFromServer()`, 15s poll, `onNoticesChanged()` via
   BroadcastChannel + window event, and `getNotices(filters)`, `getNoticeById`,
   `createNotice`, `updateNotice`, `deleteNotice(s)`. Reads use the public `list`; writes use
   the admin key (`X-Admin-Key`). Config from a `getNoticesApiUrl()` (env `REACT_APP_NOTICES_API_URL`).

2. **Notices admin page** — `src/admin/pages/Notices.jsx` (`/admin/notices`):
   - DataTable: Title · Category · Date · Pinned · Published · Updated, with row actions
     (Edit, Toggle Publish, Pin/Unpin, Delete w/ ConfirmDialog). Search + category filter.
   - "Add Notice" button → form dialog/page.

3. **Notice form** — `src/admin/components/NoticeFormDialog.jsx`: fields title, category
   (select), date (date picker), body (textarea, optional simple markdown), attachment_url
   (optional), pinned (toggle), published (toggle). Validation + Toast on save. Create/edit
   modes. Writes via `noticeService` (optimistic + server mirror + notify).

4. Wire Dashboard's "Active Notices" tile + "Add Notice" quick action.

## Acceptance criteria
- Creating/editing/publishing/pinning/deleting a notice persists to `data/notices.json` and
  reflects across tabs/devices (poll + BroadcastChannel). Drafts (published=false) hidden from
  public list.
- Responsive; `npm run build` passes.

## PR
Draft PR "Phase 3.5 — Admin notices module". Update `CHANGELOG.md`.
