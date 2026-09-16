import { describe, expect, it } from 'vitest';

import {
  DOC_CONTENT_WIDTH_PX,
  FIGURE_CELL_BORDER_PX,
  FIGURE_CELL_GAP_PX,
  FIGURE_CELL_PADDING_PX,
  type FigureRowCell,
  type FigureRowImage,
  layoutFigureRow,
} from './figureRow';

const MM_PX = 96 / 25.4;
const CHROME_PX = 2 * (FIGURE_CELL_PADDING_PX + FIGURE_CELL_BORDER_PX);
const LANDSCAPE_CAP_PX = 52 * MM_PX;
const PORTRAIT_CAP_PX = 80 * MM_PX;

/** Intrinsic sizes of images the content actually declares. */
const desktopShot: FigureRowImage = { height: 1924, src: '/shot/desktop.webp', width: 3338 };
const phoneShot: FigureRowImage = { height: 2622, src: '/shot/phone.webp', width: 1206 };
const dashboardShot: FigureRowImage = { height: 1309, src: '/shot/dashboard.webp', width: 2560 };
const panelShot: FigureRowImage = { height: 1400, src: '/shot/panel.webp', width: 800 };
const narrowShot: FigureRowImage = { height: 894, src: '/shot/narrow.webp', width: 520 };

const cellsOf = (images: readonly FigureRowImage[]): FigureRowCell[] => {
  const row = layoutFigureRow(images);

  expect(row, 'a row of sized images lays out').not.toBeNull();

  return row?.cells ?? [];
};

const rowWidth = (cells: readonly FigureRowCell[]): number =>
  cells.reduce((sum, cell) => sum + cell.width, 0) + (cells.length - 1) * FIGURE_CELL_GAP_PX;

const contentHeight = (cell: FigureRowCell): number => cell.height - CHROME_PX;

const contentRatio = (cell: FigureRowCell): number =>
  (cell.width - CHROME_PX) / (cell.height - CHROME_PX);

describe('layoutFigureRow', () => {
  it('keeps a single figure at the cap the previous layout gave it', () => {
    const [landscape] = cellsOf([desktopShot]);
    const [portrait] = cellsOf([phoneShot]);

    expect(landscape).toBeDefined();
    expect(portrait).toBeDefined();
    if (!landscape || !portrait) return;

    expect(contentHeight(landscape)).toBeCloseTo(LANDSCAPE_CAP_PX, 1);
    expect(contentHeight(portrait)).toBeCloseTo(PORTRAIT_CAP_PX, 1);
  });

  it('fits every declared image set inside the sheet width', () => {
    const rows: FigureRowImage[][] = [
      [phoneShot, desktopShot, desktopShot],
      [dashboardShot, dashboardShot, dashboardShot],
      [dashboardShot, panelShot, narrowShot],
      [phoneShot, phoneShot, phoneShot],
      [dashboardShot, { height: 1126, src: '/shot/wide.webp', width: 1600 }],
    ];

    for (const images of rows) {
      expect(rowWidth(cellsOf(images))).toBeLessThanOrEqual(DOC_CONTENT_WIDTH_PX);
    }
  });

  it('gives every cell in a row one shared height', () => {
    const cells = cellsOf([phoneShot, desktopShot, dashboardShot]);

    expect(cells).toHaveLength(3);
    expect(new Set(cells.map((cell) => cell.height)).size).toBe(1);
  });

  it('adopts the smallest cap in a mixed row so no image is scaled past its own', () => {
    const [cell] = cellsOf([phoneShot, desktopShot]);

    expect(cell).toBeDefined();
    if (!cell) return;

    expect(contentHeight(cell)).toBeCloseTo(LANDSCAPE_CAP_PX, 1);
  });

  it('shrinks rather than crops when three wide shots share a row', () => {
    const cells = cellsOf([dashboardShot, dashboardShot, dashboardShot]);
    const [first] = cells;

    expect(first).toBeDefined();
    if (!first) return;

    expect(contentHeight(first)).toBeLessThan(LANDSCAPE_CAP_PX);
    for (const cell of cells) {
      expect(contentRatio(cell)).toBeCloseTo(dashboardShot.width / dashboardShot.height, 2);
    }
  });

  it('preserves each image own ratio in its cell', () => {
    const rows: FigureRowImage[][] = [
      [phoneShot],
      [dashboardShot],
      [phoneShot, desktopShot],
      [desktopShot, phoneShot],
      [dashboardShot, panelShot, narrowShot],
    ];

    for (const images of rows) {
      cellsOf(images).forEach((cell, index) => {
        const image = images[index];
        if (!image) return;

        expect(contentRatio(cell)).toBeCloseTo(image.width / image.height, 2);
      });
    }
  });

  it('caps a portrait row at the portrait cap instead of stretching it to fit', () => {
    const cells = cellsOf([phoneShot, phoneShot, phoneShot]);

    for (const cell of cells) {
      expect(contentHeight(cell)).toBeCloseTo(PORTRAIT_CAP_PX, 1);
    }
    expect(rowWidth(cells)).toBeLessThan(DOC_CONTENT_WIDTH_PX);
  });

  it('returns null when the list is empty or an image has no recorded size', () => {
    expect(layoutFigureRow([])).toBeNull();
    expect(
      layoutFigureRow([desktopShot, { height: 0, src: '/shot/broken.webp', width: 0 }]),
    ).toBeNull();
  });
});
