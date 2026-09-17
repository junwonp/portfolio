import { isValidElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  db: vi.fn(),
  getActiveApplicationLinkBySlug: vi.fn(),
  homePage: vi.fn(() => null),
}));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('@/lib/server/infrastructure/database', () => ({ getDb: mocks.db }));
vi.mock('@/lib/server/application-links/store', () => ({
  getActiveApplicationLinkBySlug: mocks.getActiveApplicationLinkBySlug,
}));
vi.mock('@/components/portfolio/home/HomePage', () => ({ default: mocks.homePage }));

import type { HomePageData } from '@/lib/portfolio/homeTypes';
import type { ApplicationLink } from '@/lib/server/application-links/model';

import ShortUrlPage, { generateMetadata } from './page';

const activeLink = (overrides: Partial<ApplicationLink> = {}): ApplicationLink => ({
  companyName: 'Example',
  createdAt: '2026-01-01 00:00:00',
  expiresAt: '2026-12-31 00:00:00',
  id: 1,
  label: 'Example link',
  projectIds: ['aira'],
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

describe('short link page', () => {
  it('returns not found when the locale segment is not a supported language', async () => {
    await expect(ShortUrlPage(params('fr', 'abcd'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalled();
    expect(mocks.db).not.toHaveBeenCalled();
    expect(mocks.getActiveApplicationLinkBySlug).not.toHaveBeenCalled();
    expect(mocks.homePage).not.toHaveBeenCalled();
  });

  it('returns not found when the D1 binding is unavailable', async () => {
    mocks.db.mockResolvedValue(undefined);

    await expect(ShortUrlPage(params('ko', 'abcd'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.getActiveApplicationLinkBySlug).not.toHaveBeenCalled();
    expect(mocks.homePage).not.toHaveBeenCalled();
  });

  it('returns not found when the slug has no active application link', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(null);

    await expect(ShortUrlPage(params('ko', 'abcd'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.getActiveApplicationLinkBySlug).toHaveBeenCalledWith(db, 'abcd');
    expect(mocks.homePage).not.toHaveBeenCalled();
  });

  it('renders the home page with the tailored data of the active application link', async () => {
    const element = await ShortUrlPage(params('ko', 'abcd'));

    if (!isValidElement<{ data: HomePageData }>(element)) {
      throw new Error('expected the short link page to render the home page component');
    }

    expect(element.type).toBe(mocks.homePage);
    expect(element.props.data.locale).toBe('ko');
    expect(element.props.data.featuredProjectsMode).toBe('role-fit');
  });

  it('returns not found from generateMetadata when the locale segment is unsupported', async () => {
    await expect(generateMetadata(params('fr', 'abcd'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalled();
  });

  it('marks short link metadata as non-indexable', async () => {
    const metadata = await generateMetadata(params('en', 'abcd'));

    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
