/*
 * The screen preview cannot ask CSS where the print pages fall — page
 * boundaries are produced by Chromium's fragmentation engine, which only runs
 * in print media. This module reproduces the one rule that engine applies to
 * this document, so the preview's pages fall where the printed breaks are.
 *
 * The rule: blocks are atomic (`break-inside: avoid`), so an item that does not
 * fit the space left on a page moves whole to the next page and is never cut.
 * At that break the preceding margin is truncated, so the gap is spent only
 * when the item stays on the current page.
 */

export interface PageBreakInput {
  /** Border-box height of the atomic item, in CSS px. */
  height: number;
  /** Vertical gap before this item, in CSS px. 0 for the first item. */
  gapBefore: number;
  /** Set when the item follows a CSS `break-before: page`, which always starts a page. */
  forcedBreakBefore?: boolean;
}

export interface PageSpan {
  /** Flow offset of the page's first item top edge; page 1 starts at 0. */
  top: number;
  /** Flow offset of the page's last item bottom edge. */
  bottom: number;
  /** Index of the first item on this page. */
  firstItemIndex: number;
  /** Number of items on this page. */
  itemCount: number;
}

export interface PagePacking {
  /** One entry per page, in order. Flow offsets are relative to the first item's top edge. */
  pages: PageSpan[];
  pageCount: number;
  /**
   * Items taller than a full page. They are given a page of their own and are
   * never cut here, but the print engine would split them, so the caller must
   * treat their offsets as unverifiable.
   */
  oversizedItemIndexes: number[];
}

export const computePageBreaks = (
  items: readonly PageBreakInput[],
  pageContentHeight: number,
): PagePacking => {
  const isPositiveLength = (value: number): boolean =>
    Number.isFinite(value) && value > 0 && value <= Number.MAX_SAFE_INTEGER;
  if (!isPositiveLength(pageContentHeight)) {
    throw new RangeError('Page height must be a finite positive length');
  }
  const totalHeight = items.reduce((total, item) => {
    if (!isPositiveLength(item.height) || !Number.isFinite(item.gapBefore)) {
      throw new RangeError('Item geometry must be finite with a positive height');
    }
    return total + item.height + Math.max(0, item.gapBefore);
  }, 0);
  if (!Number.isFinite(totalHeight) || totalHeight > Number.MAX_SAFE_INTEGER) {
    throw new RangeError('Document geometry exceeds safe numeric precision');
  }

  const pages: PageSpan[] = [];
  const oversizedItemIndexes: number[] = [];

  let pageTop = 0;
  let pageFirstIndex = 0;
  let pageItemCount = 0;
  // Offset just past the last placed item, so `cursor + gapBefore` is the next item's top.
  let cursor = 0;

  const closePage = (bottom: number): void => {
    pages.push({ bottom, firstItemIndex: pageFirstIndex, itemCount: pageItemCount, top: pageTop });
  };

  items.forEach((item, index) => {
    const gap = Math.max(0, item.gapBefore);
    // A page's first item spends no gap: the break truncated the margin.
    const used = pageItemCount === 0 ? 0 : cursor - pageTop;
    const startsNewPage =
      pageItemCount > 0 &&
      (item.forcedBreakBefore === true || used + gap + item.height > pageContentHeight);

    if (startsNewPage) {
      closePage(cursor);
      pageFirstIndex = index;
      pageItemCount = 0;
    }

    // The gap still exists on screen at a break; only the space accounting drops it.
    const top = cursor + gap;
    if (pageItemCount === 0) {
      pageTop = top;
    }

    cursor = top + item.height;
    pageItemCount += 1;

    if (item.height > pageContentHeight) {
      oversizedItemIndexes.push(index);
    }
  });

  if (pageItemCount > 0) {
    closePage(cursor);
  }

  return { oversizedItemIndexes, pageCount: pages.length, pages };
};
