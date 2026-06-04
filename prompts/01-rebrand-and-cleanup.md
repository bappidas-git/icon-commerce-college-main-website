# Prompt 01 — Rebrand & Cleanup (strip CIT / ad-tech)

**Read first:** `prompts/00-DESIGN-SYSTEM.md`.
**Depends on:** none (this is the first prompt).
**Goal:** Convert the repo from "CIT Engineering Admissions" boilerplate into a clean
base for **Icon Commerce College**, removing engineering-specific content and the heavy
ad-tech stack we are not keeping (Lean analytics decision).

## Tasks

1. **Project metadata**
   - `package.json`: rename to `icon-commerce-college`, update `description`, `keywords`,
     `author` ("Icon Commerce College"), `homepage` "/". Keep all runtime deps EXCEPT remove
     only if unused after cleanup (`canvas-confetti` may stay for the Thank-You page).
   - Update `README.md` top section to describe the new project (full docs come in prompt 39 — a short stub is fine now).
   - Rewrite `CLAUDE.md` to describe Icon Commerce College (multi-page site + admin for
     leads, notices, events). Keep the "Lead Storage & Sync" explanation; replace the
     CIT/Tele-calling/brand-colour sections with the new Navy+Gold system and the new
     site map from the design-system doc.

2. **Remove ad-tech we are NOT keeping** (Lean decision). Delete these files and all imports/usages:
   - `src/utils/metaPixel.js`, `src/utils/metaCAPI.js`, `src/utils/googleAds.js`,
     `src/utils/googleAdsExport.js` (and admin import), `src/utils/enhancedConversions.js`,
     `src/utils/gclidManager.js`, `src/utils/consentMode.js`, `src/utils/eventDedup.js`.
   - `public/api/meta-capi.php`, `public/api/google-offline-conversions.php`.
   - In `src/App.jsx`, remove the imports/initializers for the above
     (`initConsentMode`, `initPixel`, `initGoogleAds`, `setupEnhancedConversions`,
     `captureGclid`, Meta `trackPageView`). Keep `initGTM` guarded by `REACT_APP_GTM_ID`.
   - Keep `src/utils/gtm.js`, `src/hooks/useGTMTracking.js`, `src/utils/webhookSubmit.js`,
     `src/utils/swalHelper.js`, `src/utils/validators.js`, `src/utils/formatters.js`, `src/utils/helpers.js`, `src/utils/seo.js`.
   - Simplify `useGTMTracking`/`gtm.js` so they no-op cleanly when no GTM id is set.

3. **Remove engineering / CIT content** that will be replaced wholesale (we rebuild pages later):
   - Delete CIT-specific section components that won't be reused:
     `WhyChooseCIT/`, `HighlightsSection/`, and the CIT copy inside other sections.
     (You may keep generic section folders as empty shells if convenient, but it's cleaner
     to delete CIT-named ones; new sections are built in Phase 2.)
   - Delete CIT data: contents of `src/data/servicesData.js`, `serviceDetailsData.js`,
     `featuresData.js`, `statsData.js`, `locationData.js` are replaced in prompt 03 — for
     now, empty them to `export const x = []` so the build stays green.
   - Remove the CIT logo/Cloudinary URLs and engineering phone numbers from Header, Footer,
     MobileDrawer, `public/index.html`, `manifest.json`, `robots.txt`, `sitemap.xml`
     (replace with Icon Commerce College placeholders / the contact info from the design doc).

4. **Env files**
   - Update `.env` and `.env.example`: remove `REACT_APP_META_*`, `REACT_APP_GOOGLE_ADS_*`,
     conversion/enhanced-conversion vars. Keep/seed:
     `REACT_APP_LEADS_API_URL=/api/leads.php`, `REACT_APP_LEADS_ADMIN_KEY=...`,
     `REACT_APP_ADMIN_USERNAME=admin`, `REACT_APP_ADMIN_PASSWORD=icc@2026`,
     `REACT_APP_GTM_ID=` (blank), and add `REACT_APP_NOTICES_API_URL=/api/notices.php`,
     `REACT_APP_EVENTS_API_URL=/api/events.php`. Update admin defaults in
     `public/api/config.example.php` comment accordingly.

5. **Delete CIT marketing docs** that no longer apply: `GTM_GUIDE.md` may stay (GTM still
   optional) but trim CIT references; delete `SEO_GUIDE.md`/`CUSTOMIZATION_GUIDE.md` only if
   you will regenerate equivalents in prompt 39 — otherwise leave them and note as stale.

## Acceptance criteria
- `npm run build` passes; no references remain to deleted modules (grep for `metaPixel`,
  `googleAds`, `consentMode`, `gclid`, `WhyChooseCIT`).
- App still boots to a (now mostly-empty) home route without runtime errors.
- No "CIT" / "engineering" / "VTU" / "Tumakuru" strings remain in shipped code (grep clean).

## PR
Draft PR titled "Phase 0.1 — Rebrand & cleanup (remove CIT + ad-tech)". List removed files
and remaining TODOs. Update `CHANGELOG.md`.
