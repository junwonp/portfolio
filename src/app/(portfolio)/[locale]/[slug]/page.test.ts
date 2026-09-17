import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  permanentRedirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
  db: vi.fn(),
  getActiveApplicationLinkBySlug: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  notFound: mocks.notFound,
  permanentRedirect: mocks.permanentRedirect,
}));
vi.mock('@/lib/server/infrastructure/database', () => ({ getDb: mocks.db }));
vi.mock('@/lib/server/application-links/store', () => ({
  getActiveApplicationLinkBySlug: mocks.getActiveApplicationLinkBySlug,
}));

import type { ApplicationLink } from '@/lib/server/application-links/model';
import {
  APPLICATION_LINK_PATH_PREFIX,
  getApplicationLinkPathname,
} from '@/lib/utils/applicationSlug';
import { getLocalizedPathname } from '@/lib/utils/language';

import LegacyShortUrlPage from './page';

const activeLink = (overrides: Partial<ApplicationLink> = {}): ApplicationLink => ({
  companyName: 'Example',
  createdAt: '2026-01-01 00:00:00',
  expiresAt: '2026-12-31 00:00:00',
  id: 1,
  label: 'Example link',
  projectIds: [],
  role: null,
  slug: 'abcd',
  summaryPreset: 'default',
  ...overrides,
});

const params = (locale: string, slug: string) => ({
  params: Promise.resolve({ locale, slug }),
});

const db = { prepare: vi.fn() };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.db.mockResolvedValue(db);
  mocks.getActiveApplicationLinkBySlug.mockResolvedValue(activeLink());
});

describe('legacy short link page', () => {
  it('redirects an active legacy short link to its /r/ path in the default locale', async () => {
    const target = getLocalizedPathname(getApplicationLinkPathname('abcd'), 'ko');

    await expect(LegacyShortUrlPage(params('ko', 'abcd'))).rejects.toThrow(
      `NEXT_REDIRECT:${target}`,
    );

    expect(target).toBe('/r/abcd');
    expect(target.startsWith(`/${APPLICATION_LINK_PATH_PREFIX}/`)).toBe(true);
    expect(mocks.permanentRedirect).toHaveBeenCalledWith(target);
    expect(mocks.getActiveApplicationLinkBySlug).toHaveBeenCalledWith(db, 'abcd');
  });

  it('preserves the English locale when redirecting to the short-link namespace', async () => {
    const target = getLocalizedPathname(getApplicationLinkPathname('abcd'), 'en');

    await expect(LegacyShortUrlPage(params('en', 'abcd'))).rejects.toThrow(
      `NEXT_REDIRECT:${target}`,
    );

    expect(target).toBe('/en/r/abcd');
    expect(mocks.permanentRedirect).toHaveBeenCalledWith(target);
  });

  it('returns not found for a reserved top-level slug', async () => {
    await expect(LegacyShortUrlPage(params('ko', 'privacy'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalled();
    expect(mocks.db).not.toHaveBeenCalled();
    expect(mocks.getActiveApplicationLinkBySlug).not.toHaveBeenCalled();
    expect(mocks.permanentRedirect).not.toHaveBeenCalled();
  });

  it('treats reserved slugs as reserved regardless of case', async () => {
    await expect(LegacyShortUrlPage(params('ko', 'Privacy'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.db).not.toHaveBeenCalled();
    expect(mocks.permanentRedirect).not.toHaveBeenCalled();
  });

  it('returns not found for a locale segment that is not a supported language', async () => {
    await expect(LegacyShortUrlPage(params('fr', 'abcd'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.db).not.toHaveBeenCalled();
    expect(mocks.permanentRedirect).not.toHaveBeenCalled();
  });

  it('returns not found when the D1 binding is unavailable', async () => {
    mocks.db.mockResolvedValue(undefined);

    await expect(LegacyShortUrlPage(params('ko', 'abcd'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.getActiveApplicationLinkBySlug).not.toHaveBeenCalled();
    expect(mocks.permanentRedirect).not.toHaveBeenCalled();
  });

  it('returns not found when no active application link matches the slug', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(null);

    await expect(LegacyShortUrlPage(params('ko', 'abcd'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.permanentRedirect).not.toHaveBeenCalled();
  });
});
