import { type ComponentPropsWithoutRef, type ComponentType, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { useMDXComponents } from '@/mdx-components';

type AnchorProps = ComponentPropsWithoutRef<'a'>;

function renderAnchor(props: AnchorProps): string {
  // biome-ignore lint/correctness/useHookAtTopLevel: useMDXComponents is the MDX components convention, not a React hook
  const { a } = useMDXComponents({});
  if (typeof a !== 'function') {
    throw new Error('useMDXComponents did not return a function anchor component');
  }

  const Anchor: ComponentType<AnchorProps> = a;
  return renderToStaticMarkup(createElement(Anchor, props));
}

describe('useMDXComponents anchor', () => {
  it('sends absolute http links to a new tab with a safe rel', () => {
    const html = renderAnchor({ children: 'Case study', href: 'https://example.com/case-study' });

    expect(html).toContain('href="https://example.com/case-study"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('Case study');
  });

  it('keeps relative, hash and protocol-relative links in the same tab', () => {
    for (const href of ['/projects/aira', '#overview', '//example.com/post']) {
      const html = renderAnchor({ children: 'Section', href });

      expect(html).toContain(`href="${href}"`);
      expect(html).not.toContain('target="_blank"');
      expect(html).not.toContain('rel=');
    }
  });

  it('treats a missing href as internal', () => {
    const html = renderAnchor({ children: 'Plain anchor' });

    expect(html).not.toContain('target="_blank"');
    expect(html).not.toContain('rel=');
    expect(html).toContain('Plain anchor');
  });

  it('forwards the remaining anchor attributes', () => {
    const html = renderAnchor({
      className: 'mdx-link',
      children: 'Docs',
      href: '/docs',
      title: 'Docs',
    });

    expect(html).toContain('class="mdx-link"');
    expect(html).toContain('title="Docs"');
  });
});

describe('useMDXComponents mapping', () => {
  it('preserves caller components and always overrides the anchor', () => {
    const CallerHeading = () => null;
    const CallerAnchor = () => null;
    const First = useMDXComponents({ a: CallerAnchor, h1: CallerHeading });
    const Second = useMDXComponents({});

    expect(First.h1).toBe(CallerHeading);
    expect(First.a).not.toBe(CallerAnchor);
    expect(First.a).toBe(Second.a);
    expect(typeof First.a).toBe('function');
  });
});
