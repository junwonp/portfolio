'use client';

import { useEffect, useRef, useState } from 'react';
import * as styles from './PageSeams.css';
import {
  PAGE_CONTENT_HEIGHT_PX,
  PAGE_GAP_PX,
  PAGE_HEIGHT_PX,
  PAGE_PADDING_BOTTOM_PX,
  PAGE_PADDING_TOP_PX,
  pageGap,
} from './PortfolioDocument.css';
import {
  computePageBreaks,
  type PageBreakInput,
  type PagePacking,
  type PageSpan,
} from './pagePacking';

/*
 * Screen-only page preview. Chromium's fragmentation engine decides where the
 * printed pages break and never runs in screen media, so the preview recomputes
 * the breaks from the live DOM with the same packing rule (pagePacking.ts),
 * gives each break the exact space its page leaves behind, and paints one
 * decorative A4 sheet per page. The flow is measured and spaced, never
 * re-parented, moved or duplicated, which is what keeps print untouched.
 */

/** Page n's content starts one A4 plus one gap below page n-1's content. */
const PAGE_PITCH_PX = PAGE_HEIGHT_PX + PAGE_GAP_PX;

const PAGE_ADVANCE_PROPERTY = '--doc-page-advance';
const TAIL_PADDING_PROPERTY = '--doc-tail-padding';

/** Set on the sheet by PortfolioDocument; asserted in PortfolioDocument.test.tsx. */
const SHEET_SELECTOR = '[data-document-sheet]';

interface PageLayout {
  /** The sheet's left edge against the preview layer. */
  left: number;
  pageCount: number;
  /** The sheet's top edge against the preview layer. */
  top: number;
  width: number;
}

const emptyLayout: PageLayout = { left: 0, pageCount: 0, top: 0, width: 0 };

interface MeasuredItem {
  bottom: number;
  /** Block that carries the page spacing when this item starts a page. */
  element: HTMLElement;
  forcedBreakBefore: boolean;
  height: number;
  top: number;
}

/** Heights are wrong until eager figures have settled; a settled failure is still a height. */
const whenImageSettled = (image: HTMLImageElement): Promise<void> =>
  image.complete
    ? Promise.resolve()
    : new Promise((resolve) => {
        const settle = () => resolve();

        image.addEventListener('error', settle, { once: true });
        image.addEventListener('load', settle, { once: true });
      });

const measureBlock = (element: HTMLElement, origin: number): MeasuredItem => {
  const { bottom, height, top } = element.getBoundingClientRect();

  return {
    bottom: bottom - origin,
    element,
    forcedBreakBefore: false,
    height,
    top: top - origin,
  };
};

/*
 * The sheet's children are the masthead, the cover pillars, then one <section>
 * per document section. A section carries break-before: page, so it starts a
 * page, and its <h2> is glued to its first block (break-after: avoid) — the two
 * are one atomic item here, exactly as the print engine treats them.
 */
const measureItems = (sheet: HTMLElement): MeasuredItem[] => {
  const origin = sheet.getBoundingClientRect().top;
  const items: MeasuredItem[] = [];

  for (const child of Array.from(sheet.querySelectorAll<HTMLElement>(':scope > *'))) {
    if (child.tagName !== 'SECTION') {
      items.push(measureBlock(child, origin));
      continue;
    }

    const [heading, firstBlock, ...rest] = Array.from(
      child.querySelectorAll<HTMLElement>(':scope > *'),
    );
    if (!heading || !firstBlock) continue;

    const headingTop = heading.getBoundingClientRect().top;
    const firstBlockBottom = firstBlock.getBoundingClientRect().bottom;
    items.push({
      bottom: firstBlockBottom - origin,
      element: child,
      forcedBreakBefore: true,
      height: firstBlockBottom - headingTop,
      top: headingTop - origin,
    });

    for (const block of rest) {
      items.push(measureBlock(block, origin));
    }
  }

  return items;
};

const toBreakInputs = (items: MeasuredItem[]): PageBreakInput[] =>
  items.map((measured, index) => {
    const previous = items[index - 1];

    return {
      forcedBreakBefore: measured.forcedBreakBefore,
      gapBefore: previous ? Math.max(0, measured.top - previous.bottom) : 0,
      height: measured.height,
    };
  });

