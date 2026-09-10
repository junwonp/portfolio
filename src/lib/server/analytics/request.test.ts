import { describe, expect, it } from 'vitest';
import { readAnalyticsBody, shouldCollectAnalytics } from './request';

describe('analytics request boundaries', () => {
  it('collects only production requests on canonical hosts', () => {
    expect(shouldCollectAnalytics('production', 'https://junwon.dev/api/analytics/track')).toBe(
      true,
    );
    expect(shouldCollectAnalytics('development', 'https://junwon.dev/api/analytics/track')).toBe(
      false,
    );
    expect(
      shouldCollectAnalytics('production', 'https://preview.workers.dev/api/analytics/track'),
    ).toBe(false);
    expect(shouldCollectAnalytics(undefined, 'https://junwon.dev/api/analytics/track')).toBe(false);
  });
  it('reads valid JSON', async () => {
    await expect(
      readAnalyticsBody(new Request('https://junwon.dev', { method: 'POST', body: '{"a":1}' })),
    ).resolves.toEqual({ a: 1 });
  });
  it('rejects oversized bodies without trusting content length', async () => {
    await expect(
      readAnalyticsBody(
        new Request('https://junwon.dev', {
          method: 'POST',
          body: 'x'.repeat(8193),
          headers: { 'content-length': '1' },
        }),
      ),
    ).rejects.toThrow('Payload too large');
  });
});
