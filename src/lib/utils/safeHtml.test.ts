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
    expect(sanitizeProjectHtml('<code>import _ from &#39;lodash&#39;;</code>')).toBe(
      '<code>import _ from &#39;lodash&#39;;</code>',
    );
  });

  it('highlights code blocks and preserves line indentation', () => {
    const input = `<pre class="language-tsx"><code class="language-tsx">import { AutoSizer } from 'react-virtualized';

const cache = new CellMeasurerCache({
  defaultHeight: 20,
});</code></pre>`;
    const output = sanitizeProjectHtml(input);

    expect(output).toContain('<pre class="language-tsx"><code class="language-tsx">');
    expect(output).toContain('<span class="token keyword">import</span>');
    expect(output).toContain('<span class="token keyword">const</span>');
    expect(output).toContain('</code></pre>');
    // Blank lines and the two-space body indentation survive highlighting.
    expect(output).toContain('</span>\n\n<span');
    expect(output).toContain('\n  defaultHeight');
  });
});

describe('sanitizeProjectHtml allowlist', () => {
  it('keeps every allowed block and inline tag', () => {
    expect(sanitizeProjectHtml('<h2>Heading</h2><span>inline</span><pre>plain</pre>')).toBe(
      '<h2>Heading</h2><span>inline</span><pre>plain</pre>',
    );
    expect(
      sanitizeProjectHtml(
        '<table><thead><tr><th>Head</th></tr></thead><tbody><tr><td>Body</td></tr></tbody></table>',
      ),
    ).toBe(
      '<table><thead><tr><th>Head</th></tr></thead><tbody><tr><td>Body</td></tr></tbody></table>',
    );
  });

  it.each(['br', 'img'])('drops a closing %s tag because it is a void element', (tag) => {
    expect(sanitizeProjectHtml(`Text</${tag}>`)).toBe('Text');
  });

  it('strips attributes from ordinary tags but keeps classes on code, pre, and span', () => {
    expect(sanitizeProjectHtml('<p id="lead" data-x="1">Text</p>')).toBe('<p>Text</p>');
    expect(sanitizeProjectHtml('<h2 class="title">Heading</h2>')).toBe('<h2>Heading</h2>');
    expect(sanitizeProjectHtml('<span class="token">x</span>')).toBe(
      '<span class="token">x</span>',
    );
    expect(sanitizeProjectHtml('<pre class="code-block">plain</pre>')).toBe(
      '<pre class="code-block">plain</pre>',
    );
  });

  it('leaves a code tag unwrapped when it is not inside a pre block', () => {
    expect(sanitizeProjectHtml('<code class="language-tsx">const el = &lt;div&gt;;</code>')).toBe(
      '<code class="language-tsx">const el = &lt;div&gt;;</code>',
    );
  });
});

describe('sanitizeProjectHtml images and escaping', () => {
  it('matches image attributes case-insensitively and normalizes them', () => {
    expect(sanitizeProjectHtml('<img SRC="/images/chart.webp" ALT="Chart">')).toBe(
      '<img src="/images/chart.webp" alt="Chart">',
    );
  });

  it.each(['images/chart.webp', '/other/chart.webp', '/images', 'https://example.com/x.png', ''])(
    'drops an image whose src is not under /images/: %s',
    (src) => {
      expect(sanitizeProjectHtml(`<img src="${src}" alt="Chart">`)).toBe('');
    },
  );

  it('escapes every reserved HTML character in text content', () => {
    expect(sanitizeProjectHtml(`a & b < c > d " e ' f`)).toBe(
      'a &amp; b &lt; c &gt; d &quot; e &#39; f',
    );
  });

  it.each(['&amp;', '&nbsp;', '&copy;', '&#39;', '&#1234;'])(
    'does not double-escape the existing entity %s',
    (entity) => {
      expect(sanitizeProjectHtml(`<code>${entity}</code>`)).toBe(`<code>${entity}</code>`);
    },
  );
});

