# Static media preparation

Run `pnpm generate:media` from the repository root to prepare responsive images, diagrams, and the print document's image manifest. `pnpm dev` and `pnpm build` run it automatically. Generated outputs and their manifests belong in the same change as their source content.

## Responsive images

`node scripts/generate-images.mjs` uses the repository's development dependency `sharp`. It reads local PNG, JPEG, and WebP images under `public/images`, corrects orientation, and writes content-addressed WebP variants under `public/images/generated` without upscaling. `src/lib/generated/images.json` records original dimensions and available widths. Animated images retain their existing delivery path. Existing hashed variants are reused.

The same generator also emits **JPEG print variants** for the images the `/portfolio` print document selects, recorded on the manifest entry as `printVariants`. A PDF embeds a JPEG byte-for-byte (`DCTDecode`), but Skia decodes every WebP and re-encodes it losslessly on the way in — one measured screenshot went from 42,500 B as WebP to 328,312 B in the PDF, while its JPEG(q84) counterpart stayed at 71,809 B. The document therefore reads its figures through `getPrintImageUrl` (`src/lib/utils/image.ts`) and falls back to the WebP variants only when an asset has no print variant. Those fallbacks are tolerated for non-document images (legacy assets, images on the live site); for the document itself they are a size regression, which is why `src/lib/utils/image.test.ts` asserts that every `projectImages.json` entry has a JPEG print variant that exists on disk.

The JPEGs are committed, so generation is scoped to the document's own screenshots rather than all 52 source images (~190 variant files): producing print variants for everything would add uncounted megabytes to the repository that nothing reads. One consequence to remember — because the document must not fall back to WebP, print variants are always generated from both locales (see below).

## Print document images

`node scripts/generate-project-images.mjs` writes `src/lib/generated/projectImages.json`, the per-project screenshots the A4 document at `/portfolio` shows — at most three per project (`MAX_PROJECT_IMAGES`). It reads the project MDX through `scripts/lib/projectImages.mjs`, the same extractor the freshness test in `src/lib/portfolio/documentProjection.test.ts` uses, so the checked-in manifest cannot drift from the content. The frontmatter `image` is the representative shot, then the desktop `src` of each body figure in document order, de-duplicated. Mobile crops (`mobileSrc`), videos, icons, and sources outside `/images/` are not document figures. Korean is canonical; a locale divergence is reported, never merged.

Scanned text is not a rendered MDX tree: the extractor strips MDX comment expressions and fenced code blocks before reading `src`, and accepts both `src="…"` and `src={'…'}` / `src={"…"}`. A full parse would need an MDX parser this repository does not depend on directly.

Both generators read every project directory and fail with the missing path when `detail.ko.mdx` or `detail.en.mdx` is absent. Skipping would silently drop the project's screenshots from the document and its JPEG print variants from the manifest — a locale file is content, so a missing one is a content bug.

Commit `projectImages.json` and the regenerated JPEGs together with the MDX edit that caused them. `pnpm generate:media` rewrites them in place; the freshness test and the print-asset guard in `src/lib/utils/image.test.ts` fail when they lag behind.

## Diagrams

`node scripts/generate-diagrams.mjs` reads authored `export const *Chart` template literals from locale MDX files. It produces light and dark SVGs under `public/diagrams` and updates `src/generated/diagrams.json` with intrinsic dimensions. Static images replace browser Mermaid execution.

Unchanged charts use checked-in assets and require no Chrome installation. Changed charts require a local Puppeteer-compatible Chrome/Chromium: either provision Puppeteer's supported browser or set `PUPPETEER_EXECUTABLE_PATH` to its executable. For example on macOS:

```sh
PUPPETEER_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node scripts/generate-diagrams.mjs
```

Rendering stays local. Dynamic interpolation in chart definitions is unsupported. Bump the generator cache version when rendering configuration changes.

## Font subsets

Normal development and production builds use checked-in font assets; Python is not required. To regenerate after a font replacement or substantial content changes, provision Python with `fonttools[woff]`, then run:

```sh
python scripts/generate-fonts.py
```

The generator reads `src/app/fonts/WantedSansVariable.woff2`, writes content-addressed WOFF2 subsets under `public/fonts/wanted`, and updates `src/lib/styles/fonts.generated.css` and `src/lib/generated/fonts.json`. Keep these outputs together.

Latin and authored-content subsets currently total **114,976 bytes**. Additional Unicode ranges are split into fallback subsets loaded only when their glyphs are needed. All **12,032 source character mappings** remain covered with non-overlapping CSS Unicode ranges; the original variable weight axis remains in each subset. New or dynamic Korean text can therefore load the matching fallback rather than losing the font glyph. The CSS uses `font-display: swap` and does not globally preload the full source font.

Generated output depends on the fontTools/Brotli versions, so use the same toolchain when byte-for-byte reproducibility is needed. Existing obsolete content-addressed assets are not automatically deleted; remove only unreferenced files as an intentional cleanup after checking the manifests.

## Verification

Run `pnpm exec tsc --noEmit --pretty false` and `pnpm exec vitest run` after preparation. Check browser image requests, both diagram themes, and Korean text rendering at mobile and desktop sizes. Asset dimensions and subset byte counts do not substitute for real browser performance measurement.
