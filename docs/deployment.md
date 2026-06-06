# Deployment — host config, caching & SPA routing

The site is a CRA build (`npm run build` → `build/`) that talks to a small PHP
API under `/api/`. It must be served from a host that can **execute PHP** (the
lead/notice/event stores are PHP/JSON). A static-only host will serve the pages
but the forms/admin won't persist.

---

## `.htaccess` (Apache)

`public/.htaccess` ships in the build root (CRA copies it to `build/.htaccess`).
It does three things:

### 1. SPA fallback rewrite

Client-side routes (`/courses`, `/admissions`, `/admin/...`) don't exist as
files on disk, so a hard refresh or shared deep link would 404 without this.
The rule serves `index.html` for anything that isn't a real file/dir, **after**
explicitly skipping `/api/` so the PHP endpoints run normally:

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

### 2. Caching

- **Content-hashed build assets** (`/static/**.js|css|woff2…`) →
  `Cache-Control: public, max-age=31536000, immutable`. The hash in the filename
  changes on every deploy, so a year-long immutable cache is safe.
- **Non-hashed images** (`/images/placeholders/*`, favicons) → cached ~30 days,
  so a production image swap shows up within a sensible window.
- **`index.html`, `service-worker.js`, `manifest.json`** → `no-cache` so a new
  deploy (with new hashed names) is picked up on the next visit. *(Keep this rule
  last — it must override the generic ones.)*

### 3. Compression + security headers

`mod_deflate` gzips text assets; `X-Content-Type-Options`, `Referrer-Policy` and
`X-Frame-Options` are set (they govern our pages only — the embedded Google Maps
iframe is unaffected, and they help the Lighthouse Best-Practices audit).

> **Nginx host?** The equivalents are `try_files $uri /index.html;` (with a
> `location /api/ { }` block kept separate), `location ~* \.(js|css|woff2)$ {
> add_header Cache-Control "public, max-age=31536000, immutable"; }`, and
> `gzip on;`.

## Environment variables

Set these on the host before building (see `.env.example` and
[lead architecture §8](../prompts/00-DESIGN-SYSTEM.md)):

- `REACT_APP_LEADS_API_URL`, `REACT_APP_NOTICES_API_URL`,
  `REACT_APP_EVENTS_API_URL`
- `REACT_APP_LEADS_ADMIN_KEY` (must match `ADMIN_API_KEY` in
  `public/api/config.php`)
- `REACT_APP_ADMIN_USERNAME`, `REACT_APP_ADMIN_PASSWORD`
- optional `REACT_APP_GTM_ID`

The `public/api/data/` folder ships with the build and must be **writable** by
PHP (it stores `leads.json` / `notices.json` / `events.json`); its own
`.htaccess` already denies direct web access to that directory.
