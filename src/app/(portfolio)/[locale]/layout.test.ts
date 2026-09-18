import type { ReactNode } from 'react';
import { isValidElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  clientShell: vi.fn(() => null),
}));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('@/app/(portfolio)/_components/PortfolioClientShell', () => ({
  PortfolioClientShell: mocks.clientShell,
}));

import { PORTFOLIO_URL } from '@/config/site';
import { metadataMap } from '@/lib/utils/metadata';

import PortfolioLayout, { generateMetadata, generateStaticParams } from './layout';

const params = (locale: string) => ({ params: Promise.resolve({ locale }) });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('portfolio locale layout static params', () => {
  it('prerenders exactly the supported locales', () => {
    expect(generateStaticParams()).toEqual([{ locale: 'ko' }, { locale: 'en' }]);
  });
});

describe('portfolio locale layout metadata', () => {
  it('anchors metadataBase and the Korean author on the portfolio URL', async () => {
    const metadata = await generateMetadata(params('ko'));

    expect(String(metadata.metadataBase)).toBe(new URL(PORTFOLIO_URL).href);
    expect(metadata.authors).toEqual([{ name: metadataMap.ko.authorName }]);
  });

  it('uses the English author name for the English locale', async () => {
    const metadata = await generateMetadata(params('en'));

    expect(metadata.authors).toEqual([{ name: metadataMap.en.authorName }]);
    expect(metadataMap.en.authorName).toBe('Junwon Park');
  });

  it('returns empty metadata for an unsupported locale instead of throwing', async () => {
    const metadata = await generateMetadata(params('fr'));

    expect(metadata).toEqual({});
    expect(mocks.notFound).not.toHaveBeenCalled();
  });
});

describe('PortfolioLayout', () => {
  const child = 'page content';

  const renderLayout = async (locale: string) => {
    const element = await PortfolioLayout({ children: child, params: Promise.resolve({ locale }) });

    if (!isValidElement<{ children?: ReactNode; locale?: string }>(element)) {
      throw new Error('expected the locale layout to render the client shell');
    }

    return element;
  };

  it('wraps the page children in the client shell with the resolved locale', async () => {
    const element = await renderLayout('ko');

    expect(element.type).toBe(mocks.clientShell);
    expect(element.props.locale).toBe('ko');
    expect(element.props.children).toBe(child);
    expect(mocks.notFound).not.toHaveBeenCalled();
  });

  it('forwards the English locale to the client shell', async () => {
    const element = await renderLayout('en');

    expect(element.props.locale).toBe('en');
  });

  it('returns not found without rendering the shell when the locale is unsupported', async () => {
    await expect(
      PortfolioLayout({ children: child, params: Promise.resolve({ locale: 'fr' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalledTimes(1);
    expect(mocks.clientShell).not.toHaveBeenCalled();
  });
});
