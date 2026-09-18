// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const homeTabBar = vi.hoisted(() => vi.fn());
const projectNav = vi.hoisted(() => vi.fn());
vi.mock('./HomeTabBar', () => ({
  default: (props: Record<string, unknown>) => {
    homeTabBar(props);
    return null;
  },
}));
vi.mock('./ProjectNav', () => ({
  default: (props: Record<string, unknown>) => {
    projectNav(props);
    return null;
  },
}));

const articleSections = vi.hoisted(() => ({
  value: [] as Array<{ id: string; label: string }>,
}));
vi.mock('@/lib/hooks/useArticleSections', () => ({
  useArticleSections: () => articleSections.value,
}));

const navLinks = vi.hoisted(() => ({
  value: null as { githubLink?: string; productLink?: string } | null,
}));
vi.mock('@/lib/stores/bottomNav', () => ({
  useProjectNavLinks: () => navLinks.value,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { LocaleProvider } from '@/lib/contexts/LocaleContext';
import { getLabels } from '@/lib/portfolio/labels';

import BottomNav from './BottomNav';

interface HomeTabBarProps {
  ariaLabel: string;
  tabs: Array<{ id: string; label: string }>;
}

interface ProjectNavProps {
  tabs: Array<{ id: string; label: string }>;
  githubLink?: string;
  productLink?: string;
}

function homeTabBarProps(): HomeTabBarProps {
  const call = homeTabBar.mock.calls.at(-1);
  if (!call) {
    throw new Error('HomeTabBar was never rendered');
  }
  return call[0] as HomeTabBarProps;
}

function projectNavProps(): ProjectNavProps {
  const call = projectNav.mock.calls.at(-1);
  if (!call) {
    throw new Error('ProjectNav was never rendered');
  }
  return call[0] as ProjectNavProps;
}

beforeEach(() => {
  articleSections.value = [];
  navLinks.value = null;
});

afterEach(() => {
  cleanup();
});

describe('BottomNav home tabs', () => {
  it('builds the home tabs from the active locale labels', () => {
    render(
      <LocaleProvider initialLocale="ko">
        <BottomNav />
      </LocaleProvider>,
    );

    const labels = getLabels('ko');
    expect(projectNav).not.toHaveBeenCalled();
    expect(homeTabBarProps().ariaLabel).toBe(labels.navAriaLabel);
    expect(homeTabBarProps().tabs).toEqual([
      { id: 'section-intro', label: labels.tabIntro },
      { id: 'section-work', label: labels.tabWork },
      { id: 'section-skills', label: labels.tabSkills },
      { id: 'section-projects', label: labels.tabProjects },
      { id: 'section-education', label: labels.tabEducation },
    ]);
  });

  it('localises the tab labels when the locale is English', () => {
    render(
      <LocaleProvider initialLocale="en">
        <BottomNav />
      </LocaleProvider>,
    );

    const labels = getLabels('en');
    expect(homeTabBarProps().tabs.map((tab) => tab.label)).toEqual([
      labels.tabIntro,
      labels.tabWork,
      labels.tabSkills,
      labels.tabProjects,
      labels.tabEducation,
    ]);
  });
});

describe('BottomNav project tabs', () => {
  it('forwards the article sections and stored links to the project navigation', () => {
    articleSections.value = [{ id: 'overview', label: 'Overview' }];
    navLinks.value = { githubLink: 'junwonp', productLink: 'https://example.com/product' };

    render(
      <LocaleProvider initialLocale="ko">
        <BottomNav isProject />
      </LocaleProvider>,
    );

    expect(homeTabBar).not.toHaveBeenCalled();
    expect(projectNavProps()).toEqual({
      tabs: [{ id: 'overview', label: 'Overview' }],
      githubLink: 'junwonp',
      productLink: 'https://example.com/product',
    });
  });

  it('passes undefined links when the store holds no project links', () => {
    articleSections.value = [{ id: 'overview', label: 'Overview' }];
    navLinks.value = null;

    render(
      <LocaleProvider initialLocale="ko">
        <BottomNav isProject />
      </LocaleProvider>,
    );

    expect(projectNavProps()).toEqual({
      tabs: [{ id: 'overview', label: 'Overview' }],
      githubLink: undefined,
      productLink: undefined,
    });
  });

  it('leaves the project tabs empty when the article has no sections', () => {
    articleSections.value = [];

    render(
      <LocaleProvider initialLocale="ko">
        <BottomNav isProject />
      </LocaleProvider>,
    );

    expect(projectNavProps().tabs).toEqual([]);
  });
});
