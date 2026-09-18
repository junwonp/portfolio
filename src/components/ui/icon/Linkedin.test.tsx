import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import Linkedin from '@/components/ui/icon/Linkedin';

describe('Linkedin icon', () => {
  it('renders a decorative 24px svg that inherits the text color', () => {
    const html = renderToStaticMarkup(<Linkedin />);

    expect(html).toContain('width="24"');
    expect(html).toContain('height="24"');
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain('fill="currentColor"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).toContain('<path');
  });

  it('honours a caller size and attributes', () => {
    const html = renderToStaticMarkup(<Linkedin className="brand-icon" width={20} />);

    expect(html).toContain('width="20"');
    expect(html).toContain('height="24"');
    expect(html).toContain('class="brand-icon"');
  });
});
