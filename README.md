# Portfolio

A personal portfolio website built with the **Next.js 16 App Router API** on [vinext](https://www.npmjs.com/package/vinext) and deployed to **Cloudflare Workers**.

This repository is operated through `vinext`. Use the package scripts below for development, verification, and deployment instead of `next dev`, `next build`, or `next start`.

## Tech Stack

- **Framework**: [vinext](https://www.npmjs.com/package/vinext) with the [Next.js 16](https://nextjs.org/) App Router API
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: [vanilla-extract](https://vanilla-extract.style/) (CSS-in-TS) with CSS custom properties
- **Content**: MDX
- **Database**: Cloudflare D1
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Workers (via `vinext` and `@cloudflare/vite-plugin`)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run vinext-specific verification
pnpm exec vinext check

# Run the full unit test suite
pnpm test

# Run tests with coverage (enforces the coverage ratchet)
pnpm test:coverage

# Type-check without emitting files
pnpm exec tsc --noEmit --pretty false

# Start the local production server
pnpm preview

# Deploy to Cloudflare Workers
pnpm deploy
```

## Local Configuration

`wrangler.jsonc` and `wrangler.preview.jsonc` hold bindings, so they are committed. Account-specific identifiers (`account_id`, KV namespace id, D1 database id) belong in them; secrets never do. Set `ADMIN_SESSION_SECRET` and `CF_ACCESS_AUD` with `pnpm exec wrangler secret put <NAME>` for production, and keep local values in a gitignored `.dev.vars`.

A pre-commit privacy gate (`scripts/privacy-gate.mjs`) blocks secrets, secret-bearing files, and Cloudflare identifiers committed outside the wrangler configs, and warns when a real identifier is staged there. Add a `privacy-gate:allow` comment on a line to confirm a false positive. A companion `commit-msg` hook rejects commit messages carrying agent or attribution traces.

## Project Structure

```
src/
├── app/          # App Router routes, layouts, route handlers, and global styles
├── components/   # React components grouped by feature (admin, portfolio, print, resume, ui)
├── config/       # Site configuration
├── content/      # MDX project/privacy content and home/career/profile data
├── generated/    # Generated diagram manifest
├── lib/
│   ├── analytics/  # Client analytics helpers
│   ├── contexts/   # React context providers
│   ├── hooks/      # Custom React hooks
│   ├── mdx/        # MDX rehype/remark plugins
│   ├── portfolio/  # Portfolio domain: catalog, skills, resume, metadata
│   ├── server/     # Server-side: admin, analytics, application links, assets, D1
│   ├── states/     # Small state utilities
│   ├── stores/     # External stores
│   ├── styles/     # vanilla-extract theme tokens and generated font CSS
│   └── utils/      # Shared utility functions
└── proxy.ts      # Request proxy (locale, CSP, cache headers)
```

## Verification

`pnpm install` activates the repository pre-commit hook (`git config core.hooksPath .githooks`). The hook blocks a commit unless Biome, `tsc`, and the unit tests pass; CI runs the same checks in `.github/workflows/verify.yml`, and React Doctor runs in blocking mode.

The A4 print document has an additional layout gate that CI does not run, because it needs a browser: with `pnpm dev` running, `node scripts/verify-print-layout.mjs` measures every project block and section group in both locales against the printable height, compares the on-screen preview's page count with a headless-Chrome PDF, cross-checks each routed project's role, period and links against its detail page in both locales (listing any project it skips for having no detail route), reports the worst block and its headroom, and exits non-zero on any violation. Run it after content or document-style changes.

## Operational Notes

- Runtime-specific imports such as `cloudflare:workers` are part of the supported production path.
- `src/lib/server/infrastructure/cloudflare-workers.mock.ts` exists only for Vitest aliases and is not a fallback for a plain `next build` workflow.
- For production-shape validation, prefer `pnpm build`, `pnpm exec vinext check`, and `pnpm exec wrangler deploy --dry-run`.
- The `develop` deploy environment is intentionally read-only: admin writes stay disabled even if the app is pointed at production-backed bindings.
- The printable resume is served from `/resume`; production also maps `resume.junwon.dev` to the same Worker via a Cloudflare Workers custom domain route.
- The A4 portfolio document is served from `/portfolio`, with `?lang=en` selecting English. Like the `/print` routes it is a light-only paper document, and it shares `PrintToolbar` with the resume.

## Admin Analytics and Short Links

The private `/a` surface includes:

- visitor analytics from the public `/api/analytics/track` beacon endpoint,
- application-specific short URL creation and deletion,
- link-filtered metrics for sessions, page views, dwell time, scroll depth, referrers, countries, and top pages,
- authenticated tools for analytics metrics and application links.

Portfolio content is published from repository MDX and typed TypeScript catalog data; `/a` does not provide content editing.

See [Admin Analytics and Short Links](docs/admin-analytics.md) for the data model, auth flow, D1 tables, Cloudflare bindings, and verification commands.

## Admin Access

Cloudflare Access should protect only the private admin surface:

- `/a`
- `/a/*`
- `/api/admin/*`

Keep `/` public. After Access authenticates `/a`, the app verifies `Cf-Access-Jwt-Assertion` and issues a signed `admin_session` cookie for the retained analytics and application-link tools.

Required Worker settings:

- `CF_ACCESS_TEAM_DOMAIN`: `https://<team-name>.cloudflareaccess.com`
- `CF_ACCESS_AUD`: the Access application audience tag. Use a comma-separated list only during AUD rotation.
- `ADMIN_SESSION_SECRET`: set with `pnpm exec wrangler secret put ADMIN_SESSION_SECRET`; do not store this value in the repository.

## License

Private
