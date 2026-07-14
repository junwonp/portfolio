import { describe, expect, it } from 'vitest';

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionCookie,
  getSafeAdminSessionReturnTo,
  verifyAdminSessionCookie,
} from '@/lib/server/adminSession';

const secret = 'test-session-secret-that-is-long-enough';
const issuedAt = new Date('2026-06-28T01:00:00.000Z');

describe('admin session cookies', () => {
  it('creates and verifies a signed admin session cookie', async () => {
    const cookie = await createAdminSessionCookie({
      email: 'owner@example.com',
      now: issuedAt,
      secret,
    });

    await expect(
      verifyAdminSessionCookie({
        cookie,
        now: new Date('2026-06-28T02:00:00.000Z'),
        secret,
      }),
    ).resolves.toEqual({
      email: 'owner@example.com',
    });
  });

  it('rejects tampered admin session cookies', async () => {
    const cookie = await createAdminSessionCookie({
      email: 'owner@example.com',
      now: issuedAt,
      secret,
    });
    const [version, payload, signature] = cookie.split('.');
    const tamperedPayload = `${payload?.slice(0, -1)}${payload?.endsWith('A') ? 'B' : 'A'}`;
    const tamperedCookie = `${version}.${tamperedPayload}.${signature}`;

    await expect(
      verifyAdminSessionCookie({
        cookie: tamperedCookie,
        now: new Date('2026-06-28T02:00:00.000Z'),
        secret,
      }),
    ).resolves.toBeNull();
  });

  it('rejects expired admin session cookies', async () => {
    const cookie = await createAdminSessionCookie({
      email: 'owner@example.com',
      now: issuedAt,
      secret,
    });

    await expect(
      verifyAdminSessionCookie({
        cookie,
        now: new Date('2026-06-28T10:00:01.000Z'),
        secret,
      }),
    ).resolves.toBeNull();
  });

  it('rejects admin session verification when the secret is missing', async () => {
    const cookie = await createAdminSessionCookie({
      email: 'owner@example.com',
      now: issuedAt,
      secret,
    });

    await expect(
      verifyAdminSessionCookie({
        cookie,
        now: new Date('2026-06-28T02:00:00.000Z'),
        secret: null,
      }),
    ).resolves.toBeNull();
  });
});

describe('getSafeAdminSessionReturnTo', () => {
  it('allows only admin and home return paths', () => {
    expect(getSafeAdminSessionReturnTo('/')).toBe('/');
    expect(getSafeAdminSessionReturnTo('/a')).toBe('/a');
    expect(getSafeAdminSessionReturnTo('/a?tab=links')).toBe('/a?tab=links');
  });

  it('falls back to the admin page for unsafe return targets', () => {
    expect(getSafeAdminSessionReturnTo(null)).toBe('/a');
    expect(getSafeAdminSessionReturnTo('https://example.com/a')).toBe('/a');
    expect(getSafeAdminSessionReturnTo('/projects/day-planner')).toBe('/a');
    expect(getSafeAdminSessionReturnTo('/api/admin/unknown')).toBe('/a');
  });

  it('exports the cookie name used by route handlers', () => {
    expect(ADMIN_SESSION_COOKIE).toBe('admin_session');
  });
});
