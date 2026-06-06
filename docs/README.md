# Documentation — Icon Commerce College

How to edit content, run the admin panel, swap images and deploy the site. The
**single source of truth for design, content and conventions** is
[`prompts/00-DESIGN-SYSTEM.md`](../prompts/00-DESIGN-SYSTEM.md); the top-level
[`README.md`](../README.md) is the project overview and quick start.

## Guides

- **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** — edit every kind of content
  (college info, courses, departments, faculty, leadership, testimonials,
  facilities, gallery, admissions, navigation) without writing code.
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** — log in and use the admin panel: leads
  (statuses, notes, export), notices, events/calendar, settings, cross-device
  sync and the admin-key handshake.
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — build, upload `build/` to a PHP host,
  `config.php` + writable `api/data/`, the `.htaccess` (SPA rewrite, caching,
  compression), env/config, HTTPS and the SEO files.
- **[IMAGES.md](./IMAGES.md)** — the labelled placeholders, recommended
  dimensions per slot, and the replace-in-place swap workflow.
- **[SEO.md](./SEO.md)** — titles, descriptions, schema.org, sitemap & robots.

## Reference

- **[performance.md](./performance.md)** — code-splitting, the `<Img>` component,
  fonts, bundle sizes and Lighthouse methodology.
- **[qa-checklist.md](./qa-checklist.md)** — the cross-page QA & link-audit record
  (link/CTA matrices, end-to-end flow trace, route regression).
- **[HANDOVER.md](./HANDOVER.md)** — the final build-verification record, the ticked
  acceptance checklist, the security sanity notes and the consolidated client
  TODO list (images, prospectus, social URLs, dates, keys & credentials).
- **[../GTM_GUIDE.md](../GTM_GUIDE.md)** — optional Google Tag Manager / analytics
  setup.
- **[../CHANGELOG.md](../CHANGELOG.md)** — detailed, phase-by-phase changelog.
