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
    },
  },
}));

import { getOptimizedImageUrl, getResponsiveImageProps } from './image';

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
});
