import { expect, type Page, type TestInfo, test } from '@playwright/test';
import sharp from 'sharp';
import { evaluateLayout, PAGE_CONTENT_HEIGHT_PX } from '../scripts/lib/printLayout.mjs';
import { PAGE_WIDTH } from '../src/components/portfolio-document/pageGeometry';

/*
 * The A4 print document at /portfolio.
 *
 * This spec mirrors the repo's established gate, scripts/verify-print-layout.mjs:
 * it measures the same atomic items (project blocks, and each section heading
 * glued to its first block) with the same arithmetic (scripts/lib/printLayout.mjs
 * is imported, not re-derived) and fails when any item exceeds the printable
 * height. That is the invariant a content edit breaks: one extra bullet pushes a
 * block past the budget, the screen preview keeps reporting the old page count,
 * and the PDF grows a page with a project's title and image split across it.
 *
 * Screenshots are attached as artifacts, not compared pixel-for-pixel. A pixel
 * gate needs a baseline generated on the platform that runs it — these baselines
 * would be macOS while CI is Linux, and font rasterisation differs — so the
 * measurements carry the gate and the pixels are evidence for a human. The one
 * pixel-level property asserted here is platform-independent: the paper stays
 * light, which is what a dark-mode leak breaks.
 */

const targets = [
  {
    expectations: {
      headings: ['01기술 스택', '02경력', '03프로젝트', '04프로젝트 아카이브', '05학력'],
      // Frontmatter titles, the same strings scripts/verify-print-layout.mjs
      // correlates against the project detail pages.
      projects: ['아이라 (aira)', '카메라파이 스튜디오 (CameraFi Studio)', '한줄은행'],
      title: '박준원',
    },
    lang: 'ko',
    path: '/portfolio',
  },
  {
    expectations: {
      headings: ['01Skills Set', '02Work Experience', '03Projects', '04Archives', '05Education'],
      projects: ['aira', 'CameraFi Studio', 'OnelineBank'],
      title: 'Junwon Park',
    },
    lang: 'en',
    path: '/portfolio?lang=en',
  },
] as const;

/*
 * Evaluated in the page; mirrors measureDocument in scripts/verify-print-layout.mjs
 * so the numbers mean the same thing as the platform gate's. Kept in the spec
 * because the script's copy is not exported and it runs through page.evaluate,
 * which cannot close over module scope.
 */
const measureDocument = () => {
  const sheet = document.querySelector('[data-document-sheet]');
  const layer = document.querySelector<HTMLElement>('[data-page-count]');
  if (!sheet || !layer) throw new Error('the document sheet or the page preview is missing');

  const text = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const title = (element: Element) =>
    text(element.querySelector('h3')) || text(element).slice(0, 48);
  const rect = sheet.getBoundingClientRect();

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
    headings: [...sheet.querySelectorAll(':scope > section > h2')].map(text),
    ink: getComputedStyle(sheet).color,
    pageCount: Number(layer.dataset.pageCount ?? 0),
    // The preview paints the paper: on screen the sheet itself turns transparent
    // once the layer has measured, and each preview page carries --doc-paper.
    previewPaper: getComputedStyle(layer.querySelector('div') ?? layer).backgroundColor,
    sheet: {
      height: rect.height,
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
    },
  };
};

const waitForSettledPreview = async (page: Page) => {
  // The preview writes 0 until fonts and eager figures have settled.
  await page.waitForFunction(
    () => document.querySelector('[data-page-count]')?.getAttribute('data-page-count') !== '0',
    undefined,
    { timeout: 30_000 },
  );
};

/** First A4 page of the sheet, attached to the report for visual review. */
const captureFirstPage = async (page: Page, testInfo: TestInfo, name: string) => {
  const measured = await page.evaluate(measureDocument);
  const screenshot = await page.screenshot({
    clip: {
      height: Math.round(measured.sheet.height > 0 ? Math.min(1200, measured.sheet.height) : 1200),
      width: Math.round(measured.sheet.width),
      x: Math.round(measured.sheet.left),
      y: Math.round(measured.sheet.top),
    },
    fullPage: true,
  });

  await testInfo.attach(name, { body: screenshot, contentType: 'image/png' });

  const channels = (await sharp(screenshot).stats()).channels;

  return {
    blue: channels[2]?.mean ?? 0,
    green: channels[1]?.mean ?? 0,
    red: channels[0]?.mean ?? 0,
  };
};

