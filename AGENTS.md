<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

This repo uses the Next.js App Router API through `vinext` on Cloudflare Workers. Treat `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm exec vinext check`, and `wrangler deploy --dry-run` as the canonical workflows unless a task explicitly targets upstream Next internals.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-metadata-rules -->
# Project Metadata & MDX Maintenance Rules

Always follow these rules when editing or creating project content, metadata, or tech stack chips:

1. **MDX Frontmatter as SSOT**: Never hardcode project display metadata (title, description, role, metrics, techStack) in route or catalog files. Define it in each locale's MDX YAML frontmatter; `src/lib/portfolio/catalog.ts` statically imports it.
2. **Tech Stack Sync**: Keep `techStack` structurally aligned in both locale MDX files. Every value must exactly match a registered skill name in `src/lib/portfolio/skills.ts`; catalog validation derives project skills from frontmatter.
3. **TypeScript & Test Gates**: Run `pnpm exec tsc --noEmit --pretty false` and `pnpm exec vitest run` after any changes. Ambient types for MDX are declared in `src/env.d.ts`, and Vitest runs with a mock loader plugin for `.mdx` imports.
<!-- END:project-metadata-rules -->

<!-- BEGIN:verification-workflow-rules -->
# Regression Prevention & Automated Verification Rules

Always follow these rules for code stability and verification:

1. **Conductor Authority**: Architectural modeling, security boundary definition, business trade-offs, and final code approval remain strictly human-owned and verified.
2. **Strict Scope Limitation**: Touch only files directly tied to the request. Avoid unrelated diffs or formatting changes.
3. **Automated Verification Gates**: Run `pnpm exec tsc --noEmit` and `pnpm exec vitest run` after any changes. Pass static checks, lints, and unit tests before requesting review.
4. **Self-Diagnosis & Auto-Recovery**: If a verification gate fails, analyze the raw log outputs from the compiler or test framework. Run the autonomous loop—[Observe Logs ➡️ Formulate Hypothesis ➡️ Correct Code ➡️ Re-verify]—to resolve the issues before asking the developer for help.
5. **Logical Commit Division**: Group diffs by logical task. Present proposed commit messages and wait for user approval. Commit each group separately.
<!-- END:verification-workflow-rules -->
