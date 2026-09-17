import { type BrowserContext, chromium, type FullConfig, type Page } from '@playwright/test';

/*
 * Settles the dev server's Vite dependency optimizer before any test navigates.
 *
 * The optimizer is lazy: the first module that imports a dependency triggers its
 * (re)bundle, which bumps that dependency's URL hash, answers the already-served
 * URL with 504 "Outdated Optimize Dep", and sends every connected page
 * `{"type":"full-reload","path":"*"}`. On a cold `node_modules/.vite` — what a
 * fresh `pnpm install` leaves in CI, and what the first run after a dependency
 * change leaves locally — that re-bundle lands in the middle of the first tests
 * that load pages, and the client-initiated reload aborts their in-flight
 * navigation as `net::ERR_ABORTED`.
 *
 * Reproduced on the cold cache, failing 1 of 5 runs of the specs' own
 * `/` → `/en/projects/*` sequence; every abort was preceded by the full-reload
 * and a 504 for `node_modules/.vite/deps/react-dom.js`.
 *
 * So every route the specs visit is loaded here, in a real browser, before any
 * test runs: the optimizer only discovers a dependency when a module imports it,
 * and only a browser requests the resulting client bundle, so an HTTP request
 * alone would not settle it.
 *
 * A single pass is not enough, and neither is a single connection, both measured
 * rather than assumed. Vite buffers a full-reload emitted while no page is
 * connected and hands it to the next client that connects (dist/node/chunks/node.js:
 * `if (payload.type === "full-reload" && !wss.clients.size) bufferedMessage =
 * payload`), so a pass that settles the optimizer after the warm-up's page closed
 * is delivered to the first test — exactly the abort this file exists to prevent.
 * An attempt therefore opens a fresh connection, which drains whatever was buffered
 * for it, and stays connected through two passes of the route list: the first
 * triggers the optimizer's last pass, the second is the window in which that pass
 * finishes, so its reload arrives live instead of being buffered. Attempts repeat
 * until one observes neither a full-reload nor an outdated-dep 504, which is the
 * same condition the tests need. The warm-up's own navigations absorb the churn it
 * exists to trigger: an abort here is retried, not reported.
 *
 * The route list is the union of what the five specs visit, taken from their
 * `page.goto` targets. A new spec that navigates somewhere new should add its
 * route here; `/github` is deliberately absent because the proxy answers it with
 * an external redirect, not a page.
 */

const MAX_ATTEMPTS = 3;

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

/** The optimizer's re-bundle can abort the very navigation that triggers it. */
const visit = async (page: Page, route: string): Promise<void> => {
  for (let attempt = 1; ; attempt += 1) {
    try {
      await page.goto(route, { waitUntil: 'load' });

      return;
    } catch (error) {
      if (attempt >= 3 || !String(error).includes('ERR_ABORTED')) throw error;
    }
  }
};

/*
 * The route list is the union of what the five specs visit, taken from their
 * `page.goto` targets; `/github` is absent because the proxy answers it with an
 * external redirect, not a page. The two project routes come from the index's own
 * first card, which is the card the specs open, rather than a hard-coded slug.
 */
const collectRoutes = async (context: BrowserContext): Promise<string[]> => {
  const page = await context.newPage();

  try {
    await visit(page, '/');

    const href = await page
      .locator('a[data-project-link-card="true"][href^="/projects/"]')
      .first()
      .getAttribute('href');
    const slug = href?.split('/').pop();

    return [
      '/',
      '/ko',
      '/en',
      '/portfolio',
      '/portfolio?lang=en',
      '/resume',
      '/projects/not-a-real-project',
      '/r/zzzz',
      '/en/r/zzzz',
      '/zzzz',
      ...(slug ? [`/projects/${slug}`, `/en/projects/${slug}`] : []),
    ];
  } finally {
    await page.close();
  }
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

      try {
        for (const route of routes) await visit(page, route);
        for (const route of routes) await visit(page, route);
      } finally {
        await page.close();
      }

      if (churn.reloads === 0 && churn.outdated === 0) return;

      process.stdout.write(
        `e2e warm-up: attempt ${attempt} saw ${churn.reloads} full-reload(s) and ${churn.outdated} outdated-dep 504(s); retrying.\n`,
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
