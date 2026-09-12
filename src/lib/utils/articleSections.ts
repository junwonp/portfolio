import { parseHeading, slugify } from '@/lib/utils/markdown';

export interface ArticleSection {
  id: string;
  label: string;
}

export interface ArticleHeading extends ArticleSection {
  element: HTMLElement;
}

export const ARTICLE_SELECTOR = '.project-article';

export function readArticleHeadings(article: Element): ArticleHeading[] {
  return Array.from(article.querySelectorAll<HTMLElement>('h2')).map((element, index) => {
    if (!element.id) {
      element.id = slugify(element.textContent || '', index);
    }

    const { main } = parseHeading(element.textContent || '');

    return { element, id: element.id, label: main };
  });
}

export function readArticleSections(article: Element): ArticleSection[] {
  return readArticleHeadings(article).map(({ id, label }) => ({ id, label }));
}

export function areArticleSectionsEqual(
  current: readonly ArticleSection[],
  next: readonly ArticleSection[],
): boolean {
  if (current.length !== next.length) {
    return false;
  }

  return current.every((section, index) => {
    const other = next[index];
    return section.id === other.id && section.label === other.label;
  });
}

export function getArticleElement(): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document.querySelector<HTMLElement>(ARTICLE_SELECTOR);
}
