import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { LocaleProvider } from '@/lib/contexts/LocaleContext';

import MobileStickyHeader from './MobileStickyHeader';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

describe('MobileStickyHeader', () => {
  it('renders the sticky quick-navigation header with the provided external links', () => {
    const html = renderToStaticMarkup(
      <LocaleProvider initialLocale="ko">
        <MobileStickyHeader
          name="Junwon"
          githubLink="https://github.com/junwonp"
          linkedinLink="https://www.linkedin.com/in/junwonp"
        />
      </LocaleProvider>,
    );

    expect(html).toContain('aria-label="Quick navigation header"');
    expect(html).toContain('https://github.com/junwonp');
    expect(html).toContain('https://www.linkedin.com/in/junwonp');
  });

  it('omits every external link when none are given', () => {
    const html = renderToStaticMarkup(
      <LocaleProvider initialLocale="ko">
        <MobileStickyHeader name="Junwon" />
      </LocaleProvider>,
    );

    expect(html).toContain('aria-label="Quick navigation header"');
    expect(html).not.toContain('<a ');
  });
});
