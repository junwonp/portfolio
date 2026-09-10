# Static media preparation

Run `pnpm generate:media` from the repository root to prepare responsive images and diagrams. `pnpm dev` and `pnpm build` run it automatically. Generated outputs and their manifests belong in the same change as their source content.

## Responsive images

`node scripts/generate-images.mjs` uses the repository's development dependency `sharp`. It reads local PNG, JPEG, and WebP images under `public/images`, corrects orientation, and writes content-addressed WebP variants under `public/images/generated` without upscaling. `src/lib/generated/images.json` records original dimensions and available widths. Animated images retain their existing delivery path. Existing hashed variants are reused.

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
