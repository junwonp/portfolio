import { describe, expect, it } from 'vitest';

import { getAdminAccessDecision, verifyCloudflareAccessJwt } from '@/lib/server/adminAccess';

const encodeJwtPart = (value: Record<string, unknown>): string =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

describe('getAdminAccessDecision', () => {
  it('rejects production requests that only spoof a Cloudflare Access email header', () => {
    expect(
      getAdminAccessDecision({
        isAccessConfigured: true,
        isAccessJwtValid: false,
        isAdminCookieSet: false,
        isDev: false,
        userEmail: 'attacker@example.com',
      }),
    ).toEqual({
      isAuthorized: false,
      shouldClearAdminCookie: false,
      shouldSetAdminCookie: false,
      shouldSetOwnerDeviceCookie: false,
    });
  });

  it('authorizes production requests only when Access config and JWT verification pass', () => {
    expect(
      getAdminAccessDecision({
        isAccessConfigured: true,
        isAccessJwtValid: true,
        isAdminCookieSet: false,
        isDev: false,
        userEmail: 'owner@example.com',
      }),
    ).toMatchObject({
      isAuthorized: true,
      shouldSetAdminCookie: true,
      shouldSetOwnerDeviceCookie: true,
    });
  });

  it('fails closed in production when Access verification is not configured', () => {
    expect(
      getAdminAccessDecision({
        isAccessConfigured: false,
        isAccessJwtValid: false,
        isAdminCookieSet: true,
        isDev: false,
        userEmail: 'owner@example.com',
      }),
    ).toMatchObject({
      isAuthorized: false,
      shouldClearAdminCookie: true,
    });
  });

  it('treats Cloudflare Access JWKS fetch failures as invalid JWTs', async () => {
    const token = [
      encodeJwtPart({ alg: 'RS256', kid: 'test-key' }),
      encodeJwtPart({
        aud: 'test-aud',
        exp: Math.floor(Date.now() / 1000) + 60,
        iss: 'https://team.cloudflareaccess.com',
      }),
      'signature',
    ].join('.');

    await expect(
      verifyCloudflareAccessJwt({
        config: {
          policyAud: 'test-aud',
          teamDomain: 'https://team.cloudflareaccess.com',
        },
        fetcher: (async () => {
          throw new Error('network failure');
        }) as typeof fetch,
        token,
      }),
    ).resolves.toBe(false);
  });
});
