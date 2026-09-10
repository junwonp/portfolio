import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const inputDirectory = path.join(root, 'public/images');
const outputDirectory = path.join(inputDirectory, 'generated');
const widths = [480, 768, 960, 1200, 1600];
const quality = 82;

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
  return [`/images/${relativePath.split(path.sep).join('/')}`, { width, height, variants }];
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
process.stdout.write(`Generated responsive variants for ${entries.length} images.\n`);
