# Prompt 25 — Admin Cleanup & Shell

**Read first:** `prompts/00-DESIGN-SYSTEM.md` (§5 admin routes, §8).
**Depends on:** 01–10.
**Goal:** Strip the CIT-specific admin modules and rebuild the admin shell for the new
feature set (Leads, Notices, Events, Settings) with Navy+Gold styling.

## Tasks

1. **Remove** the tele-calling module and CIT ad-tech guideline content:
   - Delete `src/admin/pages/TeleCalling.jsx`, `TeleCallDetail.jsx`,
     `src/admin/components/TelecallFormDialog.jsx`, `src/admin/utils/telecallService.js`,
     `telecallStatus.js`, and `public/api/telecalls.php`.
   - Delete CIT guideline content under `src/admin/pages/guidelineContent/*`
     (GTM/Meta/GoogleAds/Conversion/SEO/Deployment/Developer guides). A new lean Help page
     is built in prompt 33.
   - Remove all imports/routes referencing the above.

2. **AdminLayout** — `src/admin/components/AdminLayout.jsx`: new sidebar nav:
   Dashboard · Leads · Notices · Events · Settings. Navy sidebar, gold active indicator,
   collapsible on mobile (drawer). Routes:
   ```
   /admin/dashboard
   /admin/leads            /admin/leads/:leadId
   /admin/notices
   /admin/events
   /admin/settings
   ```
   Lazy-load page components.

3. **AdminTopbar** — college name/logo, current section title, logged-in user, "View site"
   link, logout. Restyle navy+gold.

4. **Auth** — keep `AdminAuthContext`, `adminAuth.js`, `ProtectedRoute`, `AdminLogin`.
   Restyle the login page (navy card, gold accent, logo placeholder). Env vars:
   `REACT_APP_ADMIN_USERNAME`, `REACT_APP_ADMIN_PASSWORD`, `REACT_APP_LEADS_ADMIN_KEY`.
   Keep the 24h localStorage session + remember-me.

5. **Shared admin UI** — small reusable bits: `AdminPageHeader`, `StatTile`, `DataTable`
   (sortable/filterable/paginated), `ConfirmDialog`, `Toast`, `FormField`. These are reused
   by Leads/Notices/Events to keep modules consistent.

## Acceptance criteria
- Admin login works; sidebar shows the 4 sections; no tele-calling/CIT-guide references remain (grep clean).
- All admin routes render (placeholder pages OK until their prompts); responsive; `npm run build` passes.

## PR
Draft PR "Phase 3.1 — Admin cleanup & shell". Update `CHANGELOG.md`.
