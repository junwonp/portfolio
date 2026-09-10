import { afterEach, describe, expect, it, vi } from 'vitest';
import { getVisibleImageIndex, scrollToImage } from './nativeGallery';

afterEach(() => vi.unstubAllGlobals());

describe('native gallery navigation', () => {
  it('clamps overscroll and rapid navigation to existing images', () => {
    const container = { clientWidth: 300, scrollLeft: -100, scrollTo: vi.fn() };
    expect(getVisibleImageIndex(container, 3)).toBe(0);
    container.scrollLeft = 1100;
    expect(getVisibleImageIndex(container, 3)).toBe(2);
    expect(scrollToImage(container, 99, 3)).toBe(2);
    expect(container.scrollTo).toHaveBeenLastCalledWith({ left: 600, behavior: 'smooth' });
    expect(scrollToImage(container, -1, 3)).toBe(0);
  });

  it('does not scroll empty or unmeasured galleries', () => {
    const container = { clientWidth: 0, scrollLeft: 0, scrollTo: vi.fn() };
    expect(getVisibleImageIndex(container, 0)).toBe(0);
    scrollToImage(container, 1, 0);
    expect(container.scrollTo).not.toHaveBeenCalled();
  });

  it('respects reduced motion and explicit instant positioning', () => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    const container = { clientWidth: 300, scrollLeft: 0, scrollTo: vi.fn() };
    scrollToImage(container, 1, 3);
    expect(container.scrollTo).toHaveBeenLastCalledWith({ left: 300, behavior: 'instant' });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
    scrollToImage(container, 2, 3, 'instant');
    expect(container.scrollTo).toHaveBeenLastCalledWith({ left: 600, behavior: 'instant' });
  });
});
