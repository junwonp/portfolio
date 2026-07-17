export interface ScrollDepthInput {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
}

export interface ArticleProgressInput {
  articleHeight: number;
  articleTop: number;
  viewportBottom: number;
}

export interface VisibleSection {
  id: string;
  label: string;
  top: number;
}

export interface ReachedSection {
  id: string;
  index: number;
  label: string;
}

const clampPercentage = (value: number): number => Math.min(Math.max(Math.round(value), 0), 100);

export const calculateScrollDepth = ({
  clientHeight,
  scrollHeight,
  scrollTop,
}: ScrollDepthInput): number => {
  const scrollableHeight = scrollHeight - clientHeight;
  if (scrollableHeight <= 0) {
    return 0;
  }

  return clampPercentage((scrollTop / scrollableHeight) * 100);
};

export const calculateArticleProgress = ({
  articleHeight,
  articleTop,
  viewportBottom,
}: ArticleProgressInput): number => {
  if (articleHeight <= 0 || viewportBottom <= articleTop) {
    return 0;
  }

  return clampPercentage(((viewportBottom - articleTop) / articleHeight) * 100);
};

export const selectFarthestVisibleSection = ({
  current,
  sections,
  viewportBottom,
}: {
  current: ReachedSection | undefined;
  sections: readonly VisibleSection[];
  viewportBottom: number;
}): ReachedSection | undefined => {
  const visibleSections = sections
    .map((section, index) => ({ ...section, index }))
    .filter((section) => section.top <= viewportBottom);
  const farthestVisible = visibleSections.at(-1);

  if (!farthestVisible) {
    return current;
  }

  if (current && current.index >= farthestVisible.index) {
    return current;
  }

  return {
    id: farthestVisible.id,
    index: farthestVisible.index,
    label: farthestVisible.label,
  };
};
