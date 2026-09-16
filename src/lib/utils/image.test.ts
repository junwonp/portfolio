import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

import projectImages from '@/lib/generated/projectImages.json';

vi.mock('@/lib/generated/images.json', () => ({
  default: {
    '/images/example.png': {
      width: 1600,
      height: 900,
      variants: [
        { src: '/images/generated/example-480.webp', width: 480 },
        { src: '/images/generated/example-960.webp', width: 960 },
        { src: '/images/generated/example-1600.webp', width: 1600 },
      ],
      printVariants: [
        { src: '/images/generated/print-example-480.jpg', width: 480 },
        { src: '/images/generated/print-example-960.jpg', width: 960 },
        { src: '/images/generated/print-example-1600.jpg', width: 1600 },
      ],
    },
    '/images/legacy.png': {
      width: 1200,
      height: 800,
      variants: [
        { src: '/images/generated/legacy-480.webp', width: 480 },
        { src: '/images/generated/legacy-1200.webp', width: 1200 },
      ],
    },
    '/images/empty-print.png': {
      width: 600,
      height: 400,
      variants: [{ src: '/images/generated/empty-print-600.webp', width: 600 }],
      printVariants: [],
    },
  },
}));

import { getOptimizedImageUrl, getPrintImageUrl, getResponsiveImageProps } from './image';

describe('responsive image assets', () => {
  it('chooses the smallest generated image meeting the requested width', () => {
    expect(getOptimizedImageUrl('/images/example.png', { width: 768 })).toBe(
      '/images/generated/example-960.webp',
    );
  });

  it('does not upscale beyond the original dimensions', () => {
    expect(getOptimizedImageUrl('/images/example.png', { width: 2400 })).toBe(
      '/images/generated/example-1600.webp',
    );
  });

  it('supplies intrinsic dimensions and responsive candidates', () => {
    expect(getResponsiveImageProps('/images/example.png', '50vw')).toEqual({
      src: '/images/generated/example-960.webp',
      width: 1600,
      height: 900,
      srcSet:
        '/images/generated/example-480.webp 480w, /images/generated/example-960.webp 960w, /images/generated/example-1600.webp 1600w',
      sizes: '50vw',
    });
  });

  it.each([
    'https://example.com/image.png',
    '//example.com/image.png',
    '/videos/hero.mp4',
    '/unknown.svg',
  ])('preserves unsupported or unknown source %s', (src) => {
    expect(getOptimizedImageUrl(src)).toBe(src);
    expect(getResponsiveImageProps(src)).toEqual({ src });
  });

  it.each([
    'https://example.com/image.png',
    '//example.com/image.png',
    '/videos/hero.mp4',
    '/unknown.svg',
  ])('preserves unsupported or unknown print source %s', (src) => {
    expect(getPrintImageUrl(src)).toBe(src);
  });
});

describe('print image assets', () => {
  it('prefers the smallest JPEG print variant meeting the requested width', () => {
    expect(getPrintImageUrl('/images/example.png', { width: 768 })).toBe(
      '/images/generated/print-example-960.jpg',
    );
  });

  it('does not upscale beyond the largest print variant', () => {
    expect(getPrintImageUrl('/images/example.png', { width: 2400 })).toBe(
      '/images/generated/print-example-1600.jpg',
    );
  });

  it('falls back to the WebP variants when an asset has no print variants', () => {
    expect(getPrintImageUrl('/images/legacy.png', { width: 768 })).toBe(
      '/images/generated/legacy-1200.webp',
    );
  });

  it('falls back to the WebP variants when print variants are empty', () => {
    expect(getPrintImageUrl('/images/empty-print.png')).toBe(
      '/images/generated/empty-print-600.webp',
    );
  });
});

interface PrintAsset {
  printVariants?: { src: string; width: number }[];
}

/*
 * The PDF path depends on these JPEGs: Skia re-encodes a WebP losslessly on the
 * way in (several times larger) while a JPEG embeds as-is. The projection test
 * only checks that a manifest key exists, so swapping a document screenshot for
 * one that was never generated would pass every test and silently inflate the
 * PDF through the WebP fallback. This is the guard for that.
 */
describe('document print assets', () => {
  const publicDirectory = fileURLToPath(new URL('../../../public', import.meta.url));

  it('gives every document image a JPEG print variant that exists on disk', async () => {
    const actual = await vi.importActual<{ default: Record<string, PrintAsset> }>(
      '@/lib/generated/images.json',
    );
    const images = actual.default;
    const documentImages = Object.entries(projectImages).flatMap(([slug, sources]) =>
      sources.map((src) => ({ slug, src })),
    );

    expect(documentImages.length).toBeGreaterThan(0);

    for (const { slug, src } of documentImages) {
      const label = `${slug} → ${src}`;
      const asset = images[src];

      expect(asset, `${label}: the image manifest records no such asset`).toBeDefined();
      if (!asset) continue;

      const printVariants = asset.printVariants ?? [];
      expect(printVariants.length, `${label}: no JPEG print variants`).toBeGreaterThan(0);

      for (const variant of printVariants) {
        expect(variant.src, `${label}: print variant is not a JPEG`).toMatch(/\.jpg$/);
        expect(
          existsSync(path.join(publicDirectory, variant.src)),
          `${label}: ${variant.src} is missing on disk — re-run pnpm generate:media`,
        ).toBe(true);
      }
    }
  });
});
