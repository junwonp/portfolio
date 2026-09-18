import { type BrowserContext, chromium, type FullConfig, type Page } from '@playwright/test';

import { ADMIN_COOKIE } from '../src/lib/server/admin/access';

/*
 * Settles the dev server's lazy dependency optimizer before any test navigates.
 *
 * On a cold `node_modules/.vite` the first import of a dependency triggers a
 * re-bundle that answers already-served URLs with a 504 and broadcasts
 * `full-reload`, aborting in-flight navigations as `net::ERR_ABORTED` — measured
 * at 1 failure in 5 runs of the specs' `/` → `/en/projects/*` sequence. Only a
 * browser requests the bundle that triggers this, so plain HTTP requests cannot
 * settle it.
 *
 * Each attempt keeps one connection open across two passes of the route list.
 * Vite buffers a `full-reload` emitted while no page is connected and delivers it
 * to the next client, so the first pass triggers the optimizer's last pass and the
 * second is the window in which it finishes; attempts repeat until one observes
 * neither event. An abort during warm-up is retried, not reported.
 *
 * Add a route here when a spec navigates somewhere new. `/github` is deliberately
 * absent (the proxy answers it with an external redirect), and the admin routes
 * are warmed separately below because their dashboard chunks need the cookie.
 */

const MAX_ATTEMPTS = 3;

// The login gate and the dashboard are different module graphs; /a is warmed unauthenticated and again behind ADMIN_COOKIE.
const AUTHENTICATED_ROUTES = ['/a', '/a?tab=links'];

interface OptimizerChurn {
  outdated: number;
  reloads: number;
}

const watchChurn = (page: Page, churn: OptimizerChurn): void => {
  page.on('websocket', (socket) => {
    socket.on('framereceived', (frame) => {
      if (String(frame.payload).includes('full-reload')) churn.reloads += 1;
    });
  });
  page.on('response', (response) => {
    if (response.status() === 504) churn.outdated += 1;
  });
};

/** Reports failure instead of throwing: warm-up exists to reduce flake, so it must never be what fails the run. */
const visit = async (page: Page, route: string): Promise<boolean> => {
  for (let attempt = 1; ; attempt += 1) {
    try {
      await page.goto(route, { waitUntil: 'load' });

      return true;
    } catch (error) {
      if (attempt >= 3 || !String(error).includes('ERR_ABORTED')) return false;
    }
  }
};

const visitAll = async (page: Page, routes: string[]): Promise<boolean> => {
  const outcomes: boolean[] = [];

  for (const route of routes) outcomes.push(await visit(page, route));

  return outcomes.every(Boolean);
};

// The two project routes come from the index's own first card, the one the specs open, not a hard-coded slug.
const collectRoutes = async (context: BrowserContext): Promise<string[]> => {
  const page = await context.newPage();
  let slug: string | undefined;

  try {
    await visit(page, '/');

    const href = await page
      .locator('a[data-project-link-card="true"][href^="/projects/"]')
      .first()
      .getAttribute('href');
    slug = href?.split('/').pop();
  } catch (error) {
    process.stdout.write(
      `e2e warm-up: could not read the project slug (${String(error)}); warming the static routes only.\n`,
    );
  } finally {
    await page.close();
  }

  return [
    '/',
    '/ko',
    '/en',
    '/a',
    '/portfolio',
    '/portfolio?lang=en',
    '/resume',
    '/projects/not-a-real-project',
    '/r/zzzz',
    '/en/r/zzzz',
    '/zzzz',
    ...(slug ? [`/projects/${slug}`, `/en/projects/${slug}`] : []),
  ];
};

export default async function warmUpDevServer(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL;
  if (!baseURL) throw new Error('global-setup needs a baseURL to warm the dev server');

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });

  try {
    const routes = await collectRoutes(context);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const page = await context.newPage();
      const churn: OptimizerChurn = { outdated: 0, reloads: 0 };
      watchChurn(page, churn);

      let settled: boolean;

      try {
        settled = await visitAll(page, routes);
        settled = (await visitAll(page, routes)) && settled;

        // The authenticated pass runs after the open passes so /a warms both the gate and the cookie-only dashboard chunks.
        await context.addCookies([{ name: ADMIN_COOKIE, value: 'true', url: baseURL }]);
        settled = (await visitAll(page, AUTHENTICATED_ROUTES)) && settled;
        settled = (await visitAll(page, AUTHENTICATED_ROUTES)) && settled;
      } finally {
        await page.close();
      }

      if (settled && churn.reloads === 0 && churn.outdated === 0) return;

      process.stdout.write(
        `e2e warm-up: attempt ${attempt} saw ${churn.reloads} full-reload(s), ${churn.outdated} outdated-dep 504(s)${settled ? '' : ' and a failed navigation'}; retrying.\n`,
      );
    }

    process.stdout.write(
      `e2e warm-up: the dependency optimizer did not settle within ${MAX_ATTEMPTS} attempts; a navigation may be aborted by a full-reload and retried.\n`,
    );
  } finally {
    await context.close();
    await browser.close();
  }
}
