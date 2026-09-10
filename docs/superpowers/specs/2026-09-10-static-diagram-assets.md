# Static diagram assets

Mermaid source remains in locale MDX `export const *Chart` template literals. Run `node scripts/generate-diagrams.mjs` after changing charts. The generator creates both theme variants and updates `src/generated/diagrams.json`; commit these outputs together with content.

Unchanged charts use checked-in assets without launching a browser. For changed charts, install Puppeteer's supported browser with its browser installer or set `PUPPETEER_EXECUTABLE_PATH` to an installed Chrome/Chromium executable. Build rendering is local; no chart content is sent to a rendering service. The development-only CLI uses strict rendering and SVG text labels rather than HTML foreign objects. Cache keys include generator version and chart content; bump the version when rendering configuration changes.

The component uses native image delivery with explicit integer dimensions. CSS selects the correct theme image for the application's `.dark` class, so manual theme changes do not execute Mermaid or change geometry. A missing chart asset throws a clear preparation error instead of falling back to client runtime rendering.

Verification: the Vitest asset coverage test checks every authored chart has both theme outputs, positive dimensions, and no script or foreign-object elements. The preparation command has also been run with an invalid browser path to verify cached builds do not require Chrome.
