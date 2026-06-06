# Deployment

The site is a Create React App build (`npm run build` → `build/`) that talks to a
small **PHP** API under `/api/` (the lead / notice / event stores are PHP + JSON
files). It must be served from a host that can **execute PHP** — a static-only
host (Netlify/Vercel/S3) will serve the pages but the forms and admin won't
persist. Shared PHP hosting (cPanel, Hostinger, Cloudways, etc.) is the target.

---

## 1. Build

Set the environment variables **before** building — CRA inlines `REACT_APP_*` at
build time, so a value changed afterwards needs a rebuild.

```bash
cp .env.example .env     # then edit .env (see the env table below)
npm ci                   # clean install
npm run build            # → build/
```

The `build/` folder is your deployable artifact. It includes the static site,
the `api/` PHP endpoints, the placeholder images, `index.html`, `manifest.json`,
`robots.txt`, `sitemap.xml` and `.htaccess` (CRA copies everything from
`public/`).

### Environment variables

Only these are read by the app:

| Variable | Default | Notes |
|----------|---------|-------|
| `REACT_APP_LEADS_API_URL` | `/api/leads.php` | Full URL only if the API is on another domain. |
| `REACT_APP_NOTICES_API_URL` | `/api/notices.php` | |
| `REACT_APP_EVENTS_API_URL` | `/api/events.php` | |
| `REACT_APP_LEADS_ADMIN_KEY` | committed dev key | **Must match** `ADMIN_API_KEY` on the server. |
| `REACT_APP_ADMIN_USERNAME` | `admin` | Admin login. |
| `REACT_APP_ADMIN_PASSWORD` | `icc@2026` | Admin login — **change for production.** |
| `REACT_APP_GTM_ID` | _(empty)_ | Optional — see [`../GTM_GUIDE.md`](../GTM_GUIDE.md). |
| `REACT_APP_ENABLE_ANALYTICS` | `false` | Set `true` only with a GTM id. |

> The contact/identity vars in `.env.example` are inert — the college's details
> live in `src/data/collegeInfo.js` (see [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md)).

---

## 2. Upload

Copy the **contents** of `build/` into the host's web root (`public_html/`,
`www/`, or the app's document root) so the structure is:

```
public_html/
├── index.html
├── static/…                 # content-hashed JS/CSS (immutable-cacheable)
├── images/placeholders/…
├── prospectus/…
├── .htaccess
├── robots.txt  sitemap.xml  manifest.json
└── api/
    ├── leads.php  notices.php  events.php
    ├── config.php            # you create this (step 3)
    └── data/                 # MUST be writable by PHP (step 3)
```

Upload over SFTP/SSH, the host file manager, or a CI pipeline. (If you deploy via
Git, build in CI and publish `build/`.)

---

## 3. PHP API: config & writable data

### <a id="the-admin-key"></a>The admin key (`config.php`)

The admin panel authenticates with a shared key (`X-Admin-Key` header) that must
match the server's `ADMIN_API_KEY`:

1. On the server, copy **`api/config.example.php`** → **`api/config.php`** and set
   a long random key:
   ```php
   <?php
   define('ADMIN_API_KEY', 'a-long-random-string-you-choose');
   ```
2. Put the **same value** in `.env` and rebuild:
   ```env
   REACT_APP_LEADS_ADMIN_KEY="a-long-random-string-you-choose"
   ```

