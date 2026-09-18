import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import Globe from '@/components/ui/icon/Globe';

describe('Globe icon', () => {
  it('renders a decorative stroked 24px svg', () => {
    const html = renderToStaticMarkup(<Globe />);

    expect(html).toContain('width="24"');
    expect(html).toContain('height="24"');
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain('fill="none"');
    expect(html).toContain('stroke="currentColor"');
    expect(html).toContain('stroke-width="2"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
  });

  it('draws the globe from a circle, an equator line and a meridian path', () => {
    const html = renderToStaticMarkup(<Globe />);

    expect(html).toContain('<circle cx="12" cy="12" r="10"');
    expect(html).toContain('<line x1="2" y1="12" x2="22" y2="12"');
    expect(html).toContain('<path');
  });

  it('honours a caller size and attributes', () => {
    const html = renderToStaticMarkup(<Globe className="brand-icon" height={16} width={16} />);

    expect(html).toContain('width="16"');
    expect(html).toContain('height="16"');
    expect(html).toContain('class="brand-icon"');
  });
});