for (const target of targets) {
  test.describe(`the A4 document (${target.lang})`, () => {
    test('renders every section and project block', async ({ page }) => {
      const response = await page.goto(target.path);
      expect(response?.status()).toBe(200);

      const sheet = page.locator('[data-document-sheet]');
      await expect(sheet).toBeVisible();
      await expect(page.locator('main')).toHaveAttribute('lang', target.lang);
      await expect(sheet.locator('h1')).toHaveText(target.expectations.title);

      const measured = await page.evaluate(measureDocument);
      expect(measured.headings).toEqual(target.expectations.headings);

      const projectTitles = await sheet.locator('section > article h3').allTextContents();
      expect(projectTitles.length).toBeGreaterThanOrEqual(10);
      for (const project of target.expectations.projects) {
        expect(projectTitles).toContain(project);
      }

      // Every block carries the hooks the parity gate reads.
      expect(await sheet.locator('article [data-project-field="role"]').count()).toBeGreaterThan(0);
      await expect(sheet.locator('article [data-project-field="period"]').first()).not.toHaveText(
        '',
      );
    });

    test('fits the printable page budget', async ({ page }) => {
      await page.goto(target.path);
      await expect(page.locator('[data-document-sheet]')).toBeVisible();
      await waitForSettledPreview(page);

      const measured = await page.evaluate(measureDocument);
      const layout = evaluateLayout(measured);

      expect(measured.pageCount).toBeGreaterThan(0);
      expect(layout.violations).toEqual([]);
      expect(layout.worstBlock).not.toBeNull();

      // The preview reports 0 pages and keeps an issue flag when a block cannot
      // be packed; both mean the printed pagination is unverified.
      await expect(page.locator('[data-page-count]')).not.toHaveAttribute(
        'data-preview-issue',
        /.+/,
      );

      // The sheet is A4 wide, so a viewport or zoom regression shows up here
      // rather than as a silently reflowed document.
      expect(Math.abs(measured.sheet.width - Number.parseFloat(PAGE_WIDTH) * 96)).toBeLessThan(1);

      test.info().annotations.push({
        description: `${measured.pageCount} page(s), worst block ${layout.worstBlock.height.toFixed(2)}px of ${PAGE_CONTENT_HEIGHT_PX}px`,
        type: 'print-budget',
      });
    });

    test('stays a light-only paper document under a dark preference', async ({
      page,
    }, testInfo) => {
      // Same preference the theme initializer reads on a normal visit; the paper
      // routes opt out of the dark class entirely.
      await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
      await page.emulateMedia({ colorScheme: 'dark' });

      await page.goto(target.path);
      await waitForSettledPreview(page);

      await expect(page.locator('html')).not.toHaveClass(/dark/);

      const measured = await page.evaluate(measureDocument);
      // Fixed paper ink, not a theme token: --doc-ink is #111111.
      expect(measured.ink).toBe('rgb(17, 17, 17)');
      expect(measured.previewPaper).toBe('rgb(255, 255, 255)');

      const mean = await captureFirstPage(page, testInfo, `portfolio-${target.lang}.png`);
      // Paper is light: a dark-theme leak drops every channel towards the dark
      // palette, which on a printed document is a contrast failure.
      expect(mean.red).toBeGreaterThan(200);
      expect(mean.green).toBeGreaterThan(200);
      expect(mean.blue).toBeGreaterThan(200);

      // The printed surface itself: @media print repaints the sheet as paper.
      await page.emulateMedia({ media: 'print' });
      await expect(page.locator('[data-document-sheet]')).toHaveCSS(
        'background-color',
        'rgb(255, 255, 255)',
      );
    });
  });
}