If you skip this, the committed default key in `leads.php` / `notices.php` /
`events.php` is used (fine for a quick demo, **not** for production). A mismatch
returns `401` and silently breaks every admin write — verify it on the admin
**Settings → Admin-key handshake** row (see
[`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md#8-the-admin-key-handshake)).

> Some hosts (e.g. Cloudways) let you set a `LEADS_ADMIN_KEY` environment
> variable instead of editing `config.php` — the PHP resolves that too.

### Writable data directory

The three JSON stores are created and updated inside **`api/data/`**. That folder
must be **writable by the PHP process**:

```bash
chmod 755 api/data            # or 775 depending on the host's PHP user
```

`api/data/.htaccess` already denies direct web access to the JSON files, so they
can't be fetched from a browser — only the PHP endpoints read/write them.

---

## 4. `.htaccess` (Apache) — already included

`public/.htaccess` ships in the build root and does three jobs. The PHP API under
`/api/` is left completely untouched.

### SPA fallback rewrite

Client-side routes (`/courses`, `/admissions`, `/admin/…`) aren't real files, so a
hard refresh or shared deep link would 404 without this. The rule serves
`index.html` for anything that isn't a real file/dir, **after** skipping `/api/`:

```apache
RewriteEngine On
RewriteBase /
Options -MultiViews
RewriteRule ^api/ - [L]                 # leave the PHP API alone
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]                     # real files/dirs served as-is
RewriteRule ^ index.html [L]            # everything else → SPA
```

### Caching

- **Content-hashed build assets** (`/static/**.js|css|woff2…`) →
  `Cache-Control: public, max-age=31536000, immutable` (the hash changes each
  deploy, so a year-long immutable cache is safe).
- **Non-hashed images** (`/images/placeholders/*`, favicons) → ~30 days, so a
  production image swap shows up within a sensible window.
- **`index.html`, `service-worker.js`, `manifest.json`** → `no-cache` so a new
  deploy is picked up on the next visit. *(This block is kept last so it overrides
  the generic rules.)*

### Compression + security headers

`mod_deflate` gzips text assets; `X-Content-Type-Options`, `Referrer-Policy` and
`X-Frame-Options` are set (they help the Lighthouse Best-Practices audit and don't
affect the embedded Google Maps iframe).

> **Nginx host?** Equivalents: `try_files $uri /index.html;` (with a separate
> `location /api/ { … }` that runs PHP-FPM), a `location ~* \.(js|css|woff2)$`
> block adding `Cache-Control "public, max-age=31536000, immutable"`, and
> `gzip on;`.

---

## 5. HTTPS

Serve the site over **HTTPS** (free via Let's Encrypt on most hosts; one-click on
cPanel/Cloudways). It's required for the secure session token, avoids mixed-content
warnings, and is assumed by the canonical URLs in `sitemap.xml` / `robots.txt`.
Redirect `http://` → `https://` and the bare domain → your canonical host.

---

## 6. SEO files — point them at your domain

- **`robots.txt`** — update the `Sitemap:` and `Host:` lines to your production
  domain; it already disallows `/admin/` and `/thank-you`.
- **`sitemap.xml`** — update each `<loc>` to your domain and refresh `<lastmod>`.
- **Canonical / Open Graph** — `siteUrl` and the share image are set in
  `src/config/seo.js` and `public/index.html`.

The current files use `https://iconcommercecollege.in`. Full details:
[`SEO.md`](./SEO.md).

---

## 7. Analytics (optional)

Google Tag Manager is off by default. To enable it, set `REACT_APP_GTM_ID` and
`REACT_APP_ENABLE_ANALYTICS=true`, put the container ID in `public/index.html`,
rebuild and redeploy. See [`../GTM_GUIDE.md`](../GTM_GUIDE.md).

---

## 8. Post-deploy smoke test

- [ ] Home and a deep link (e.g. `/courses/bca`) both load on a **hard refresh**
      (SPA rewrite works).
- [ ] Submit a public enquiry → it redirects to `/thank-you` and appears in
      `/admin/leads` within ~15s.
- [ ] `/admin/login` works; **Settings → Connection status** shows all three
      stores **Connected** and the **Admin-key handshake** is **Verified**.
- [ ] Publish a test notice/event → it appears on `/notices` / `/events`.
- [ ] Site is HTTPS with no mixed-content console warnings.
- [ ] `robots.txt` and `sitemap.xml` show your real domain.

---

## Updating a live site

Rebuild and re-upload `build/`. **Do not** overwrite `api/config.php` or the
`api/data/` JSON stores on the server — those hold your key and live data. A
typical deploy syncs everything **except** `api/config.php` and `api/data/`.
