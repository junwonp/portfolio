import { type BrowserContext, expect, test } from '@playwright/test';

import { ADMIN_COOKIE } from '../src/lib/server/admin/access';

// CI lacks the Access JWT/secret, so a non-production /a authorises on ADMIN_COOKIE alone; cold and warmed Miniflare both answer the empty D1 state, and no admin write is exercised (link deletion is a soft delete).

const authorize = async (context: BrowserContext, baseURL: string | undefined): Promise<void> => {
  if (!baseURL) {
    throw new Error('the admin cookie needs the suite baseURL');
  }

  await context.addCookies([{ name: ADMIN_COOKIE, value: 'true', url: baseURL }]);
};

test.describe('admin gate', () => {
  test('without the cookie /a renders the login gate, not the dashboard', async ({ page }) => {
    const response = await page.goto('/a');

    // The unauthenticated branch renders AdminLogin in place instead of redirecting, so the gate is content, not a status code.
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: '관리자 로그인' })).toBeVisible();
    await expect(page.getByRole('button', { name: '로컬 개발자 우회 로그인' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '분석 대시보드' })).toHaveCount(0);
  });
});

test.describe('admin dashboard', () => {
  test('with the admin cookie /a renders the analytics panels in their zero state', async ({
    baseURL,
    context,
    page,
  }) => {
    await authorize(context, baseURL);

    const response = await page.goto('/a');
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1, name: '분석 대시보드' })).toBeVisible();
    await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible();

    await expect(page.getByRole('tab', { name: '분석' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#dashboard-panel-analytics')).toBeVisible();

    // No D1 rows: the first two MetricCards are session/page-view totals, and each table renders its empty state, not the error boundary.
    const values = page.locator('section[aria-label="핵심 지표"] dd');
    await expect(values.nth(0)).toHaveText('0');
    await expect(values.nth(1)).toHaveText('0');
    await expect(page.getByText('조건에 맞는 세션 정보가 없습니다.')).toBeVisible();
    await expect(page.getByText('아직 기록된 방문자 정보가 없습니다.')).toBeVisible();
  });

  test('the links tab switches to the application-link panel', async ({
    baseURL,
    context,
    page,
  }) => {
    await authorize(context, baseURL);
    await page.goto('/a');

    // The dev dashboard hydrates after load, so a first click can precede React's tab handler; retry until the click lands post-hydration.
    const linksTab = page.getByRole('tab', { name: '링크' });
    await expect(async () => {
      await linksTab.click();
      await expect(linksTab).toHaveAttribute('aria-selected', 'true', { timeout: 500 });
    }).toPass({ timeout: 15_000 });

    await expect(page.locator('#dashboard-panel-links')).toBeVisible();
    await expect(page.getByText('0개 활성 링크')).toBeVisible();
    await expect(page.getByText('아직 생성된 지원 링크가 없습니다.')).toBeVisible();
    // The creation form uses the same D1 path; a missing schema disables it with a reason rather than taking the panel down.
    await expect(page.getByRole('heading', { name: '지원 링크 생성' })).toBeVisible();
  });

  test('?tab=links server-renders the links panel on first paint', async ({
    baseURL,
    context,
    page,
  }) => {
    await authorize(context, baseURL);

    await page.goto('/a?tab=links');

    await expect(page.locator('#dashboard-panel-links')).toBeVisible();
    await expect(page.getByText('0개 활성 링크')).toBeVisible();
  });
});

test.describe('admin indexing', () => {
  test('both the gate and the dashboard answer noindex', async ({ baseURL, context, page }) => {
    // The proxy sets X-Robots-Tag and the admin layout the matching metadata, so the surface is noindex either way.
    const gate = await page.goto('/a');
    expect(gate?.headers()['x-robots-tag']).toBe('noindex, nofollow');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );

    await authorize(context, baseURL);
    const dashboard = await page.goto('/a');
    expect(dashboard?.headers()['x-robots-tag']).toBe('noindex, nofollow');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
  });
});
