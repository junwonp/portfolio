import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  evaluateLayout,
  PAGE_CONTENT_HEIGHT_PX,
  PAGE_HEIGHT_PX,
  pageCountViolation,
  pdfPageCount,
} from './lib/printLayout.mjs';

/*
 * Manual/local gate for the A4 print document at /portfolio. Nothing else checks
 * that every project block still fits the printable height, or that the screen
 * preview's page count still equals the real PDF's — the audit reproduced a
 * content edit that pushed a block to 1023.8px, kept the preview at 13 pages,
 * and made the PDF 14 with a project's title and image on different pages.
 *
 * Run `pnpm dev` first, then `node scripts/verify-print-layout.mjs`. Not wired
 * into CI: it needs a running dev server and a browser.
 *
 * Trap, verified the hard way: never call page.emulateMediaType('screen') before
 * page.pdf(). It leaks the screen layout into the print pipeline and produces
 * false page counts (12–13 instead of 14). Render without media emulation.
 */

const root = fileURLToPath(new URL('../', import.meta.url));
const baseUrl = process.env.PRINT_VERIFY_BASE_URL ?? 'http://localhost:3000';
const targets = [
  { label: 'ko', path: '/portfolio' },
  { label: 'en', path: '/portfolio?lang=en' },
];

/** The store path carries the version, so read the entry point from the package's own export map. */
const importPuppeteer = async () => {
  const store = path.join(root, 'node_modules/.pnpm');
  const directory = (await readdir(store))
    .filter((entry) => /^puppeteer@\d/.test(entry))
    .sort()
    .at(-1);
  if (!directory) throw new Error('puppeteer is not installed; run `pnpm install` first.');

  const packageDirectory = path.join(store, directory, 'node_modules/puppeteer');
  const manifest = JSON.parse(await readFile(path.join(packageDirectory, 'package.json'), 'utf8'));
  const entry = manifest.exports?.['.']?.import ?? manifest.module ?? manifest.main;

  return import(pathToFileURL(path.join(packageDirectory, entry)).href);
};

/*
 * Runs inside the page. Mirrors the preview's own item model: project blocks are
 * the atomic items, and a section heading is glued to its first block.
 */
const measureDocument = () => {
  const sheet = document.querySelector('[data-document-sheet]');
  const layer = document.querySelector('[data-page-count]');
  if (!sheet || !layer) throw new Error('the document sheet or the page preview is missing');

  const text = (element) => element?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const title = (element) => text(element.querySelector('h3')) || text(element).slice(0, 48);

  return {
    blocks: [...sheet.querySelectorAll('section > article')].map((article) => ({
      height: article.getBoundingClientRect().height,
      label: title(article),
    })),
    groups: [...sheet.querySelectorAll(':scope > section')].flatMap((section) => {
      const [heading, first] = [...section.children];
      if (!heading || !first) return [];
      const firstLabel = first.tagName === 'ARTICLE' ? title(first) : first.tagName.toLowerCase();

      return [
        {
          height: first.getBoundingClientRect().bottom - heading.getBoundingClientRect().top,
          label: `${text(heading)} + ${firstLabel}`,
        },
      ];
    }),
    pageCount: Number(layer.dataset.pageCount ?? 0),
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const formatPx = (value) => `${value.toFixed(2)}px`;

const puppeteer = await importPuppeteer();
const failures = [];

process.stdout.write(
  `A4 print layout verification — ${baseUrl} (A4 page ${formatPx(PAGE_HEIGHT_PX)}, printable budget ${formatPx(PAGE_CONTENT_HEIGHT_PX)})\n\n`,
);

let browser;
try {
  browser = await puppeteer.launch({
    headless: 'shell',
    ...(process.env.PUPPETEER_EXECUTABLE_PATH
      ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH }
      : {}),
  });

  for (const target of targets) {
    const page = await browser.newPage();

    try {
      await page.setViewport({ height: 900, width: 1280 });
      await page.goto(`${baseUrl}${target.path}`, {
        timeout: 60_000,
        waitUntil: 'domcontentloaded',
      });
      await page.waitForSelector('[data-document-sheet]', { timeout: 60_000 });
      // The preview writes 0 until fonts and figures have settled.
      await page.waitForFunction(
        () => document.querySelector('[data-page-count]')?.getAttribute('data-page-count') !== '0',
        { timeout: 60_000 },
      );
      await delay(400);

      const measured = await page.evaluate(measureDocument);
      const layout = evaluateLayout(measured);
      const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
      const actualPageCount = pdfPageCount(pdf);
      const mismatch = pageCountViolation(measured.pageCount, actualPageCount);

      process.stdout.write(
        `${target.path} (${target.label}): preview ${measured.pageCount} page(s), PDF ${actualPageCount} page(s)\n`,
      );

      if (mismatch) failures.push(`${target.label}: ${mismatch}`);
      for (const violation of layout.violations) failures.push(`${target.label}: ${violation}`);

      if (layout.worstBlock) {
        process.stdout.write(
          `  worst project block: “${layout.worstBlock.label}” ${formatPx(layout.worstBlock.height)} (headroom ${formatPx(PAGE_CONTENT_HEIGHT_PX - layout.worstBlock.height)})\n`,
        );
      }
      if (layout.worstGroup) {
        process.stdout.write(
          `  worst section group: “${layout.worstGroup.label}” ${formatPx(layout.worstGroup.height)} (headroom ${formatPx(PAGE_CONTENT_HEIGHT_PX - layout.worstGroup.height)})\n`,
        );
      }
      process.stdout.write('\n');
    } catch (error) {
      const message = String(error?.message ?? error).includes('ERR_CONNECTION_REFUSED')
        ? `cannot reach ${baseUrl} — start the dev server with \`pnpm dev\` first`
        : String(error?.message ?? error);
      failures.push(`${target.label}: ${message}`);
      process.stdout.write(`${target.path} (${target.label}): FAIL — ${message}\n\n`);
    } finally {
      await page.close();
    }
  }
} catch (error) {
  failures.push(String(error?.message ?? error));
} finally {
  if (browser) await browser.close().catch(() => {});
}

if (failures.length > 0) {
  process.stdout.write('FAIL\n');
  for (const failure of failures) process.stdout.write(`  - ${failure}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    'PASS: every block fits the page budget and preview page counts match the PDF.\n',
  );
}
