import { describe, expect, it } from 'vitest';

import { addTableLabels } from '@/lib/mdx/rehypeTableLabels';

type Node = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
  value?: string;
};

function element(tagName: string, children: Node[] = []): Node {
  return { type: 'element', tagName, children };
}

function text(value: string): Node {
  return { type: 'text', value };
}

function tbodyCells(tree: Node): Node[] {
  const table = tree.children![0]!;
  const tbody = table.children!.find((c) => c.tagName === 'tbody')!;
  return tbody.children![0]!.children!;
}

describe('addTableLabels', () => {
  it('copies header texts into td data-label by column index', () => {
    const tree = element('root', [
      element('table', [
        element('thead', [
          element('tr', [element('th', [text('Name')]), element('th', [text('Age')])]),
        ]),
        element('tbody', [
          element('tr', [element('td', [text('Kim')]), element('td', [text('30')])]),
        ]),
      ]),
    ]);

    addTableLabels(tree);

    const cells = tbodyCells(tree);
    expect(cells[0]!.properties?.dataLabel).toBe('Name');
    expect(cells[1]!.properties?.dataLabel).toBe('Age');
  });

  it('skips cells when a header is missing', () => {
    const tree = element('root', [
      element('table', [
        element('thead', [element('tr', [element('th', [text('Only')])])]),
        element('tbody', [
          element('tr', [element('td', [text('a')]), element('td', [text('b')])]),
        ]),
      ]),
    ]);

    addTableLabels(tree);

    const cells = tbodyCells(tree);
    expect(cells[0]!.properties?.dataLabel).toBe('Only');
    expect(cells[1]!.properties?.dataLabel).toBeUndefined();
  });

  it('leaves tables without thead untouched', () => {
    const tree = element('root', [
      element('table', [
        element('tbody', [element('tr', [element('td', [text('x')])])]),
      ]),
    ]);

    addTableLabels(tree);

    const table = tree.children![0]!;
    const tbody = table.children![0]!;
    const row = tbody.children![0]!;
    expect(row.children![0]!.properties?.dataLabel).toBeUndefined();
  });
});
