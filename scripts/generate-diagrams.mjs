import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { run } from '@mermaid-js/mermaid-cli';

const root = resolve('src/content/projects');
const output = resolve('public/diagrams');
const manifestPath = resolve('src/generated/diagrams.json');
const previous = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : {};
const manifest = {};
const themes = ['default', 'dark'];
const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
await mkdir(output, { recursive: true });
await mkdir(resolve('src/generated'), { recursive: true });

for (const file of (await readdir(root, { recursive: true })).sort()) {
  if (!file.endsWith('.mdx')) continue;
  const source = await readFile(resolve(root, file), 'utf8');
  for (const match of source.matchAll(/export const \w+Chart = `([^`]+)`;/g)) {
    const chart = match[1];
    if (chart.includes('${')) throw new Error(`Dynamic diagram source is unsupported: ${file}`);
    const hash = createHash('sha256').update(`v1:11.17.0:${chart}`).digest('hex').slice(0, 16);
    const light = `/diagrams/${hash}-default.svg`;
    const dark = `/diagrams/${hash}-dark.svg`;
    if (
      previous[chart]?.light === light &&
      [light, dark].every((asset) => existsSync(resolve('public', asset.slice(1))))
    ) {
      manifest[chart] = previous[chart];
      continue;
    }
    const temporary = await mkdtemp(resolve(tmpdir(), 'portfolio-diagram-'));
    const input = resolve(temporary, `${hash}.mmd`);
    await writeFile(input, chart);
    let dimensions;
    for (const theme of themes) {
      const svgPath = resolve(output, `${hash}-${theme}.svg`);
      await run(input, svgPath, {
        puppeteerConfig: executablePath ? { executablePath } : {},
        parseMMDOptions: {
          backgroundColor: 'transparent',
          mermaidConfig: {
            theme,
            securityLevel: 'strict',
            deterministicIds: true,
            deterministicIDSeed: hash,
            fontFamily: 'sans-serif',
            htmlLabels: false,
            flowchart: { htmlLabels: false, curve: 'basis', useMaxWidth: true },
          },
        },
      });
      const svg = (await readFile(svgPath, 'utf8')).replace(
        / role="graphics-document document"/g,
        '',
      );
      await writeFile(svgPath, svg);
      const viewBox = /viewBox="[^"]*?([\d.]+) ([\d.]+)"/.exec(svg);
      if (!viewBox || /<script|<foreignObject/i.test(svg))
        throw new Error(`Invalid SVG: ${svgPath}`);
      dimensions = { width: Math.ceil(Number(viewBox[1])), height: Math.ceil(Number(viewBox[2])) };
    }
    await rm(temporary, { recursive: true });
    manifest[chart] = { light, dark, ...dimensions };
  }
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
