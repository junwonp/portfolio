import { describe, expect, it, vi } from 'vitest';

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
