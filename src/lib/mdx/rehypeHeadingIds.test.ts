import { describe, expect, it } from 'vitest';

import rehypeHeadingIds from '@/lib/mdx/rehypeHeadingIds';

interface HastNode {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

const root = (...children: HastNode[]): HastNode => ({ type: 'root', children });

const text = (value: string): HastNode => ({ type: 'text', value });

const heading = (tagName: string, ...children: HastNode[]): HastNode => ({
  type: 'element',
  tagName,
  properties: {},
  children,
});

const idOf = (node: HastNode): unknown => node.properties?.id;

describe('rehypeHeadingIds', () => {
  it('assigns slugified ids to h2 headings and mutates the tree in place', () => {
    const first = heading('h2', text('Hello, World!'));
    const second = heading('h2', text('API: v2.0 (beta)!'));
    const tree = root(first, second);

    const transform = rehypeHeadingIds();

    expect(transform(tree)).toBeUndefined();
    expect(idOf(first)).toBe('hello-world');
    expect(idOf(second)).toBe('api-v20-beta');
  });

  it('lowercases, strips punctuation, and collapses whitespace runs into hyphens', () => {
    const noisy = heading('h2', text('  Spaced   Out — Again  '));
    const tree = root(noisy);

    rehypeHeadingIds()(tree);

    expect(idOf(noisy)).toBe('spaced-out-again');
  });

  it('creates a properties bag when a heading has none', () => {
    const bare: HastNode = { type: 'element', tagName: 'h2', children: [text('Bare Heading')] };
    const tree = root(bare);

    rehypeHeadingIds()(tree);

    expect(bare.properties).toEqual({ id: 'bare-heading' });
  });

  it('keeps an existing non-empty id and still advances the heading index', () => {
    const custom = heading('h2', text('Ignored Text'));
    custom.properties = { id: 'custom-anchor' };
    const generated = heading('h2');
    const tree = root(custom, generated);

    rehypeHeadingIds()(tree);

    expect(idOf(custom)).toBe('custom-anchor');
    expect(idOf(generated)).toBe('section-1');
  });

  it('treats an empty-string id as unset', () => {
    const emptyId = heading('h2', text('Recovered'));
    emptyId.properties = { id: '' };
    const tree = root(emptyId);

    rehypeHeadingIds()(tree);

    expect(idOf(emptyId)).toBe('recovered');
  });

  it('strips emoji while keeping unicode letters and digits', () => {
    const accented = heading('h2', text('Café 🚀 Déjà vu'));
    const korean = heading('h2', text('속도 개선 v2'));
    const tree = root(accented, korean);

    rehypeHeadingIds()(tree);

    expect(idOf(accented)).toBe('café-déjà-vu');
    expect(idOf(korean)).toBe('속도-개선-v2');
  });

  it('falls back to the section index when a heading has no usable text', () => {
    const punctuationOnly = heading('h2', text('!!!'));
    const emptyChildren = heading('h2');
    const tree = root(punctuationOnly, emptyChildren);

    rehypeHeadingIds()(tree);

    expect(idOf(punctuationOnly)).toBe('section-0');
    expect(idOf(emptyChildren)).toBe('section-1');
  });

  it('reads a node value before children and treats a missing children array as empty', () => {
    const valueOnly: HastNode = {
      type: 'element',
      tagName: 'h2',
      properties: {},
      value: 'Raw Value',
    };
    const noChildren: HastNode = { type: 'element', tagName: 'h2', properties: {} };
    const emptyChildren = heading('h2');
    const tree = root(valueOnly, noChildren, emptyChildren);

    rehypeHeadingIds()(tree);

    expect(idOf(valueOnly)).toBe('raw-value');
    expect(idOf(noChildren)).toBe('section-1');
    expect(idOf(emptyChildren)).toBe('section-2');
  });

  it('recurses into nested wrappers and inline markup', () => {
    const deepHeading = heading('h2', {
      type: 'element',
      tagName: 'strong',
      properties: {},
      children: [text('Deep Dive')],
    });
    const nested = heading('h2', text('Nested Section'));
    const wrapper: HastNode = {
      type: 'element',
      tagName: 'section',
      properties: {},
      children: [nested],
    };
    const tree = root(deepHeading, wrapper);

    rehypeHeadingIds()(tree);

    expect(idOf(deepHeading)).toBe('deep-dive');
    expect(idOf(nested)).toBe('nested-section');
  });

  it('advances the index only for h2 headings', () => {
    const h1 = heading('h1', text('Intro'));
    const firstEmptyH2 = heading('h2');
    const h3 = heading('h3', text('Notes'));
    const secondEmptyH2 = heading('h2');
    const tree = root(h1, firstEmptyH2, h3, secondEmptyH2);

    rehypeHeadingIds()(tree);

    expect(idOf(h1)).toBeUndefined();
    expect(idOf(h3)).toBeUndefined();
    expect(idOf(firstEmptyH2)).toBe('section-0');
    expect(idOf(secondEmptyH2)).toBe('section-1');
  });
});
