import { expect, test } from '@playwright/test';

import { parseAnalyticsPayloadBody } from '../src/lib/server/analytics/payload';

/*
 * The public analytics beacon at /api/analytics/track.
 *
 * Two angles, because they cover different halves of the contract:
 *
 *   1. The real UI sends a well-formed initial page beacon on a new session.
 *      That is deterministic in a fresh browser context, so it is asserted
 *      against the running app rather than a hand-built request.
 *   2. The endpoint's own HTTP contract is exercised with request.post().
 *
 * Trap this spec exists to record: on a local host the route answers
 * `{ success: true, bypassed: true }` *before* it parses the body
 * (shouldCollectAnalytics only accepts the production hosts, and the localhost
 * check sits above validation), so a malformed body is not observable as a 400
 * from a dev server, in CI or anywhere else. The rejection contract therefore
 * runs against the route's own validator — the same function the route calls —
 * and the HTTP assertions cover what a local server can answer truthfully.
 */

const BEACON_PATH = '/api/analytics/track';

const validBeacon = {
  activeTime: 0,
  articleProgress: 0,
  dwellTime: 0,
  eventType: 'page',
  isInitial: true,
  path: '/',
  referrer: 'direct',
  scrollDepth: 0,
  sessionId: 'e2e-analytics-session',
};

test.describe('analytics beacon', () => {
  test('the app sends a well-formed initial page beacon on a new session', async ({ page }) => {
    const beacons: string[] = [];
    await page.route(`**${BEACON_PATH}`, async (route) => {
      beacons.push(route.request().postData() ?? '');
      await route.fulfill({
        body: '{"success":true}',
        contentType: 'application/json',
        status: 200,
      });
    });

    await page.goto('/');
    await expect.poll(() => beacons.length).toBeGreaterThan(0);

    const payload: unknown = JSON.parse(beacons[0] ?? '');
    // The transport sends only the delta; the server classifies it as a page
    // event, so the validator is the assertion that both halves agree.
    expect(parseAnalyticsPayloadBody(payload)).toMatchObject({
      eventType: 'page',
      isInitial: true,
      referrer: 'direct',
    });
    expect(payload).toMatchObject({ isInitial: true, referrer: 'direct' });
    expect((payload as { sessionId: string }).sessionId).not.toBe('');
  });

  test('accepts a well-formed beacon and never records it from a dev host', async ({ request }) => {
    const response = await request.post(BEACON_PATH, {
      data: validBeacon,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);
    // `bypassed` is the privacy contract for every non-production host: the
    // beacon is answered, and nothing is written to D1.
    expect(await response.json()).toEqual({ success: true, bypassed: true });
  });

  test('rejects a malformed beacon', async () => {
    // A beacon without a session id, and one whose web-vital payload is missing
    // its metric fields, are both rejected by the route's validator.
    expect(parseAnalyticsPayloadBody({})).toBeNull();
    expect(parseAnalyticsPayloadBody({ sessionId: 42 })).toBeNull();
    expect(
      parseAnalyticsPayloadBody({ eventType: 'web-vital', metricId: 'v1', sessionId: 'x' }),
    ).toBeNull();
    expect(
      parseAnalyticsPayloadBody({ action: 'open', eventType: 'interaction', sessionId: 'x' }),
    ).toBeNull();

    // The well-formed shape the UI sends is accepted, so the rejection above is
    // about the missing fields and not about the validator refusing everything.
    expect(parseAnalyticsPayloadBody(validBeacon)).toMatchObject({ eventType: 'page' });
  });

  test('a malformed HTTP body is answered, not served a 5xx', async ({ request }) => {
    const response = await request.post(BEACON_PATH, {
      data: { nope: true },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ success: true, bypassed: true });
  });

  test('the beacon endpoint is POST-only', async ({ request }) => {
    for (const method of ['get', 'put', 'delete'] as const) {
      const response = await request[method](BEACON_PATH);
      expect(response.status(), `${method.toUpperCase()} ${BEACON_PATH}`).toBe(405);
    }
  });
});
