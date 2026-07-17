import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PortfolioContentLayout from '@/components/portfolio/layout/PortfolioContentLayout';

describe('PortfolioContentLayout', () => {
  it('renders shared header, side navigation, mobile header, and centered content slots', () => {
    const html = renderToStaticMarkup(
      <PortfolioContentLayout
        desktopHeader={<button type="button">Desktop action</button>}
        mobileHeader={<div>Mobile action</div>}
        sideNav={<nav>Sections</nav>}
      >
        <section>Primary content</section>
      </PortfolioContentLayout>,
    );

    expect(html).toContain('data-portfolio-layout="true"');
    expect(html).toContain('data-layout-slot="desktop-header"');
    expect(html).toContain('Desktop action');
    expect(html).toContain('data-layout-slot="mobile-header"');
    expect(html).toContain('Mobile action');
    expect(html).toContain('data-layout-slot="side-nav"');
    expect(html).toContain('Sections');
    expect(html).toContain('data-layout-slot="main-content"');
    expect(html).toContain('Primary content');
  });
});