/** Content the page consumed: its items plus the gaps between them; a gap truncated by the break is not spent. */
const usedPageHeight = (page: PageSpan): number => page.bottom - page.top;

const clearPreview = (sheet: HTMLElement, applied: Set<HTMLElement>): void => {
  for (const element of applied) {
    element.classList.remove(pageGap);
    element.style.removeProperty(PAGE_ADVANCE_PROPERTY);
  }

  applied.clear();
  sheet.style.removeProperty(TAIL_PADDING_PROPERTY);
};

/*
 * Page n's content must land one pitch below page n-1's, so the space between
 * the two is the pitch minus whatever the previous page used — a per-break value
 * no fixed margin can express. The same reasoning closes the sheet: the space
 * left after the last content is the rest of its page, which is what makes the
 * final sheet a full A4 like the others.
 */
const applyPagination = (
  sheet: HTMLElement,
  items: MeasuredItem[],
  packing: PagePacking,
  applied: Set<HTMLElement>,
): void => {
  for (let index = 1; index < packing.pages.length; index += 1) {
    const previousPage = packing.pages[index - 1];
    const page = packing.pages[index];
    const item = items[page?.firstItemIndex ?? -1];

    if (!previousPage || !page || !item) continue;

    item.element.classList.add(pageGap);
    item.element.style.setProperty(
      PAGE_ADVANCE_PROPERTY,
      `${PAGE_PITCH_PX - usedPageHeight(previousPage)}px`,
    );
    applied.add(item.element);
  }

  const lastPage = packing.pages.at(-1);
  if (!lastPage) return;

  const tail = PAGE_HEIGHT_PX - PAGE_PADDING_TOP_PX - usedPageHeight(lastPage);
  sheet.style.setProperty(TAIL_PADDING_PROPERTY, `${Math.max(PAGE_PADDING_BOTTOM_PX, tail)}px`);
};

const measureLayout = (
  sheet: HTMLElement,
  layer: HTMLElement,
  applied: Set<HTMLElement>,
): PageLayout => {
  // Packing runs on the un-spaced flow, never on its own output: the preview
  // spacing must not feed back into where the pages break, or its count would
  // drift away from the printed page count it exists to mirror.
  clearPreview(sheet, applied);
  const measured = measureItems(sheet);
  const packing = computePageBreaks(toBreakInputs(measured), PAGE_CONTENT_HEIGHT_PX);

  applyPagination(sheet, measured, packing, applied);

  if (packing.pageCount === 0) return emptyLayout;

  // Read geometry again: the spacing just moved everything below the first page.
  const sheetRect = sheet.getBoundingClientRect();
  const layerRect = layer.getBoundingClientRect();

  return {
    left: sheetRect.left - layerRect.left,
    pageCount: packing.pageCount,
    top: sheetRect.top - layerRect.top,
    width: sheetRect.width,
  };
};

export default function PageSeams() {
  const layerRef = useRef<HTMLDivElement>(null);
  const appliedGapsRef = useRef(new Set<HTMLElement>());
  const [layout, setLayout] = useState<PageLayout>(emptyLayout);

  useEffect(() => {
    const layer = layerRef.current;
    const sheet = layer?.parentElement?.querySelector<HTMLElement>(SHEET_SELECTOR);
    if (!layer || !sheet) return;

    const applied = appliedGapsRef.current;
    let cancelled = false;
    let frame = 0;

    const apply = () => {
      if (cancelled) return;

      setLayout(measureLayout(sheet, layer, applied));
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };

    const settle = async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(sheet.querySelectorAll('img'), whenImageSettled));
      apply();
    };

    void settle();
    window.addEventListener('resize', schedule);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      clearPreview(sheet, applied);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={styles.layer}
      data-page-count={layout.pageCount}
      ref={layerRef}
    >
      {Array.from({ length: layout.pageCount }, (_, index) => (
        <div
          className={styles.pageSheet}
          key={layout.top + index * PAGE_PITCH_PX}
          style={{
            height: PAGE_HEIGHT_PX,
            left: layout.left,
            top: layout.top + index * PAGE_PITCH_PX,
            width: layout.width,
          }}
        />
      ))}
    </div>
  );
}
