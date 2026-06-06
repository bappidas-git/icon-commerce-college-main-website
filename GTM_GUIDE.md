# Google Tag Manager (GTM) — optional analytics

Analytics is **off by default** and entirely optional. The site has a light,
self-contained GTM integration: when enabled, user interactions are pushed to
`window.dataLayer`, which a GTM container picks up and routes to GA4 (or any
other tag you configure). There is **no** Meta Pixel, Google Ads, Conversions
API or consent-mode code — those ad-tech modules were removed in the rebuild.

Files involved:

- **`src/utils/gtm.js`** — the dataLayer helpers (and `initGTM`, which injects the
  GTM script at runtime).
- **`src/App.jsx`** — calls `initGTM(REACT_APP_GTM_ID)` on mount when an id is set.
- **`src/components/common/EngagementTracker`** — fires the automatic engagement
  events (pageview, scroll depth, time on page, section views).

> There is **no GTM `<script>` snippet in `public/index.html`** — the container is
> injected programmatically, so you only set env vars (no HTML editing).

---

## 1. Enable it

1. Create a container at [tagmanager.google.com](https://tagmanager.google.com/)
   and copy the id (`GTM-XXXXXXX`).
2. Set **both** variables in `.env` (one enables analytics, one supplies the id):
   ```env
   REACT_APP_ENABLE_ANALYTICS=true
   REACT_APP_GTM_ID=GTM-XXXXXXX
   ```
3. `npm run build` and deploy (env is baked in at build time).
4. Verify with **GTM Preview** mode and by running `window.dataLayer` in the
   browser console.

> **Gating:** every helper no-ops unless `REACT_APP_ENABLE_ANALYTICS === 'true'`,
> and the container only loads when `REACT_APP_GTM_ID` is set. Leave either unset
> to ship the site with zero tracking.

---

## 2. dataLayer events

When enabled, these events are pushed to `window.dataLayer` (defined in
`src/utils/gtm.js`):

| Event | When it fires | Key parameters |
|-------|---------------|----------------|
| `virtual_pageview` | Route change | `page_path`, `page_title` |
| `lead_form_submission` | Enquiry form submitted | `formSource` |
| `generate_lead` | Form submitted (GA4 conversion format) | `currency` (`INR`), `value`, `lead_source`, `method` |
| `cta_click` | CTA button clicked | `cta_name`, `cta_location`, `cta_text` |
| `phone_click` | Phone link clicked | `phone_number`, `click_location` |
| `whatsapp_click` | WhatsApp link clicked | `click_location` |
| `navigation` | Header/drawer nav interaction | `nav_type`, `nav_action`, `nav_label` |
| `scroll_depth` | 25 / 50 / 75 / 100% reached | `scroll_percentage` |
| `time_on_page` | 30 / 60 / 120 / 300s reached | `time_seconds`, `time_label` |
| `section_view` | A section scrolls into view | `section_id` |
| `page_visibility` | Tab focus/blur | `visibility_state` |
| `form_field_focus` | A form field is focused | `form_id`, `field_name` |

No personally identifiable information (name/email/phone) is pushed to the
dataLayer.

---

## 3. GA4 via GTM (typical setup)

1. In GTM, add a **Google Analytics: GA4 Configuration** tag with your
   `G-XXXXXXXXXX` Measurement ID, trigger **All Pages**.
2. Add a **GA4 Event** tag named `generate_lead`, triggered by a **Custom Event**
   where the event name equals `generate_lead`, mapping the parameters
   (`lead_source`, `method`, …) from Data Layer Variables.
3. Repeat the Custom-Event pattern for any other events above you want in GA4
   (`cta_click`, `phone_click`, `whatsapp_click`, `scroll_depth`, …).
4. Publish the container.

---

## 4. Testing checklist

- [ ] GTM Preview shows the container loaded on the site.
- [ ] `window.dataLayer` contains `virtual_pageview` on navigation.
- [ ] Submitting an enquiry pushes `lead_form_submission` + `generate_lead`.
- [ ] `cta_click` / `phone_click` / `whatsapp_click` fire on the matching clicks.
- [ ] GA4 **DebugView** receives the events with the expected parameters.
- [ ] With `REACT_APP_ENABLE_ANALYTICS=false`, `window.dataLayer` stays empty
      (no tracking ships).
