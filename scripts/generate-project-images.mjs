import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractDeclaredImages, extractProjectImages } from './lib/projectImages.mjs';

/*
 * Writes the print document's per-project screenshot list from the project MDX.
 * Frontmatter stays the single source: editing a project page's images updates
 * the document on the next generate:media run, with no second list to maintain.
 *
 * ko is the canonical locale — it is the document's default. The two locales
 * are compared rather than merged, so a divergence is reported, never resolved
 * by silently picking one side.
 */

const locales = ['ko', 'en'];
const canonicalLocale = 'ko';
const root = fileURLToPath(new URL('../', import.meta.url));
const contentDirectory = path.join(root, 'src/content/projects');
const manifestPath = path.join(root, 'src/lib/generated/projectImages.json');

const entries = (await readdir(contentDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const docImages = new Map(locales.map((locale) => [locale, new Map()]));
const declaredImages = new Map(locales.map((locale) => [locale, new Map()]));

for (const slug of entries) {
  for (const locale of locales) {
    const source = await readFile(
      path.join(contentDirectory, slug, `detail.${locale}.mdx`),
      'utf8',
    );

    docImages.get(locale).set(slug, extractProjectImages(source));
    declaredImages.get(locale).set(slug, extractDeclaredImages(source));
  }
}

const canonical = docImages.get(canonicalLocale);
const divergences = [];

for (const slug of entries) {
  for (const locale of locales) {
    if (locale === canonicalLocale) continue;

    // Compared uncapped, so a divergence past the third image still surfaces.
    const declared = locales.map((entry) => declaredImages.get(entry).get(slug).join(', '));
    if (declared[0] !== declared[1]) divergences.push({ declared, locale, slug });
  }
}

if (divergences.length > 0) {
  const lines = divergences.map(
    ({ declared, locale, slug }) =>
      `  ${slug}: ${canonicalLocale}=[${declared[0]}] ${locale}=[${declared[1]}]`,
  );

  process.stdout.write(
    `Project image locales differ; ${canonicalLocale} is canonical:\n${lines.join('\n')}\n`,
  );
}

const manifest = Object.fromEntries(
  entries
    .map((slug) => [slug, canonical.get(slug)])
    .filter(([, images]) => images.length > 0)
    .sort(([a], [b]) => a.localeCompare(b)),
);

/*
 * Written in the repository's own format rather than JSON.stringify: `biome
 * check` is a commit gate, and it inlines an array that fits the 100 character
 * line width while stringify always expands it.
 */
const lineWidth = 100;

const inlineArray = (images) => `[${images.map((image) => JSON.stringify(image)).join(', ')}]`;

const serializeManifest = (manifestEntries) => {
  if (manifestEntries.length === 0) return '{}\n';

  const groups = manifestEntries.map(([slug, images]) => {
    const key = JSON.stringify(slug);
    const inline = `  ${key}: ${inlineArray(images)}`;

    return inline.length <= lineWidth
      ? [inline]
      : [`  ${key}: [`, images.map((image) => `    ${JSON.stringify(image)}`).join(',\n'), '  ]'];
  });

  const body = groups
    .map((group, index) => {
      const text = group.join('\n');

      return index === groups.length - 1 ? text : `${text},`;
    })
    .join('\n');

  return `{\n${body}\n}\n`;
};

await writeFile(manifestPath, serializeManifest(Object.entries(manifest)));

const counts = Object.entries(manifest).map(([slug, images]) => `${slug} ${images.length}`);
process.stdout.write(
  `Generated document images for ${counts.length} projects (of ${entries.length}): ${counts.join(', ')}.\n`,
);
