import { isValidElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  homePage: vi.fn(() => null),
}));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('@/components/portfolio/home/HomePage', () => ({ default: mocks.homePage }));

import type { HomePageData } from '@/lib/portfolio/homeTypes';
import { getLabels } from '@/lib/portfolio/labels';
import { metadataMap } from '@/lib/utils/metadata';

import Home, { generateMetadata } from './page';

const params = (locale: string) => ({
  params: Promise.resolve({ locale }),
  searchParams: Promise.resolve({}),
});

const renderHome = async (
  locale: string,
  searchParams: Record<string, string | string[] | undefined> = {},
) => {
  const element = await Home({
    params: Promise.resolve({ locale }),
    searchParams: Promise.resolve(searchParams),
  });

  if (!isValidElement<{ data: HomePageData }>(element)) {
    throw new Error('expected the home route to render the HomePage component');
  }

  return element;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('home route metadata', () => {
  it('returns the Korean home metadata for the default locale', async () => {
    const metadata = await generateMetadata(params('ko'));

    expect(metadata.title).toBe(metadataMap.ko.title);
    expect(metadata.authors).toEqual([{ name: metadataMap.ko.authorName }]);
  });

  it('returns the English home metadata for the English locale', async () => {
    const metadata = await generateMetadata(params('en'));

    expect(metadata.title).toBe(metadataMap.en.title);
    expect(metadata.authors).toEqual([{ name: metadataMap.en.authorName }]);
    expect(mocks.notFound).not.toHaveBeenCalled();
  });

  it('returns not found from generateMetadata for an unsupported locale', async () => {
    await expect(generateMetadata(params('fr'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalledTimes(1);
  });
});

describe('Home', () => {
  it('renders the home page with the default selected projects when no query is given', async () => {
    const element = await renderHome('ko');

    expect(element.type).toBe(mocks.homePage);
    expect(element.props.data.locale).toBe('ko');
    expect(element.props.data.featuredProjectsMode).toBe('selected');
    expect(element.props.data.featuredWebProjects.map((item) => item.project[0].id)).toEqual([
      'aira',
      'today_weather',
      'nextjs_portfolio',
      'kftc_platform',
    ]);
    expect(element.props.data.navSections).toContainEqual({
      id: 'section-featured',
      label: getLabels('ko').sectionSelectedProjects,
    });
  });

  it('localizes the home page data for the English locale', async () => {
    const element = await renderHome('en');

    expect(element.props.data.locale).toBe('en');
    expect(element.props.data.labels).toEqual(getLabels('en'));
    expect(element.props.data.navSections).toContainEqual({
      id: 'section-featured',
      label: getLabels('en').sectionSelectedProjects,
    });
  });

  it('resolves a role query into the role-fit featured project mode', async () => {
    const element = await renderHome('ko', { role: 'ai' });

    expect(element.props.data.featuredProjectsMode).toBe('role-fit');
    expect(element.props.data.featuredWebProjects.map((item) => item.project[0].id)).toEqual([
      'aira',
      'nextjs_portfolio',
      'agentic_workflow',
      'today_weather',
    ]);
    expect(element.props.data.navSections).toContainEqual({
      id: 'section-featured',
      label: getLabels('ko').sectionFeaturedProjects,
    });
  });

  it('returns not found without rendering the home page for an unsupported locale', async () => {
    await expect(renderHome('fr')).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.homePage).not.toHaveBeenCalled();
  });
});
