import { describe, expect, it } from 'vitest';

import { computePageBreaks, type PageBreakInput } from './pagePacking';

const item = (height: number, gapBefore = 0, forcedBreakBefore = false): PageBreakInput => ({
  forcedBreakBefore,
  gapBefore,
  height,
});

describe('computePageBreaks', () => {
  it('keeps an exact fit on one page', () => {
    const packing = computePageBreaks([item(60), item(40)], 100);

    expect(packing.pageCount).toBe(1);
    expect(packing.pages).toEqual([{ bottom: 100, firstItemIndex: 0, itemCount: 2, top: 0 }]);
    expect(packing.oversizedItemIndexes).toEqual([]);
  });

  it('moves an item one pixel over the limit to the next page', () => {
    const packing = computePageBreaks([item(60), item(41)], 100);

    expect(packing.pageCount).toBe(2);
    expect(packing.pages).toEqual([
      { bottom: 60, firstItemIndex: 0, itemCount: 1, top: 0 },
      { bottom: 101, firstItemIndex: 1, itemCount: 1, top: 60 },
    ]);
    expect(packing.oversizedItemIndexes).toEqual([]);
  });

  it('spends a gap when the item stays, and drops it when the item breaks', () => {
    const stays = computePageBreaks([item(50), item(40, 10)], 100);
    expect(stays.pageCount).toBe(1);
    expect(stays.pages[0]?.bottom).toBe(100);

    const breaks = computePageBreaks([item(50), item(41, 10)], 100);
    expect(breaks.pageCount).toBe(2);
    // The gap survives in the flow offsets, but the new page only accounts for the item itself.
    expect(breaks.pages[1]).toEqual({ bottom: 101, firstItemIndex: 1, itemCount: 1, top: 60 });
  });

  it('starts a page on a forced break even when the item would fit', () => {
    const packing = computePageBreaks([item(40), item(40, 0, true)], 100);

    expect(packing.pageCount).toBe(2);
    expect(packing.pages[1]).toEqual({ bottom: 80, firstItemIndex: 1, itemCount: 1, top: 40 });
  });

  it('truncates the gap at a forced break instead of spending it', () => {
    // Spending the 40px gap would leave 30px short of the third item; truncation fits both.
    const packing = computePageBreaks([item(50), item(70, 40, true), item(30)], 100);

    expect(packing.pageCount).toBe(2);
    expect(packing.pages[1]).toEqual({ bottom: 190, firstItemIndex: 1, itemCount: 2, top: 90 });
  });

  it('gives consecutive forced breaks a page each', () => {
    const packing = computePageBreaks([item(10, 0, true), item(10, 0, true)], 100);

    expect(packing.pageCount).toBe(2);
    expect(packing.pages.map((page) => page.itemCount)).toEqual([1, 1]);
  });

  it('does not open a blank page for a forced break on the first item', () => {
    const packing = computePageBreaks([item(50, 0, true), item(20)], 100);

    expect(packing.pageCount).toBe(1);
    expect(packing.pages[0]).toEqual({ bottom: 70, firstItemIndex: 0, itemCount: 2, top: 0 });
  });

  it('gives an oversized item a page of its own and reports it', () => {
    const packing = computePageBreaks([item(150), item(10)], 100);

    expect(packing.pageCount).toBe(2);
    expect(packing.pages).toEqual([
      { bottom: 150, firstItemIndex: 0, itemCount: 1, top: 0 },
      { bottom: 160, firstItemIndex: 1, itemCount: 1, top: 150 },
    ]);
    expect(packing.oversizedItemIndexes).toEqual([0]);
  });

  it('places a single item on a single page', () => {
    const packing = computePageBreaks([item(80)], 100);

    expect(packing.pageCount).toBe(1);
    expect(packing.pages).toEqual([{ bottom: 80, firstItemIndex: 0, itemCount: 1, top: 0 }]);
    expect(packing.oversizedItemIndexes).toEqual([]);
  });

  it('reports no pages for an empty document', () => {
    const packing = computePageBreaks([], 100);

    expect(packing).toEqual({ oversizedItemIndexes: [], pageCount: 0, pages: [] });
  });
});
