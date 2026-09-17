import { expect, test } from '@playwright/test';

/*
 * The /r/:slug application-link namespace and the legacy root-level shim.
 *
 * A link that resolves renders a tailored home page, which needs an active row
 * in the D1 `application_links` table. E2E cannot seed that row: the suite runs
 * with no admin credentials, and the row (slug, company, expiry) is operator
 * data, not fixture data. So the deterministic half of the contract is what is
 * asserted here:
 *
 *   - an unknown slug must answer 404, never silently render a page;
 *   - the legacy shim must not shadow reserved top-level routes;
 *   - the legacy shim's permanent redirect needs a live row, so it is not
 *     asserted against a real link (see scripts/verify-print-layout.mjs for the
 *     platform-side parity gate that covers the rendered link).
 *
 * On a fresh local D1 (what CI gets) the missing `application_links` table is
 * tolerated by src/lib/server/application-links/store.ts and reported as "no
 * link", which is the 404 below. A *stale* local Miniflare database — one
 * created before the `deleted_at` migration — answers 500 instead, because the
 * store only tolerates the missing table. The app itself adds that column on
 * the next analytics write or admin read (ensureAnalyticsStorageSchema).
 */

test.describe('short links', () => {
  test('an unknown slug under /r/ answers 404', async ({ page }) => {
    const response = await page.goto('/r/zzzz');

    expect(response?.status()).toBe(404);
    await expect(page.locator('[data-layout-slot="main-content"]')).toHaveCount(0);
  });

  test('an unknown slug answers 404 under the English locale too', async ({ page }) => {
    const response = await page.goto('/en/r/zzzz');

    expect(response?.status()).toBe(404);
    await expect(page.locator('[data-layout-slot="main-content"]')).toHaveCount(0);
  });

  test('an unknown legacy root-level slug answers 404', async ({ page }) => {
    const response = await page.goto('/zzzz');

    expect(response?.status()).toBe(404);
    await expect(page.locator('[data-layout-slot="main-content"]')).toHaveCount(0);
  });

  test('reserved top-level routes are not swallowed by the legacy shim', async ({ page }) => {
    // `/portfolio` owns a route, so the shim must not turn it into a link lookup.
    const document = await page.goto('/portfolio');
    expect(document?.status()).toBe(200);
    await expect(page.locator('[data-document-sheet]')).toBeVisible();

    // `/resume` is reserved and routed; it must not be treated as an application slug.
    const resume = await page.goto('/resume');
    expect(resume?.status()).toBe(200);

    // `/github` is reserved and redirected by next.config.ts, not by the shim.
    const github = await page.request.get('/github', { maxRedirects: 0 });
    expect(github.status()).toBe(307);
    expect(github.headers().location).toBe('https://github.com/junwonp');
  });

  test('a reserved slug is never resolved as a link under /r/', async ({ page }) => {
    // The /r/ namespace is unconditional: the reserved-name check only guards the
    // legacy shim. An unknown slug there still has to 404 rather than fall back
    // to any reserved route's page.
    const response = await page.goto('/r/portfolio');

    expect(response?.status()).toBe(404);
    await expect(page.locator('[data-document-sheet]')).toHaveCount(0);
  });
});
