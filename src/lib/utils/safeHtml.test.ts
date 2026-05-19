import { describe, expect, it } from 'vitest';

import { sanitizeProjectHtml } from '$lib/utils/safeHtml';

describe('sanitizeProjectHtml', () => {
  it('keeps the rich text tags used by project achievements', () => {
    expect(
      sanitizeProjectHtml(
        '<strong>Title</strong><ul><li><code>value</code></li></ul><br/><table><tbody><tr><td>A</td></tr></tbody></table>',
      ),
    ).toBe(
      '<strong>Title</strong><ul><li><code>value</code></li></ul><br><table><tbody><tr><td>A</td></tr></tbody></table>',
    );
  });

  it('removes attributes except safe local image metadata', () => {
    expect(
      sanitizeProjectHtml(
        '<table style="width:100%"><tr><td onclick="alert(1)">A</td></tr></table><img src="/images/chart.webp" alt="Chart" onerror="alert(1)">',
      ),
    ).toBe('<table><tr><td>A</td></tr></table><img src="/images/chart.webp" alt="Chart">');
  });

  it('escapes unsupported tags and drops non-local images', () => {
    expect(
      sanitizeProjectHtml(
        '<script>alert(1)</script><img src="https://example.com/x.png" alt="Remote"><iframe src="/x"></iframe>',
      ),
    ).toBe('&lt;script&gt;alert(1)&lt;/script&gt;&lt;iframe src=&quot;/x&quot;&gt;&lt;/iframe&gt;');
  });
});
