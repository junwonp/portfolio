import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// Footer reads the app-router context through the locale provider, and Vitest renders without a router, so stub the hook it needs.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import Footer from '@/components/portfolio/layout/Footer';
import * as styles from '@/components/portfolio/layout/Footer.css';
import { LocaleProvider } from '@/lib/contexts/LocaleContext';
import { labelsMap } from '@/lib/portfolio/labels';

describe('Footer', () => {
  it('links the Korean locale to the unlocalized privacy page with the Korean label', () => {
    const html = renderToStaticMarkup(
      <LocaleProvider initialLocale="ko">
        <Footer />
      </LocaleProvider>,
    );

    expect(html).toContain(styles.wrapper);
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('개인정보 처리방침');
  });

  it('links the English locale to the /en privacy page with the English label', () => {
    const html = renderToStaticMarkup(
      <LocaleProvider initialLocale="en">
        <Footer />
      </LocaleProvider>,
    );

    expect(html).toContain('href="/en/privacy"');
    expect(html).toContain(labelsMap.en.privacyPolicy);
    expect(html).not.toContain(labelsMap.ko.privacyPolicy);
  });
});
