import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import Github from '@/components/ui/icon/Github';

describe('Github icon', () => {
  it('renders a decorative 24px svg that inherits the text color', () => {
    const html = renderToStaticMarkup(<Github />);

    expect(html).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(html).toContain('width="24"');
    expect(html).toContain('height="24"');
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain('fill="currentColor"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).toContain('<path');
  });

  it('honours a caller width and height', () => {
    const html = renderToStaticMarkup(<Github height={32} width={32} />);

    expect(html).toContain('width="32"');
    expect(html).toContain('height="32"');
    expect(html).not.toContain('width="24"');
  });

  it('keeps caller attributes spread over the defaults', () => {
    const html = renderToStaticMarkup(<Github className="brand-icon" data-testid="github" />);

    expect(html).toContain('class="brand-icon"');
    expect(html).toContain('data-testid="github"');
  });
});
