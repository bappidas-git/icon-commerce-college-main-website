# Icon Commerce College — Website & Admin

The official, mobile-first **multi-page website** and **admin panel** for
**Icon Commerce College, Guwahati** (আইকন কমাৰ্চ কলেজ) — a Commerce, Arts &
Computer Application college established in 2004 and affiliated to **Gauhati
University** (NEP 2020 / FYUGP). The site presents the college (programs,
departments, faculty, facilities, admissions) and captures admission enquiries,
with an admin panel for managing leads, notices and events. Built with React 18,
Material UI v5, and Framer Motion.

> **This repository is mid-rebuild.** It started from a single-page landing-page
> boilerplate and is being transformed into the full Icon Commerce College site
> following the sequenced plan in [`prompts/`](prompts/). Read
> [`prompts/00-DESIGN-SYSTEM.md`](prompts/00-DESIGN-SYSTEM.md) first — it is the
> single source of truth for design tokens, content data, the site map and
> conventions. Comprehensive docs are regenerated in a later phase (prompt 39).

## Tech Stack

- React 18 (concurrent features, route-level lazy loading)
- Material UI v5 · Framer Motion
- CSS Modules + CSS Custom Properties
- React Router · Iconify (MDI icons) · SweetAlert2
- Web Vitals monitoring

## Quick Start

```bash
npm install
cp .env.example .env   # then fill in the values
npm start              # dev server
npm run build          # production build
```

Default admin credentials are configured in `.env`
(`REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD`).

## Lead / Notices / Events Storage

Leads POST to `/api/leads.php` — a shared server-side JSON store that is the
**single source of truth**, so every admin device sees the same data. Copy
`public/api/config.example.php` → `config.php`, set `ADMIN_API_KEY`, and set the
matching `REACT_APP_LEADS_ADMIN_KEY` in `.env`. Notices and Events reuse this
exact pattern (`notices.php` / `events.php`), added in a later phase.

## Documentation

- [`prompts/00-DESIGN-SYSTEM.md`](prompts/00-DESIGN-SYSTEM.md) — single source of truth
- [`prompts/README.md`](prompts/README.md) — the phased rebuild plan
- [`CHANGELOG.md`](CHANGELOG.md) — detailed changelog
- [`GTM_GUIDE.md`](GTM_GUIDE.md) — optional Google Tag Manager setup

## License

UNLICENSED — © Icon Commerce College.
