import { flushSync, tick } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import ImageGalleryWrapper from '$test/ImageGalleryWrapper.svelte';

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true });
}

function getPager(container: HTMLElement) {
  return container.querySelector('.pager');
}

function getGallery(container: HTMLElement) {
  return container.querySelector('.image-gallery') as HTMLElement;
}

function getSlider(container: HTMLElement) {
  return container.querySelector('.slider-container') as HTMLElement;
}

describe('ImageGallery', () => {
  afterEach(() => {
    setViewport(1024);
  });

  describe('desktop mode (≥768px)', () => {
    beforeEach(() => {
      setViewport(1024);
    });

    it('does not apply .mobile class', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();
      expect(getGallery(container)).not.toHaveClass('mobile');
    });

    it('renders children without a slider container', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();
      expect(container.querySelector('.slider-container')).toBeNull();
    });

    it('does not show pager', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();
      expect(getPager(container)).toBeNull();
    });
  });

  describe('mobile mode (<768px)', () => {
    beforeEach(() => {
      setViewport(375);
    });

    it('applies .mobile class', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();
      expect(getGallery(container)).toHaveClass('mobile');
    });

    it('renders a slider container', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();
      expect(getSlider(container)).toBeInTheDocument();
    });

    it('shows pager with correct count when there are multiple items', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();
      flushSync();
      expect(getPager(container)).toBeInTheDocument();
      expect(getPager(container)?.textContent).toBe('1/3');
    });

    it('does not show pager for a single item', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 1 });
      await tick();
      flushSync();
      expect(getPager(container)).toBeNull();
    });

    it('sets aria-label on gallery when multiple items', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();
      flushSync();
      expect(getGallery(container)).toHaveAttribute('aria-label', 'Image gallery');
    });

    it('does not set aria-label for single item', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 1 });
      await tick();
      flushSync();
      expect(getGallery(container)).not.toHaveAttribute('aria-label');
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(() => {
      setViewport(375);
    });

    it('advances to next slide on ArrowRight', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      await fireEvent.keyDown(getGallery(container), { key: 'ArrowRight' });
      flushSync();

      expect(getPager(container)?.textContent).toBe('2/3');
    });

    it('goes back to previous slide on ArrowLeft', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      await fireEvent.keyDown(getGallery(container), { key: 'ArrowRight' });
      flushSync();
      await fireEvent.keyDown(getGallery(container), { key: 'ArrowLeft' });
      flushSync();

      expect(getPager(container)?.textContent).toBe('1/3');
    });

    it('does not go below index 0', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      await fireEvent.keyDown(getGallery(container), { key: 'ArrowLeft' });
      flushSync();

      expect(getPager(container)?.textContent).toBe('1/3');
    });

    it('does not go past the last index', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      await fireEvent.keyDown(getGallery(container), { key: 'ArrowRight' });
      flushSync();
      await fireEvent.keyDown(getGallery(container), { key: 'ArrowRight' });
      flushSync();
      await fireEvent.keyDown(getGallery(container), { key: 'ArrowRight' }); // extra — no-op
      flushSync();

      expect(getPager(container)?.textContent).toBe('3/3');
    });
  });

  describe('mouse drag navigation', () => {
    beforeEach(() => {
      setViewport(375);
    });

    it('advances to next on left drag > 50px', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      await fireEvent.mouseDown(getSlider(container), { clientX: 200 });
      await fireEvent.mouseMove(window, { clientX: 140 }); // diff = -60 → next
      await fireEvent.mouseUp(window);
      flushSync();

      expect(getPager(container)?.textContent).toBe('2/3');
    });

    it('goes back to previous on right drag > 50px', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      await fireEvent.keyDown(getGallery(container), { key: 'ArrowRight' });
      flushSync();

      await fireEvent.mouseDown(getSlider(container), { clientX: 100 });
      await fireEvent.mouseMove(window, { clientX: 160 }); // diff = +60 → prev
      await fireEvent.mouseUp(window);
      flushSync();

      expect(getPager(container)?.textContent).toBe('1/3');
    });

    it('does not navigate on short drag (< 50px)', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      await fireEvent.mouseDown(getSlider(container), { clientX: 200 });
      await fireEvent.mouseMove(window, { clientX: 170 }); // diff = -30 → no-op
      await fireEvent.mouseUp(window);
      flushSync();

      expect(getPager(container)?.textContent).toBe('1/3');
    });

    it('cleans up after mouseup even when cursor leaves the slider', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      await fireEvent.mouseDown(getSlider(container), { clientX: 200 });
      await fireEvent.mouseMove(window, { clientX: 140 });
      await fireEvent.mouseUp(window); // released outside slider
      flushSync();

      // A second drag should still work correctly
      await fireEvent.mouseDown(getSlider(container), { clientX: 200 });
      await fireEvent.mouseMove(window, { clientX: 140 });
      await fireEvent.mouseUp(window);
      flushSync();

      expect(getPager(container)?.textContent).toBe('3/3');
    });
  });

  describe('touch drag navigation', () => {
    beforeEach(() => {
      setViewport(375);
    });

    function createTouchEvent(type: string, clientX: number, target: Element): TouchEvent {
      const touch = new Touch({ identifier: 0, target, clientX, clientY: 0 });
      return new TouchEvent(type, {
        touches: type === 'touchend' ? [] : [touch],
        changedTouches: [touch],
        bubbles: true,
        cancelable: true,
      });
    }

    it('advances to next on left swipe > 50px', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      const slider = getSlider(container);
      slider.dispatchEvent(createTouchEvent('touchstart', 200, slider));
      slider.dispatchEvent(createTouchEvent('touchmove', 140, slider));
      slider.dispatchEvent(createTouchEvent('touchend', 140, slider));
      flushSync();

      expect(getPager(container)?.textContent).toBe('2/3');
    });

    it('goes back to previous on right swipe > 50px', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      await fireEvent.keyDown(getGallery(container), { key: 'ArrowRight' });
      flushSync();

      const slider = getSlider(container);
      slider.dispatchEvent(createTouchEvent('touchstart', 100, slider));
      slider.dispatchEvent(createTouchEvent('touchmove', 160, slider));
      slider.dispatchEvent(createTouchEvent('touchend', 160, slider));
      flushSync();

      expect(getPager(container)?.textContent).toBe('1/3');
    });

    it('does not navigate on short swipe (< 50px)', async () => {
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      const slider = getSlider(container);
      slider.dispatchEvent(createTouchEvent('touchstart', 200, slider));
      slider.dispatchEvent(createTouchEvent('touchmove', 170, slider));
      slider.dispatchEvent(createTouchEvent('touchend', 170, slider));
      flushSync();

      expect(getPager(container)?.textContent).toBe('1/3');
    });

    it('ignores touch events in desktop mode', async () => {
      setViewport(1024);
      const { container } = render(ImageGalleryWrapper, { imageCount: 3 });
      await tick();

      // On desktop there is no slider, so nothing to swipe
      expect(container.querySelector('.slider-container')).toBeNull();
      expect(getPager(container)).toBeNull();
    });
  });
});
