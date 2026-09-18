import { isValidElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  db: vi.fn(),
  getActiveApplicationLinkBySlug: vi.fn(),
  printablePortfolio: vi.fn(() => null),
  // Fixture catalog: one entry per skills fallback path, plus ids absent so the "unknown project" skip branch is exercised.
  catalog: [
    {
      content: { ko: { description: 'AI 챗봇 앱', title: 'Aira' } },
      featuredSkills: ['React Native'],
      id: 'aira',
    },
    {
      content: { ko: { description: '날씨 앱', title: '오늘의 날씨' } },
      id: 'today_weather',
      skills: ['TypeScript'],
    },
    {
      content: { ko: { description: '포트폴리오 사이트', title: 'Next.js 포트폴리오' } },
      id: 'nextjs_portfolio',
    },
  ],
}));
vi.mock('@/lib/server/infrastructure/database', () => ({ getDb: mocks.db }));
vi.mock('@/lib/server/application-links/store', () => ({
  getActiveApplicationLinkBySlug: mocks.getActiveApplicationLinkBySlug,
}));
vi.mock('@/components/print/PrintablePortfolio', () => ({ default: mocks.printablePortfolio }));
vi.mock('@/lib/portfolio/catalog', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/portfolio/catalog')>();

  return { ...actual, applicationProjectCatalog: mocks.catalog };
});

import { PORTFOLIO_URL } from '@/config/site';
import { rolePresets } from '@/lib/portfolio/resume';
import type { ApplicationLink } from '@/lib/server/application-links/model';
import { getApplicationLinkUrl } from '@/lib/server/application-links/url';

import PrintPage, { metadata } from './page';

interface PrintProject {
  description: string;
  skills: string[];
  title: string;
}

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

const defaultProjects: PrintProject[] = [
  { description: 'AI 챗봇 앱', skills: ['React Native'], title: 'Aira' },
  { description: '날씨 앱', skills: ['TypeScript'], title: '오늘의 날씨' },
  { description: '포트폴리오 사이트', skills: [], title: 'Next.js 포트폴리오' },
];

const renderPrintPage = async (searchParams: Record<string, string | string[] | undefined>) => {
  const element = await PrintPage({ searchParams: Promise.resolve(searchParams) });

  if (
    !isValidElement<{
      companyName?: string;
      portfolioUrl: string;
      projects: PrintProject[];
      role?: string;
    }>(element)
  ) {
    throw new Error('expected the print route to render the PrintablePortfolio component');
  }

  return element;
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.db.mockResolvedValue(db);
  mocks.getActiveApplicationLinkBySlug.mockResolvedValue(activeLink());
});

describe('print route metadata', () => {
  it('titles the printable portfolio and keeps it out of search indexes', () => {
    expect(metadata.title).toBe('박준원 포트폴리오');
    expect(metadata.description).toBe('박준원 포트폴리오 PDF 안내 문서입니다.');
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe('PrintPage project selection', () => {
  it('maps the default selected projects and skips ids missing from the catalog', async () => {
    const element = await renderPrintPage({});

    expect(element.type).toBe(mocks.printablePortfolio);
    expect(element.props.projects).toEqual(defaultProjects);
    expect(element.props.companyName).toBeUndefined();
    expect(element.props.role).toBeUndefined();
    expect(mocks.db).not.toHaveBeenCalled();
    expect(mocks.getActiveApplicationLinkBySlug).not.toHaveBeenCalled();
  });

  it('uses the plain portfolio URL when no slug is requested', async () => {
    const element = await renderPrintPage({});

    expect(element.props.portfolioUrl).toBe(PORTFOLIO_URL);
  });

  it('ignores a slug that does not arrive as a single string', async () => {
    const element = await renderPrintPage({ slug: ['abcd', 'efgh'] });

    expect(mocks.db).not.toHaveBeenCalled();
    expect(element.props.portfolioUrl).toBe(PORTFOLIO_URL);
    expect(element.props.projects).toEqual(defaultProjects);
  });
});

describe('PrintPage application link resolution', () => {
  it('falls back to the default projects when the database binding is unavailable', async () => {
    mocks.db.mockResolvedValue(undefined);

    const element = await renderPrintPage({ slug: 'abcd' });

    expect(mocks.getActiveApplicationLinkBySlug).not.toHaveBeenCalled();
    expect(element.props.projects).toEqual(defaultProjects);
    expect(element.props.portfolioUrl).toBe(getApplicationLinkUrl('abcd'));
  });

  it('falls back to the default projects when the slug has no active link', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(null);

    const element = await renderPrintPage({ slug: 'abcd' });

    expect(mocks.getActiveApplicationLinkBySlug).toHaveBeenCalledWith(db, 'abcd');
    expect(element.props.projects).toEqual(defaultProjects);
    expect(element.props.companyName).toBeUndefined();
    expect(element.props.portfolioUrl).toBe(`${PORTFOLIO_URL}/r/abcd`);
  });

  it('uses the link project ids and passes through its company and role', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(
      activeLink({ companyName: 'Orca AI', projectIds: ['today_weather'], role: 'ai' }),
    );

    const element = await renderPrintPage({ slug: 'abcd' });

    expect(element.props.projects).toEqual([
      { description: '날씨 앱', skills: ['TypeScript'], title: '오늘의 날씨' },
    ]);
    expect(element.props.companyName).toBe('Orca AI');
    expect(element.props.role).toBe('ai');
  });

  it('converts a null link role into an undefined role', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(
      activeLink({ companyName: 'Orca AI', projectIds: ['aira'], role: null }),
    );

    const element = await renderPrintPage({ slug: 'abcd' });

    expect(element.props.role).toBeUndefined();
  });

  it('falls back to the role preset projects when the link selects no projects directly', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(
      activeLink({ projectIds: [], role: 'ai' }),
    );

    const element = await renderPrintPage({ slug: 'abcd' });

    expect(rolePresets.ai.projectIds).toContain('agentic_workflow');
    expect(element.props.projects.map((project) => project.title)).toEqual([
      'Aira',
      'Next.js 포트폴리오',
      '오늘의 날씨',
    ]);
    expect(element.props.role).toBe('ai');
  });

  it('falls back to the default projects when the link has neither projects nor a known role', async () => {
    // D1 rows are untrusted: a role outside the typed union must not crash the page.
    const unknownRole = 'designer' as unknown as ApplicationLink['role'];
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(
      activeLink({ projectIds: [], role: unknownRole }),
    );

    const element = await renderPrintPage({ slug: 'abcd' });

    expect(element.props.projects).toEqual(defaultProjects);
    expect(element.props.role).toBe('designer');
  });

  it('falls back to the default projects when the link has no role at all', async () => {
    mocks.getActiveApplicationLinkBySlug.mockResolvedValue(
      activeLink({ projectIds: [], role: null }),
    );

    const element = await renderPrintPage({ slug: 'abcd' });

    expect(element.props.projects).toEqual(defaultProjects);
  });
});
