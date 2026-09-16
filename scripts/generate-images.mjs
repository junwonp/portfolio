import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { assertProjectContent, LOCALES } from './lib/projectContent.mjs';
import { extractProjectImages } from './lib/projectImages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const inputDirectory = path.join(root, 'public/images');
const outputDirectory = path.join(inputDirectory, 'generated');
const contentDirectory = path.join(root, 'src/content/projects');
const widths = [480, 768, 960, 1200, 1600];
const quality = 82;
/*
 * The portfolio PDF embeds JPEGs untouched (DCTDecode), but it decodes every WebP
 * and re-encodes it losslessly on the way in, roughly sextupling its bytes. So each
 * width is produced twice: WebP for the site's <picture> and JPEG for print.
 */
const printQuality = 84;
/*
 * The figure row selects exactly one width per image — 480 for a portrait capture,
 * 768 for a landscape one (PortfolioDocument.toRowImage). Both are emitted so a
 * future change to that orientation rule cannot leave the document re-encoding WebP.
 */
const printWidths = [480, 768];
/** Mirrors --doc-surface; JPEG cannot store alpha, so transparency folds into the figure cell. */
const printSurface = '#f7f8fa';

/*
 * Only the document's own screenshots need JPEGs. They are committed to the repository,
 * so producing them for all ~190 assets would add ~10MB of files nothing ever reads.
 * Both locales are read: a divergence is reported, not resolved, and generating a few
 * extra bytes beats a locale flip silently falling back to the WebP encoding.
 */
const printSources = new Set();
const projectEntries = (await readdir(contentDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

assertProjectContent(root, contentDirectory, projectEntries);

for (const entry of projectEntries) {
  for (const locale of LOCALES) {
    const source = await readFile(
      path.join(contentDirectory, entry, `detail.${locale}.mdx`),
      'utf8',
    );

    for (const image of extractProjectImages(source)) printSources.add(image);
  }
}

async function generateImage(relativePath) {
  const input = await readFile(path.join(inputDirectory, relativePath));
  const metadata = await sharp(input).metadata();
  if (!metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) return null;
  const rotated = (metadata.orientation ?? 0) >= 5;
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;
  const hash = createHash('sha256')
    .update(input)
    .update(`webp-${quality}-v1`)
    .digest('hex')
    .slice(0, 16);
  // Separate hash so a change to the print encoding invalidates the JPEGs too.
  const printHash = createHash('sha256')
    .update(input)
    .update(`jpeg-${printQuality}-v1`)
    .digest('hex')
    .slice(0, 16);
  const sourcePath = `/images/${relativePath.split(path.sep).join('/')}`;
  const targets = [...new Set(widths.map((candidate) => Math.min(candidate, width)))];
  const variants = [];
  for (const target of targets) {
    const filename = `${hash}-${target}.webp`;
    const output = path.join(outputDirectory, filename);
    if (!existsSync(output)) {
      await sharp(input)
        .rotate()
        .resize({ width: target, withoutEnlargement: true })
        .webp({ quality })
        .toFile(output);
    }
    variants.push({ src: `/images/generated/${filename}`, width: target });
  }

  const printVariants = [];
  if (printSources.has(sourcePath)) {
    const printTargets = [...new Set(printWidths.map((candidate) => Math.min(candidate, width)))];
    for (const target of printTargets) {
      const printFilename = `${printHash}-${target}.jpg`;
      const printOutput = path.join(outputDirectory, printFilename);
      if (!existsSync(printOutput)) {
        await sharp(input)
          .rotate()
          .resize({ width: target, withoutEnlargement: true })
          .flatten({ background: printSurface })
          // 4:4:4 keeps UI text edges clean; screenshots are the whole subject here.
          .jpeg({ chromaSubsampling: '4:4:4', quality: printQuality })
          .toFile(printOutput);
      }
      printVariants.push({ src: `/images/generated/${printFilename}`, width: target });
    }
  }

  return [
    sourcePath,
    {
      width,
      height,
      variants,
      ...(printVariants.length > 0 ? { printVariants } : {}),
    },
  ];
}

await mkdir(outputDirectory, { recursive: true });
const files = (await readdir(inputDirectory, { recursive: true }))
  .filter((file) => !file.startsWith(`generated${path.sep}`) && /\.(png|jpe?g|webp)$/i.test(file))
  .sort();
const entries = [];
// Sequential generation bounds native image-decoder memory on CI and laptops.
for (const file of files) {
  const entry = await generateImage(file);
  if (entry) entries.push(entry);
}
await mkdir(path.join(root, 'src/lib/generated'), { recursive: true });
await writeFile(
  path.join(root, 'src/lib/generated/images.json'),
  `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`,
);
const printCount = entries.filter(([, asset]) => asset.printVariants).length;
process.stdout.write(
  `Generated responsive variants for ${entries.length} images; ${printCount} with print JPEGs.\n`,
);
