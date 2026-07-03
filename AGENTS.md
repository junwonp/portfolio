<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

This repo uses the Next.js App Router API through `vinext` on Cloudflare Workers. Treat `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm exec vinext check`, and `wrangler deploy --dry-run` as the canonical workflows unless a task explicitly targets upstream Next internals.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-metadata-rules -->
# Project Metadata & MDX Maintenance Rules

Always follow these rules when editing or creating project content, metadata, or tech stack chips:

1. **MDX Frontmatter as SSOT**: Never hardcode metadata (title, description, role, metrics, techStack) in `index.ts`. Define it in MDX YAML frontmatter and import it in `index.ts`.
2. **Tech Stack Sync**: Keep the project `skills` array in `index.ts` synchronized with the `techStack` listed in both MDX files. The tech stack strings in MDX must exactly match the registered skill names in `src/lib/data/skills.ts`.
3. **TypeScript & Test Gates**: Run `pnpm exec tsc --noEmit --pretty false` and `pnpm exec vitest run` after any changes. Ambient types for MDX are declared in `src/env.d.ts`, and Vitest runs with a mock loader plugin for `.mdx` imports.
<!-- END:project-metadata-rules -->
