interface ScrollContainer {
  clientWidth: number;
  scrollLeft: number;
  scrollTo: (options: ScrollToOptions) => void;
}

function boundIndex(index: number, count: number): number {
  return Math.max(0, Math.min(Math.round(index), count - 1));
}

export function getVisibleImageIndex(
  container: Pick<ScrollContainer, 'clientWidth' | 'scrollLeft'>,
  count: number,
): number {
  if (!container.clientWidth || count < 1) return 0;
  return boundIndex(container.scrollLeft / container.clientWidth, count);
}

export function scrollToImage(
  container: ScrollContainer,
  index: number,
  count: number,
  behavior: ScrollBehavior = 'smooth',
): number {
  const nextIndex = boundIndex(index, count);
  if (!container.clientWidth || count < 1) return nextIndex;
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  container.scrollTo({
    left: nextIndex * container.clientWidth,
    behavior: reducedMotion ? 'instant' : behavior,
  });
  return nextIndex;
}
