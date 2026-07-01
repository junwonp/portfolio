import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getAdminAccessDecision,
  getCloudflareAccessConfig,
  isAdminWriteEnabled,
  verifyCloudflareAccessJwt,
} from '@/lib/server/adminAccess';

const encodeJwtPart = (value: Record<string, unknown>): string =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

const signAccessJwt = async ({
  aud,
  email = 'owner@example.com',
  exp = Math.floor(Date.now() / 1000) + 60,
  iss = 'https://team.cloudflareaccess.com',
}: {
  aud: string | string[];
  email?: string;
  exp?: number;
  iss?: string;
}) => {
  const keyPair = await crypto.subtle.generateKey(
    {
      hash: 'SHA-256',
      modulusLength: 2048,
      name: 'RSASSA-PKCS1-v1_5',
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    true,
    ['sign', 'verify'],
  );
  const publicJwk = (await crypto.subtle.exportKey('jwk', keyPair.publicKey)) as JsonWebKey & {
    kid?: string;
  };
  publicJwk.alg = 'RS256';
  publicJwk.kid = 'test-key';
  publicJwk.use = 'sig';

  const encodedHeader = encodeJwtPart({ alg: 'RS256', kid: 'test-key' });
  const encodedPayload = encodeJwtPart({
    aud,
    email,
    exp,
    iss,
    nbf: Math.floor(Date.now() / 1000) - 60,
    type: 'app',
  });
  const signedData = `${encodedHeader}.${encodedPayload}`;
  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    keyPair.privateKey,
    new TextEncoder().encode(signedData),
  );

  return {
    publicJwk,
    token: `${signedData}.${Buffer.from(signature).toString('base64url')}`,
  };
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getCloudflareAccessConfig', () => {
  it('parses comma-separated Access audience values', () => {
    expect(
      getCloudflareAccessConfig({
        CF_ACCESS_AUD: 'aud-one, aud-two',
        CF_ACCESS_TEAM_DOMAIN: 'https://team.cloudflareaccess.com/',
      }),
    ).toEqual({
      policyAudiences: ['aud-one', 'aud-two'],
      teamDomain: 'https://team.cloudflareaccess.com',
    });
  });
});

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
    ).toMatchObject({
      isAuthorized: false,
      shouldClearAdminCookie: false,
      shouldSetAdminCookie: false,
      shouldSetAdminSessionCookie: false,
      shouldSetOwnerDeviceCookie: false,
    });
  });

  it('authorizes production requests and requests a local session when Access JWT verification passes', () => {
    expect(
      getAdminAccessDecision({
        accessEmail: 'owner@example.com',
        isAccessConfigured: true,
        isAccessJwtValid: true,
        isAdminCookieSet: false,
        isAdminSessionValid: false,
        isDev: false,
        userEmail: 'owner@example.com',
      }),
    ).toMatchObject({
      isAuthorized: true,
      shouldSetAdminCookie: false,
      shouldSetAdminSessionCookie: true,
      shouldSetOwnerDeviceCookie: true,
    });
  });

  it('fails closed in production when Access verification is not configured', () => {
    expect(
      getAdminAccessDecision({
        isAccessConfigured: false,
        isAccessJwtValid: false,
        isAdminCookieSet: true,
        isAdminSessionValid: false,
        isDev: false,
        userEmail: 'owner@example.com',
      }),
    ).toMatchObject({
      isAuthorized: false,
      shouldClearAdminCookie: true,
    });
  });

  it('authorizes production requests when a signed admin session is valid', () => {
    expect(
      getAdminAccessDecision({
        isAccessConfigured: false,
        isAccessJwtValid: false,
        isAdminCookieSet: false,
        isAdminSessionValid: true,
        isDev: false,
        userEmail: null,
      }),
    ).toMatchObject({
      isAuthorized: true,
      shouldSetAdminCookie: false,
      shouldSetOwnerDeviceCookie: false,
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
          policyAudiences: ['test-aud'],
          teamDomain: 'https://team.cloudflareaccess.com',
        },
        fetcher: (async () => {
          throw new Error('network failure');
        }) as typeof fetch,
        token,
      }),
    ).resolves.toBeNull();
  });

  it('returns verified claims when any configured audience matches', async () => {
    const { publicJwk, token } = await signAccessJwt({
      aud: ['aud-two'],
      email: 'owner@example.com',
    });

    await expect(
      verifyCloudflareAccessJwt({
        config: {
          policyAudiences: ['aud-one', 'aud-two'],
          teamDomain: 'https://team.cloudflareaccess.com',
        },
        fetcher: (async () =>
          new Response(JSON.stringify({ keys: [publicJwk] }), {
            status: 200,
          })) as typeof fetch,
        token,
      }),
    ).resolves.toMatchObject({
      email: 'owner@example.com',
    });
  });
});

describe('isAdminWriteEnabled', () => {
  it('keeps development deploys read-only even if writes are explicitly enabled', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(
      isAdminWriteEnabled({
        APP_ENV: 'development',
        ALLOW_ADMIN_WRITES: 'true',
      }),
    ).toBe(false);
  });

  it('allows local development writes when explicitly enabled for development', () => {
    vi.stubEnv('NODE_ENV', 'development');

    expect(
      isAdminWriteEnabled({
        APP_ENV: 'development',
        ALLOW_ADMIN_WRITES: 'true',
      }),
    ).toBe(true);
  });

  it('allows local writes by default when APP_ENV is local', () => {
    expect(
      isAdminWriteEnabled({
        APP_ENV: 'local',
      }),
    ).toBe(true);
  });
});
