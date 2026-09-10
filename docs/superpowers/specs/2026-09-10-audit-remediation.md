# Portfolio audit remediation specification

## Goal
Resolve the observed correctness, accessibility, performance, and security findings while preserving both locales, project metadata, and existing navigation.

## Requirements
- Lightbox navigation always stays within image bounds, including rapid mixed input; closing cancels pending work and restores focus.
- Gallery touch input permits ordinary vertical page scrolling and native horizontal scrolling.
- Collapsed content is absent from keyboard navigation; modal background content is inert.
- Deleted application links stop resolving immediately; reserved public routes cannot become application slugs.
- Preview analytics cannot write production records; public analytics accepts bounded payloads and throttles repeated requests.
- Async administrator write checks are awaited.
- Images are delivered at appropriate sizes with stable intrinsic dimensions; critical font transfer is reduced without losing Korean glyphs.
- Authored diagrams render without shipping Mermaid to the browser, reserve final dimensions, and remain legible in both themes.

## Constraints
Use vinext and Cloudflare canonical workflows. Preserve unrelated edits. Do not commit, deploy, or change remote infrastructure during remediation. MDX frontmatter remains the source of truth. Existing authorization and CSRF protections remain intact.

## Verification
Add behavioral regression tests for reproduced failures before fixes. Run TypeScript, Vitest, Biome, production build, and Wrangler dry run. Inspect both locales, mobile scrolling, keyboard disclosure/modal behavior, rapid lightbox input, theme switching, and image/diagram layout in a browser. Report external security checks or deployment-dependent checks separately.

## Risks
Cache invalidation must agree with actual application route keys. Rate limits must use Cloudflare client identity and avoid trusting arbitrary forwarded headers. Font subsets must cover authored Korean and dynamic text fallback. Diagram generation must fail clearly on stale or unsupported sources and remain reproducible from repository tooling.
