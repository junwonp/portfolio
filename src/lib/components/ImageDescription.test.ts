import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ImageDescriptionWrapper from '$test/ImageDescriptionWrapper.svelte';

import ImageDescription from './ImageDescription.svelte';

// jsdom does not implement IntersectionObserver — provide a no-op stub
const observeMock = vi.fn();
const disconnectMock = vi.fn();

beforeEach(() => {
  observeMock.mockClear();
  disconnectMock.mockClear();

  globalThis.IntersectionObserver = class {
    observe = observeMock;
    disconnect = disconnectMock;
    unobserve = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

describe('ImageDescription', () => {
  describe('image rendering', () => {
    it('renders an <img> for a standard image src', async () => {
      const { container } = render(ImageDescription, { src: '/images/photo.png', alt: 'A photo' });
      await tick();
      expect(container.querySelector('img')).toBeInTheDocument();
      expect(container.querySelector('video')).toBeNull();
    });

    it('sets src and alt on the <img>', async () => {
      const { container } = render(ImageDescription, { src: '/images/photo.png', alt: 'A photo' });
      await tick();
      const img = container.querySelector('img') as HTMLImageElement;
      expect(img.getAttribute('src')).toBe('/images/photo.png');
      expect(img.getAttribute('alt')).toBe('A photo');
    });
  });

  describe('video rendering', () => {
    it.each(['.mp4', '.webm', '.mov', '.avi', '.m4v'])(
      'renders a <video> for %s extension',
      async (ext) => {
        const { container } = render(ImageDescription, {
          src: `/videos/demo${ext}`,
          alt: 'A demo',
        });
        await tick();
        expect(container.querySelector('video')).toBeInTheDocument();
        expect(container.querySelector('img')).toBeNull();
      },
    );

    it('is case-insensitive for video extensions', async () => {
      const { container } = render(ImageDescription, { src: '/videos/demo.MP4', alt: 'A demo' });
      await tick();
      expect(container.querySelector('video')).toBeInTheDocument();
    });

    it('attaches an IntersectionObserver to the video element', async () => {
      render(ImageDescription, { src: '/videos/demo.mp4', alt: 'A demo' });
      await tick();
      expect(observeMock).toHaveBeenCalledOnce();
    });
  });

  describe('mobileSrc', () => {
    it('renders a <picture> with a <source> when mobileSrc is provided', async () => {
      const { container } = render(ImageDescription, {
        src: '/images/desktop.png',
        alt: 'Desktop',
        mobileSrc: '/images/mobile.png',
      });
      await tick();
      const picture = container.querySelector('picture');
      expect(picture).toBeInTheDocument();
      const source = (picture as HTMLElement).querySelector('source') as HTMLSourceElement;
      expect(source).toBeInTheDocument();
      expect(source.getAttribute('srcset')).toBe('/images/mobile.png');
      expect(source.getAttribute('media')).toBe('(max-width: 768px)');
    });

    it('renders a plain <img> (no <picture>) when mobileSrc is not provided', async () => {
      const { container } = render(ImageDescription, {
        src: '/images/photo.png',
        alt: 'Photo',
      });
      await tick();
      expect(container.querySelector('picture')).toBeNull();
      expect(container.querySelector('img')).toBeInTheDocument();
    });
  });

  describe('priority prop', () => {
    it('sets loading="eager" when priority is true', async () => {
      const { container } = render(ImageDescription, {
        src: '/images/hero.png',
        alt: 'Hero',
        priority: true,
      });
      await tick();
      expect((container.querySelector('img') as HTMLImageElement).getAttribute('loading')).toBe(
        'eager',
      );
    });

    it('sets loading="lazy" when priority is false (default)', async () => {
      const { container } = render(ImageDescription, {
        src: '/images/below-fold.png',
        alt: 'Below fold',
      });
      await tick();
      expect((container.querySelector('img') as HTMLImageElement).getAttribute('loading')).toBe(
        'lazy',
      );
    });
  });

  describe('figcaption', () => {
    it('renders a <figcaption> when children are provided', async () => {
      const { container } = render(ImageDescriptionWrapper, {
        src: '/images/photo.png',
        alt: 'Photo',
        caption: 'This is a caption',
      });
      await tick();
      const figcaption = container.querySelector('figcaption');
      expect(figcaption).toBeInTheDocument();
      expect(figcaption).toHaveTextContent('This is a caption');
    });

    it('does not render a <figcaption> when no children are provided', async () => {
      const { container } = render(ImageDescription, {
        src: '/images/photo.png',
        alt: 'Photo',
      });
      await tick();
      expect(container.querySelector('figcaption')).toBeNull();
    });
  });
});