describe('sanitizeProjectHtml highlighting', () => {
  it('highlights a pre block even when whitespace separates it from the code tag', () => {
    const output = sanitizeProjectHtml(
      '<pre class="language-tsx">   <code class="language-tsx">const value = 1;</code></pre>',
    );

    expect(output).toContain('<pre class="language-tsx"><code class="language-tsx">');
    expect(output).toContain('<span class="token keyword">const</span>');
  });

  it('trims a leading and trailing newline before highlighting', () => {
    const output = sanitizeProjectHtml(
      '<pre class="language-tsx"><code class="language-tsx">\nconst value = 1;\n</code></pre>',
    );

    expect(output).toBe(
      '<pre class="language-tsx"><code class="language-tsx"><span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></code></pre>',
    );
  });

  it.each([
    ['leading spaces before the first newline', '  \nconst value = 1;'],
    ['trailing indentation after the last newline', 'const value = 1;\n  '],
  ])('trims %s before highlighting', (_label, code) => {
    const output = sanitizeProjectHtml(
      `<pre class="language-tsx"><code class="language-tsx">${code}</code></pre>`,
    );

    expect(output).toBe(
      '<pre class="language-tsx"><code class="language-tsx"><span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></code></pre>',
    );
  });

  it('tolerates whitespace between the closing code and pre tags', () => {
    const output = sanitizeProjectHtml(
      '<pre class="language-tsx"><code class="language-tsx">const value = 1;</code>\n</pre>',
    );

    expect(output).toBe(
      '<pre class="language-tsx"><code class="language-tsx"><span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></code></pre>',
    );
  });

  it('falls back to the tsx grammar for an unknown language', () => {
    const output = sanitizeProjectHtml(
      '<pre class="language-unknown"><code class="language-unknown">const value = 1;</code></pre>',
    );

    expect(output).toContain('class="language-unknown"');
    expect(output).toContain('<span class="token keyword">const</span>');
  });

  it('uses the requested language grammar when it is registered', () => {
    const output = sanitizeProjectHtml(
      '<pre class="language-bash"><code class="language-bash">echo "$HOME"</code></pre>',
    );

    expect(output).toContain('class="language-bash"');
    expect(output).toContain('<span class="token builtin class-name">echo</span>');
  });

  it('decodes HTML entities in code before highlighting', () => {
    const output = sanitizeProjectHtml(
      '<pre class="language-tsx"><code class="language-tsx">const el = &lt;div&gt;text&lt;/div&gt;;</code></pre>',
    );

    expect(output).not.toContain('&amp;lt;');
    expect(output).toContain('<span class="token tag">');
    expect(output).toContain('<span class="token plain-text">text</span>');
  });

  it('decodes an escaped ampersand back to a single operator token', () => {
    const output = sanitizeProjectHtml(
      '<pre class="language-tsx"><code class="language-tsx">a &amp;&amp; b</code></pre>',
    );

    expect(output).not.toContain('&amp;amp;');
    expect(output).toContain('<span class="token operator">&amp;&amp;</span>');
  });

  it('decodes escaped quotes in code before highlighting', () => {
    const doubleQuoted = sanitizeProjectHtml(
      '<pre class="language-tsx"><code class="language-tsx">const s = &quot;hi&quot;;</code></pre>',
    );
    const singleQuoted = sanitizeProjectHtml(
      '<pre class="language-tsx"><code class="language-tsx">const s = &#39;hi&#39;;</code></pre>',
    );

    expect(doubleQuoted).not.toContain('&quot;');
    expect(doubleQuoted).toContain('<span class="token string">"hi"</span>');
    expect(singleQuoted).not.toContain('&#39;');
    expect(singleQuoted).toContain('<span class="token string">\'hi\'</span>');
  });

  it('does not highlight a pre block that has no language class', () => {
    expect(sanitizeProjectHtml('<pre class="code-block">plain text</pre>')).toBe(
      '<pre class="code-block">plain text</pre>',
    );
    expect(sanitizeProjectHtml('<pre>plain text</pre>')).toBe('<pre>plain text</pre>');
  });
});
