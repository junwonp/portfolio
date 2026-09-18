import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  analyticsTracker: vi.fn(() => null),
  webVitalsTracker: vi.fn(() => null),
  deferredFooter: vi.fn(() => null),
  deferredBottomNav: vi.fn((_props: { isProject: boolean }) => null),
}));
vi.mock('next/navigation', () => ({
  usePathname: mocks.usePathname,
  useRouter: mocks.useRouter,
}));
vi.mock('@/components/analytics/AnalyticsTracker', () => ({ default: mocks.analyticsTracker }));
vi.mock('@/components/analytics/WebVitalsTracker', () => ({ default: mocks.webVitalsTracker }));
vi.mock('@/components/portfolio/layout/DeferredFooter', () => ({ default: mocks.deferredFooter }));
vi.mock('@/components/portfolio/navigation/DeferredBottomNav', () => ({
  default: mocks.deferredBottomNav,
}));

import { useLocale } from '@/lib/contexts/LocaleContext';
import type { Language } from '@/lib/utils/language';

import { PortfolioClientShell } from './PortfolioClientShell';

const LocaleProbe = () => {
  const { locale } = useLocale();

  return <span>{`active locale: ${locale}`}</span>;
};

const renderShell = (locale: Language = 'ko') =>
  renderToStaticMarkup(
    <PortfolioClientShell locale={locale}>
      <p>page content</p>
    </PortfolioClientShell>,
  );

function extractMainClassName(html: string): string {
  const match = html.match(/<main[^>]*class="([^"]*)"/);
  const className = match?.[1];
  if (className === undefined) {
    throw new Error('main content className is missing');
  }
  return className;
}

beforeEach(() => {
  mocks.usePathname.mockReturnValue('/ko');
});

describe('PortfolioClientShell', () => {
  it('provides the initial locale to the page content', () => {
    const html = renderToStaticMarkup(
      <PortfolioClientShell locale="en">
        <LocaleProbe />
      </PortfolioClientShell>,
    );

    expect(html).toContain('active locale: en');
  });

  it('renders the skip link, main content region, and footer wrapper around the children', () => {
    const html = renderShell('ko');

    expect(html).toContain('<a href="#main-content" class="skip-link">본문으로 건너뛰기</a>');
    expect(html).toContain('id="main-content"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain('<p>page content</p>');
    expect(html).toContain('class="wrapper"');
    expect(html).toContain('class="content-wrapper"');
    expect(html).toContain('class="footer-wrapper"');
  });

  it('uses the English skip link copy for the English locale', () => {
    const html = renderShell('en');

    expect(html).toContain('Skip to main content');
  });

  it('leaves non-project pages in the plain content class and marks the bottom nav as non-project', () => {
    mocks.usePathname.mockReturnValue('/ko/about');

    const html = renderShell('ko');

    expect(html).toContain('<main id="main-content" class="content" tabindex="-1">');
    expect(html).not.toContain('is-project');
    expect(mocks.deferredBottomNav.mock.calls[0]?.[0]).toEqual({ isProject: false });
  });

  it('adds the project content class and the project bottom nav for a locale-prefixed project path', () => {
    mocks.usePathname.mockReturnValue('/ko/projects/aira');

    const html = renderShell('ko');

    expect(html).toContain('class="content is-project"');
    expect(mocks.deferredBottomNav.mock.calls[0]?.[0]).toEqual({ isProject: true });
  });

  it('still detects a project path under the English locale prefix', () => {
    mocks.usePathname.mockReturnValue('/en/projects/aira');

    const html = renderShell('en');

    expect(html).toContain('class="content is-project"');
    expect(mocks.deferredBottomNav.mock.calls[0]?.[0]).toEqual({ isProject: true });
  });

  it('mounts the analytics trackers and the deferred footer inside the provider', () => {
    renderShell('ko');

    expect(mocks.analyticsTracker).toHaveBeenCalledTimes(1);
    expect(mocks.webVitalsTracker).toHaveBeenCalledTimes(1);
    expect(mocks.deferredFooter).toHaveBeenCalledTimes(1);
  });

  it('composes the main content className without trailing or duplicated whitespace', () => {
    mocks.usePathname.mockReturnValue('/ko/about');
    const nonProjectClassName = extractMainClassName(renderShell('ko'));

    expect(nonProjectClassName).toBe('content');
    expect(nonProjectClassName).not.toMatch(/\s{2,}|^\s|\s$/);

    mocks.usePathname.mockReturnValue('/ko/projects/aira');
    const projectClassName = extractMainClassName(renderShell('ko'));

    expect(projectClassName).toBe('content is-project');
    expect(projectClassName).not.toMatch(/\s{2,}|^\s|\s$/);
  });
});
