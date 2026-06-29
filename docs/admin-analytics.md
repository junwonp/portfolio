# Admin Analytics and Short Links

This document is the agent-facing map for the private admin surface, visitor analytics,
application short links, and the metrics dashboard.

## Runtime Surfaces

- `/a`: private admin dashboard. It renders analytics and link-management tabs through `src/app/a/AdminDashboard.tsx` and `src/app/a/DashboardClient.tsx`.
- `/a/actions.ts`: Server Actions for local dev login, logout, short-link creation, and short-link deletion.
- `/:slug`: public short URL route implemented by `src/app/(portfolio)/[slug]/page.tsx`. It loads active rows from `application_links`, applies tailored homepage presets, and returns 404 for expired or reserved slugs.
- `/api/analytics/track`: public analytics Route Handler. It receives browser beacons from `AnalyticsTracker`, validates/clamps payloads, and writes to D1.
- `/api/admin/content-overrides`: private admin write endpoint for browser-editable home/project content.

## Admin Access and Write Gates

Admin authorization is centralized in `src/lib/server/adminRequest.ts`.

- Production requests must pass Cloudflare Access JWT verification from `src/lib/server/adminAccess.ts`.
- After a valid Access request, the app can issue a signed `admin_session` cookie through `src/lib/server/adminSession.ts`.
- Local development can use the `/a` login action, which sets legacy `is_admin` and `owner_device` cookies only outside production.
- `owner_device` also suppresses analytics collection so owner/admin browsing does not pollute public metrics.
- Admin writes must pass both `isCurrentRequestAdmin()` and `isAdminWriteEnabledForCurrentRuntime()`.
- `APP_ENV=develop` deploys are intentionally read-only in production runtime, even when they point at production-backed D1/R2 bindings.

Required Worker settings for production admin access:

- `CF_ACCESS_TEAM_DOMAIN`: `https://<team-name>.cloudflareaccess.com`
- `CF_ACCESS_AUD`: Cloudflare Access audience tag. Comma-separated values are supported for AUD rotation.
- `ADMIN_SESSION_SECRET`: HMAC secret for `admin_session`. Set with `pnpm exec wrangler secret put ADMIN_SESSION_SECRET`.

## D1 Data Model

`schema.sql` defines the operational tables:

- `user_sessions`: one row per browser session. Stores country, user agent, referrer, admin flag, and creation time.
- `page_views`: page-level dwell time and max scroll depth. Linked to `user_sessions`.
- `application_links`: active or expired short links. Stores slug, company/label, role preset, summary preset, ordered project ids, and expiry.
- `application_link_visits`: maps one session to one application link. Current v1 attribution is session-scoped, not multi-touch.
- `content_overrides`: published browser edits for home/project content.
- `tags` and `revalidations`: vinext cache support tables.

## Tracking Flow

1. `src/lib/components/AnalyticsTracker.tsx` creates a session id in `sessionStorage`.
2. It sends an initial beacon with referrer/user agent and page flush beacons with path, dwell time, and scroll depth.
3. Single-segment public paths such as `/abcd` are interpreted as application-link slugs by `src/lib/utils/applicationSlug.ts`.
4. `/api/analytics/track` bypasses local, owner-device, and `IGNORE_IPS` traffic.
5. `src/lib/server/analyticsPayload.ts` validates payload shape, clamps dwell/scroll values, and normalizes optional slugs.
6. `src/lib/server/analyticsTracking.ts` writes `user_sessions`, `application_link_visits`, and `page_views`.

Payload rules:

- `sessionId` is required and capped at 128 characters.
- `path` must start with `/` and is capped at 2048 characters.
- `dwellTime` is clamped to `0..86400` seconds.
- `scrollDepth` is clamped to `0..100`.
- `referrer` and `userAgent` are trimmed with safe fallbacks.
- Explicit `applicationSlug` wins; otherwise the server can infer it from a valid single-segment path.

## Short URL Tailoring

`createApplicationLink()` accepts:

- `companyName`: required in the UI and stored up to 120 characters.
- `label`: optional display label, falling back to the company name.
- `slug`: optional custom slug. Invalid characters are removed by `normalizeApplicationSlug()`.
- `positioning`: maps to `role` and `summary_preset`.
- `ttlDays`: clamped to `1..90`; default UI value is 60 days.
- `projectIds`: up to four ordered project ids from the admin UI.

Reserved slugs include `a`, `admin`, `api`, `projects`, asset paths, and social redirect paths. If a submitted slug is empty or reserved, the server generates a four-character slug from the safe alphabet.

The public short URL page:

- rejects reserved slugs before D1 lookup,
- fetches only active rows where `expires_at > datetime('now')`,
- applies `project_ids` to the featured project order,
- applies `summary_preset` to homepage introduction copy,
- still respects published D1 content overrides.

## Dashboard Metrics

`src/app/a/AdminDashboard.tsx` reads D1 directly and sends prepared values to the client dashboard.

Global and link-filtered metrics include:

- total sessions,
- total page views,
- average dwell time,
- average scroll depth,
- daily range charts for 7 and 30 days,
- monthly range chart for 1 year,
- top pages,
- top referrers,
- top countries,
- active application-link table with sessions, views, average dwell, average scroll, last seen, and expiry.

Admin sessions are excluded with `user_sessions.is_admin = 0`.

## Cloudflare Bindings

The production Worker expects these bindings:

- `VINEXT_KV_CACHE`: vinext data cache.
- `portfolio_db`: D1 database for analytics, short links, content overrides, and vinext cache support tables.
- `portfolio_assets`: R2 bucket for private asset responses.
- `IMAGES`: Cloudflare Images binding used by `worker/index.ts` for Next image optimization.
- `ASSETS`: static asset binding.
- `APP_ENV`: environment marker.

The `develop` environment intentionally keeps admin writes disabled unless running outside production runtime with `ALLOW_ADMIN_WRITES=true`.

## Verification

Use these checks after admin analytics, short-link, or docs changes:

```bash
pnpm lint
pnpm exec vitest run
pnpm exec tsc --noEmit --pretty false
pnpm build
pnpm exec vinext check
pnpm exec wrangler deploy --dry-run --outdir /private/tmp/portfolio-worker-dry-run-admin-doc-review
```

For UI smoke tests:

1. Run `pnpm dev`.
2. Open `/a`.
3. In local development, use the local login button.
4. Check the analytics tab, links tab, range controls, link filter, and generated short URL load path.
5. If D1 writes are unavailable locally, rely on unit tests for attribution and only smoke-test UI load/disabled states.

