# Portfolio

A personal portfolio website built with the **Next.js 16 App Router API** on [vinext](https://www.npmjs.com/package/vinext) and deployed to **Cloudflare Workers**.

This repository is operated through `vinext`. Use the package scripts below for development, verification, and deployment instead of `next dev`, `next build`, or `next start`.

## Tech Stack

- **Framework**: [vinext](https://www.npmjs.com/package/vinext) with the [Next.js 16](https://nextjs.org/) App Router API
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Custom Properties
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
pnpm exec vitest run

# Type-check without emitting files
pnpm exec tsc --noEmit --pretty false

# Start the local production server
pnpm preview

# Deploy to Cloudflare Workers
pnpm deploy
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── lib/
│   ├── components/   # React components
│   ├── content/      # MDX project content
│   ├── data/         # Static data and constants
│   ├── hooks/        # Custom React hooks
│   ├── server/       # Server-side utilities (D1, R2)
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Shared utility functions
└── proxy.ts          # Request proxy
```

## Operational Notes

- Runtime-specific imports such as `cloudflare:workers` are part of the supported production path.
- `src/lib/server/cloudflare-workers.mock.ts` exists only for Vitest aliases and is not a fallback for a plain `next build` workflow.
- For production-shape validation, prefer `pnpm build`, `pnpm exec vinext check`, and `pnpm exec wrangler deploy --dry-run`.
- The `develop` deploy environment is intentionally read-only: admin writes stay disabled even if the app is pointed at production-backed bindings.
- The printable resume is served from `/resume`; production also maps `resume.junwon.dev` to the same Worker via a Cloudflare Workers custom domain route.

## Admin Analytics and Short Links

The private `/a` surface includes:

- visitor analytics from the public `/api/analytics/track` beacon endpoint,
- application-specific short URL creation and deletion,
- link-filtered metrics for sessions, page views, dwell time, scroll depth, referrers, countries, and top pages,
- content-editing write gates shared with `/api/admin/content-overrides`.

See [Admin Analytics and Short Links](docs/admin-analytics.md) for the data model, auth flow, D1 tables, Cloudflare bindings, and verification commands.

## Admin Access

Cloudflare Access should protect only the private admin surface:

- `/a`
- `/a/*`
- `/api/admin/*`

Keep `/` public. After Access authenticates `/a`, the app verifies `Cf-Access-Jwt-Assertion` and issues a signed `admin_session` cookie so the public home page can show editor controls only to the authenticated owner.

Required Worker settings:

- `CF_ACCESS_TEAM_DOMAIN`: `https://<team-name>.cloudflareaccess.com`
- `CF_ACCESS_AUD`: the Access application audience tag. Use a comma-separated list only during AUD rotation.
- `ADMIN_SESSION_SECRET`: set with `pnpm exec wrangler secret put ADMIN_SESSION_SECRET`; do not store this value in the repository.

## License

Private
