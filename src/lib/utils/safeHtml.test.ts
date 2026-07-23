import { describe, expect, it } from 'vitest';

import { sanitizeProjectHtml } from '@/lib/utils/safeHtml';

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

  it('keeps markdown-rendered block tags used by structured project content', () => {
    expect(sanitizeProjectHtml('<p>Intro</p><ol><li>First</li></ol><h3>Note</h3>')).toBe(
      '<p>Intro</p><ol><li>First</li></ol><h3>Note</h3>',
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

  it('does not double-escape existing HTML entities', () => {
    expect(
      sanitizeProjectHtml(
        '<code>import _ from &#39;lodash&#39;;</code>',
      ),
    ).toBe('<code>import _ from &#39;lodash&#39;;</code>');
  });

  it('highlights code blocks and preserves line indentation', () => {
    const input = `<pre class="language-tsx"><code class="language-tsx">import { AutoSizer } from 'react-virtualized';

const cache = new CellMeasurerCache({
  defaultHeight: 20,
});</code></pre>`;
    const output = sanitizeProjectHtml(input);
    console.log('OUTPUT:', JSON.stringify(output));
  });
});
