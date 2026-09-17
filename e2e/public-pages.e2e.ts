import { expect, test } from '@playwright/test';

/*
 * The locale roots and the project detail routes. Both are prerenderable and
 * D1-free, so they must render on a bare dev server.
 */

test.describe('locale roots', () => {
  test('the root renders the Korean home page with the site content', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');

    const main = page.locator('[data-layout-slot="main-content"]');
    await expect(main).toBeVisible();
    await expect(main.locator('h1').first()).toHaveText('박준원');

    // The index is the site's own statement of which projects are reachable.
    const projectLinks = page.locator('a[data-project-link-card="true"][href^="/projects/"]');
    expect(await projectLinks.count()).toBeGreaterThan(0);
  });

  test('the explicit default locale redirects to the unprefixed root', async ({ page }) => {
    // The proxy answers /ko with a 307 whose Location drops the locale prefix.
    const response = await page.request.get('/ko', { maxRedirects: 0 });

    expect(response.status()).toBe(307);
    expect(new URL(response.headers().location ?? '', 'http://localhost').pathname).toBe('/');

    // And the browser really ends up on the unprefixed root.
    await page.goto('/ko');
    await expect(page).toHaveURL(/\/$/);
  });

  test('the English root renders the English home page', async ({ page }) => {
    const response = await page.goto('/en');

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-layout-slot="main-content"] h1').first()).toHaveText(
      'Junwon Park',
    );
  });
});

test.describe('project detail routes', () => {
  test('a project the index links opens as a real detail page', async ({ page }) => {
    await page.goto('/');

    const card = page.locator('a[data-project-link-card="true"][href^="/projects/"]').first();
    const href = await card.getAttribute('href');
    const cardTitle = (await card.locator('h3').first().textContent())?.trim();

    expect(href).toBeTruthy();
    expect(cardTitle).toBeTruthy();

    const response = await page.goto(href ?? '/');

    expect(response?.status()).toBe(200);
    const hero = page.locator('[data-layout-slot="main-content"] header');
    // The hero is the detail page's contract with the document projection:
    // title, role and period are the three fields scripts/verify-print-layout.mjs
    // compares against the A4 document.
    await expect(hero.locator('h1')).toHaveText(cardTitle ?? '');
    await expect(hero.locator('span.badge.primary')).not.toHaveText('');
    expect(await hero.locator('span.badge.sub').count()).toBeGreaterThan(0);
    expect(await page.locator('html').getAttribute('lang')).toBe('ko');
  });

  test('the English detail route renders the same project under /en', async ({ page }) => {
    await page.goto('/');
    const href = await page
      .locator('a[data-project-link-card="true"][href^="/projects/"]')
      .first()
      .getAttribute('href');
    const slug = href?.split('/').pop();
    expect(slug).toBeTruthy();

    const response = await page.goto(`/en/projects/${slug}`);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-layout-slot="main-content"] header h1')).not.toHaveText('');
    // The detail hero is localized: the English route must not echo the Korean title.
    await expect(page.locator('[data-layout-slot="main-content"] header h1')).toContainText(
      /^[^가-힣]*$/,
    );
  });

  test('an unknown project answers 404 instead of rendering a page', async ({ page }) => {
    const response = await page.goto('/projects/not-a-real-project');

    expect(response?.status()).toBe(404);
    // The 404 boundary must not fall back to the home page's main content.
    await expect(page.locator('[data-layout-slot="main-content"]')).toHaveCount(0);
  });
});
