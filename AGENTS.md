<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

This repo uses the Next.js App Router API through `vinext` on Cloudflare Workers. Treat `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm exec vinext check`, and `wrangler deploy --dry-run` as the canonical workflows unless a task explicitly targets upstream Next internals.
<!-- END:nextjs-agent-rules -->
