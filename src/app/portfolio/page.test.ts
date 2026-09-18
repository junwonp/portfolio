import { isValidElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  buildDocument: vi.fn(),
  portfolioDocument: vi.fn(() => null),
}));
vi.mock('@/components/portfolio-document/PortfolioDocument', () => ({
  default: mocks.portfolioDocument,
}));
vi.mock('@/lib/portfolio/documentProjection', () => ({
  buildPortfolioDocument: mocks.buildDocument,
}));

import { DEFAULT_LANGUAGE } from '@/lib/utils/language';

import PortfolioPage, { metadata } from './page';

const documentSentinel = { name: 'sentinel document' };

const renderPortfolioPage = async (searchParams: Record<string, string | string[] | undefined>) => {
  const element = await PortfolioPage({ searchParams: Promise.resolve(searchParams) });

  if (!isValidElement<{ document: unknown }>(element)) {
    throw new Error('expected the portfolio route to render the PortfolioDocument component');
  }

  return element;
};

beforeEach(() => {
  mocks.buildDocument.mockReturnValue(documentSentinel);
});

describe('portfolio document metadata', () => {
  it('titles the printable portfolio and keeps it out of search indexes', () => {
    expect(metadata.title).toBe('박준원 포트폴리오');
    expect(metadata.description).toBe(
      '박준원의 프로젝트 경력과 성과를 정리한 인쇄용 포트폴리오 문서입니다.',
    );
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe('PortfolioPage', () => {
  it('builds the English document when the lang query selects English', async () => {
    const element = await renderPortfolioPage({ lang: 'en' });

    expect(element.type).toBe(mocks.portfolioDocument);
    expect(mocks.buildDocument).toHaveBeenCalledWith('en');
    expect(element.props.document).toBe(documentSentinel);
  });

  it('builds the Korean document when the lang query selects Korean', async () => {
    await renderPortfolioPage({ lang: 'ko' });

    expect(mocks.buildDocument).toHaveBeenCalledWith('ko');
  });

  it('falls back to the default language when the lang query is unsupported', async () => {
    await renderPortfolioPage({ lang: 'fr' });

    expect(mocks.buildDocument).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
    expect(DEFAULT_LANGUAGE).toBe('ko');
  });

  it('falls back to the default language when the lang query is absent', async () => {
    await renderPortfolioPage({});

    expect(mocks.buildDocument).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
  });

  it('falls back to the default language when the lang query arrives as an array', async () => {
    await renderPortfolioPage({ lang: ['en', 'ko'] });

    expect(mocks.buildDocument).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
  });
});
