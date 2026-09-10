# Portfolio audit remediation tasks

Scope: resolve the reliability, native interaction, performance, and security issues from the audit. Preserve the design and both locales. Do not commit or deploy without the requested commit/deployment workflow.

## Completed implementation

- [x] Exclude deleted application links from active lookups.
- [x] Disable shared caching for application links and tailored resumes.
- [x] Reserve fixed routes so custom application slugs cannot shadow them.
- [x] Await administrator runtime write permissions in all consumers.
- [x] Disable preview analytics and preview dashboard schema writes.
- [x] Remove GET-triggered dummy analytics insertion.
- [x] Bound analytics request bodies to 8 KiB and add Cloudflare request throttling.
- [x] Replace lightbox drag timers with bounded native scroll-snap navigation.
- [x] Use a native modal dialog with background locking and persistent controls.
- [x] Allow vertical page scrolling across horizontal image galleries.
- [x] Keep collapsed content out of keyboard focus using `inert` (without `hidden`) so the accordion can animate.
- [x] Generate responsive image variants with intrinsic dimensions.
- [x] Replace automatic video playback and scroll listeners with native controls. (Revisited: project videos auto-play muted and looping again through a reduced-motion-aware script hook.)
- [x] Generate static light/dark diagram SVGs instead of browser Mermaid rendering.
- [x] Split the font into Latin, content, and fallback Unicode subsets.
- [x] Add regression tests and static-media generation documentation.

## Completed verification

- [x] Correct diagram dark-theme selectors and verify both themes in the production browser.
- [x] Normalize SVG accessibility metadata and generated formatting; remove fixed diagram-count assertion.
- [x] Document local browser setup for changed diagrams.
- [x] Independently review server/security, native interactions, media tooling, and font generation.
- [x] Validate all 12,032 source font mappings, nonoverlapping ranges, and variable axes.
- [x] Pass TypeScript, 46 Vitest files / 265 tests, lint/check (zero errors), and production build.
- [x] Pass vinext compatibility (15 supported / zero issues) and Cloudflare deployment dry run.
- [x] Check Korean/English pages, light/dark diagrams, and widths 320/375/768/1440.
- [x] Verify native dialog focus trapping, Escape restoration, rapid navigation, and image bounds.
- [x] Inspect responsive generated image selection, native gallery overflow/touch styles, and paused native video controls.
- [x] Confirm no Mermaid runtime chunks in client output and no errors in fresh production browser checks.
- [x] Record review results and leave changes uncommitted.

## Verification limits and follow-up

- [x] Dependency vulnerability lookup: registry access was authorized. The first `pnpm audit` reported 5 high transitive advisories in build/dev tooling (`browserslist` x2, `toml` x2, `sharp`); none ship in the Worker bundle. Pinned via `overrides` in `pnpm-workspace.yaml`; re-audit reports zero known vulnerabilities.
- [x] Lint review: `biome lint` reports zero warnings; the earlier "61 warnings" note was stale. `biome check` failed only on an un-ignored `.omo/` harness directory, now git-ignored so the check passes (253 files).
- [x] Development server: restarted fresh on a clean tree. Only framework-level notices remain (vinext "webpack" option partially supported; one Vite RSC `optimizeDeps` warning on a vinext-internal shim). No React hook or hydration warnings on `/`, `/en`, and project detail pages in Chromium.
- [x] Font subset loading and roles: body text uses Wanted Sans (`--font-family-text`) while inline code and code blocks use Geist Mono (`--font-family-code`, applied to `code:not(pre code)` and `pre`). Pages request only `latin` + `content` (114,976 bytes) plus Geist Mono for code; fallback Unicode subsets stay on-demand.
- [x] Browser verification: Chromium, Firefox, and WebKit load `/`, `/en`, and project pages with zero console errors; the body font resolves to Wanted Sans and code to Geist Mono in all three. Chromium additionally verified light/dark diagrams, widths 320/768/1440 with zero page overflow, native gallery scroll-snap with vertical scroll preserved, the native modal lightbox (focus trap, Escape focus restoration, bounded rapid navigation), and `hidden` + `inert` collapsed sections; Firefox and WebKit confirmed the native `<dialog>` modal and the collapse behavior.
- [x] Lightbox lazy-image issue: the DevTools "Lazy-loaded images should have explicit dimensions" issue is cleared by loading fullscreen slides eagerly while thumbnails stay lazy; opening the dialog now reports no issues.
- [x] Content hygiene: removed the unused `ProjectLightbox` import from the CameraFi Studio detail MDX in both locales.
- [x] Restore the accordion open/close animation with a native `grid-template-rows: 0fr → 1fr` transition; verified interpolating in Chromium, Firefox, and WebKit, with `inert` keyboard exclusion and the print override intact.
- [ ] Measure deployed Core Web Vitals and touch scrolling on actual devices.
- [ ] Validate the no-store application-link/resume policy and the rate-limit binding in the deployed environment.

## Native motion migration

- [x] `Select` replaced the custom listbox (state + outside-click listener) with a native `<select>`; the form now submits its value directly.
- [x] The more-menu became a native `popover="auto"` (top layer, light dismiss, Escape); the open state and window click listener were removed and the active button is styled through `:has(:popover-open)`.
- [x] Theme changes crossfade through the browser View Transitions API (`document.startViewTransition`), skipped under reduced motion.
- [x] The admin session detail row gains a native CSS reveal animation (the `Collapse` grid does not fit a `<table>`).
- [x] Route-level `<ViewTransition>` was evaluated and rejected: vinext auto-shims it with a passthrough fallback that does not animate.

## Deployment follow-up

- Deploy the rate-limiter binding together with the application code.
- Purge previously cached tailored application/resume pages when deploying the no-store policy.
- Validate Cloudflare Access/WAF configuration and actual device performance in the deployed environment.

Latest verification: 46 files / 265 tests, TypeScript, Biome check, production build, vinext compatibility (15 supported / 0 issues), and Cloudflare dry run all pass; `pnpm audit` reports zero known vulnerabilities; Chromium, Firefox, and WebKit load the main flows with zero console errors. Primary font subsets total 114,976 bytes versus the original 1,289,292-byte font. These asset reductions do not establish measured device frame rate or Core Web Vitals.
