import { isValidElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  db: vi.fn(),
  getActiveApplicationLinkBySlug: vi.fn(),
  printableResumeElement: vi.fn(() => null),
}));
vi.mock('@/lib/server/infrastructure/database', () => ({ getDb: mocks.db }));
vi.mock('@/lib/server/application-links/store', () => ({
  getActiveApplicationLinkBySlug: mocks.getActiveApplicationLinkBySlug,
}));
vi.mock('@/components/resume/PrintableResume', () => ({
  default: mocks.printableResumeElement,
}));

import { PORTFOLIO_URL } from '@/config/site';
import { getPrintableResume, printableResume } from '@/content/printableResume';
import type { ApplicationLink } from '@/lib/server/application-links/model';
import { getApplicationLinkUrl } from '@/lib/server/application-links/url';

import ResumePage, { metadata } from './page';

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

const db = { prepare: vi.fn() };

const renderResumePage = async (searchParams: Record<string, string | string[] | undefined>) => {
  const element = await ResumePage({ searchParams: Promise.resolve(searchParams) });

  if (!isValidElement<{ resume: unknown }>(element)) {
    throw new Error('expected the resume route to render the PrintableResume component');
  }

  return element;
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.db.mockResolvedValue(db);
  mocks.getActiveApplicationLinkBySlug.mockResolvedValue(activeLink());
});

describe('resume route metadata', () => {
  it('publishes the resume at its custom domain with a preview image', () => {
    expect(metadata.title).toBe('박준원 이력서');
    expect(metadata.description).toBe('프론트엔드 개발자 박준원의 인쇄용 이력서입니다.');
    expect(metadata.alternates?.canonical).toBe('https://resume.junwon.dev');
    expect(metadata.openGraph).toMatchObject({
      type: 'profile',
      url: 'https://resume.junwon.dev',
    });
    expect(metadata.openGraph?.images).toEqual(['/opengraph-image.png']);
  });
});

describe('ResumePage application link variants', () => {
  it('renders the default resume when no slug or variant is given', async () => {
    const element = await renderResumePage({});

    expect(element.type).toBe(mocks.printableResumeElement);
    expect(element.props.resume).toBe(printableResume);
    expect(mocks.db).not.toHaveBeenCalled();
  });

  it('renders the resume variant matching the link positioning and embeds the short link URL', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(
      activeLink({ role: 'ai', summaryPreset: 'default' }),
    );

    const element = await renderResumePage({ slug: 'abcd' });
    const shortUrl = `${PORTFOLIO_URL}/r/abcd`;

    expect(shortUrl).toBe(getApplicationLinkUrl('abcd'));
    expect(mocks.getActiveApplicationLinkBySlug).toHaveBeenCalledWith(db, 'abcd');
    expect(element.props.resume).toEqual(getPrintableResume('web-rn', shortUrl));
  });

  it('selects the ops-data variant from the link summary preset', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(
      activeLink({ role: 'web', summaryPreset: 'ops-data' }),
    );

    const element = await renderResumePage({ slug: 'abcd' });

    expect(element.props.resume).toEqual(
      getPrintableResume('ops-data', getApplicationLinkUrl('abcd')),
    );
  });

  it('falls back to the web variant for an unpositioned link', async () => {
    const element = await renderResumePage({ slug: 'abcd' });

    expect(element.props.resume).toEqual(getPrintableResume('web', getApplicationLinkUrl('abcd')));
  });

  it('renders the default resume when the database binding is unavailable', async () => {
    mocks.db.mockResolvedValue(undefined);

    const element = await renderResumePage({ slug: 'abcd' });

    expect(mocks.getActiveApplicationLinkBySlug).not.toHaveBeenCalled();
    expect(element.props.resume).toBe(printableResume);
  });

  it('renders the default resume when the slug has no active link', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(null);

    const element = await renderResumePage({ slug: 'abcd' });

    expect(element.props.resume).toBe(printableResume);
  });

  it('ignores a slug that does not arrive as a single string and still honors a direct variant', async () => {
    const element = await renderResumePage({ slug: ['abcd'], variant: 'web-rn' });

    expect(mocks.db).not.toHaveBeenCalled();
    expect(element.props.resume).toEqual(getPrintableResume('web-rn'));
  });
});

describe('ResumePage direct variant preview', () => {
  it('renders the requested web variant without a slug', async () => {
    const element = await renderResumePage({ variant: 'web-rn' });

    expect(mocks.db).not.toHaveBeenCalled();
    expect(element.props.resume).toEqual(getPrintableResume('web-rn'));
  });

  it('renders the requested ops-data variant through the type alias', async () => {
    const element = await renderResumePage({ type: 'ops-data' });

    expect(element.props.resume).toEqual(getPrintableResume('ops-data'));
  });

  it('prefers the variant parameter over the type parameter', async () => {
    const element = await renderResumePage({ type: 'ops-data', variant: 'web' });

    expect(element.props.resume).toEqual(getPrintableResume('web'));
  });

  it('falls back to the default resume for an unknown variant', async () => {
    const element = await renderResumePage({ variant: 'bogus' });

    expect(element.props.resume).toBe(printableResume);
  });

  it('falls back to the default resume when the variant and type parameters are not strings', async () => {
    const element = await renderResumePage({ type: ['web'], variant: ['web-rn'] });

    expect(element.props.resume).toBe(printableResume);
  });
});
