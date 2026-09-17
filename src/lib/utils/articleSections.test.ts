// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import {
  areArticleSectionsEqual,
  getArticleElement,
  readArticleHeadings,
  readArticleSections,
} from '@/lib/utils/articleSections';

function createArticle(headings: Array<{ html: string; id?: string }>): HTMLElement {
  const article = document.createElement('article');
  article.className = 'project-article';

  for (const heading of headings) {
    const h2 = document.createElement('h2');
    if (heading.id !== undefined) h2.id = heading.id;
    h2.innerHTML = heading.html;
    article.appendChild(h2);
  }

  document.body.appendChild(article);
  return article;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('readArticleHeadings', () => {
  it('assigns a slugified id to a heading that has none', () => {
    const article = createArticle([{ html: 'Hello World' }]);

    const headings = readArticleHeadings(article);

    expect(headings).toHaveLength(1);
    expect(headings[0]?.id).toBe('hello-world');
    expect(article.querySelector('h2')?.id).toBe('hello-world');
  });

  it('preserves an id that the heading already has', () => {
    const article = createArticle([{ html: 'Getting Started', id: 'custom-anchor' }]);

    const headings = readArticleHeadings(article);

    expect(headings[0]?.id).toBe('custom-anchor');
    expect(article.querySelector('h2')?.id).toBe('custom-anchor');
  });

  it('falls back to an index-based slug when the heading text slugifies to empty', () => {
    const article = createArticle([{ html: 'Alpha' }, { html: '!!!' }, { html: 'Beta' }]);

    const headings = readArticleHeadings(article);

    expect(headings[1]?.id).toBe('section-1');
    expect(article.querySelectorAll('h2')[1]?.id).toBe('section-1');
  });

  it('derives the label from the parsed heading main text', () => {
    const article = createArticle([{ html: 'Work: Recent Roles' }]);

    const headings = readArticleHeadings(article);

    expect(headings[0]?.label).toBe('Work');
  });

  it('falls back to an index-based slug and an empty label when a heading has no text', () => {
    const article = createArticle([{ html: 'Alpha' }, { html: '' }]);

    const headings = readArticleHeadings(article);

    expect(headings[1]?.id).toBe('section-1');
    expect(headings[1]?.label).toBe('');
  });

  it('returns the heading element alongside its id and label', () => {
    const article = createArticle([{ html: 'Alpha' }]);

    const headings = readArticleHeadings(article);

    expect(headings[0]?.element).toBe(article.querySelector('h2'));
  });
});

describe('readArticleSections', () => {
  it('maps headings to id and label pairs without the element reference', () => {
    const article = createArticle([{ html: 'Alpha' }, { html: 'Work: Recent Roles' }]);

    const sections = readArticleSections(article);

    expect(sections).toEqual([
      { id: 'alpha', label: 'Alpha' },
      { id: 'work-recent-roles', label: 'Work' },
    ]);
    expect(sections[0]).not.toHaveProperty('element');
  });
});

describe('areArticleSectionsEqual', () => {
  it('returns true for equal-length arrays with identical ids and labels', () => {
    const current = [
      { id: 'alpha', label: 'Alpha' },
      { id: 'beta', label: 'Beta' },
    ];

    expect(areArticleSectionsEqual(current, [...current])).toBe(true);
    expect(areArticleSectionsEqual([], [])).toBe(true);
  });

  it('returns false when the lengths differ', () => {
    const current = [{ id: 'alpha', label: 'Alpha' }];

    expect(areArticleSectionsEqual(current, [])).toBe(false);
  });

  it('returns false when an id differs', () => {
    const current = [{ id: 'alpha', label: 'Alpha' }];
    const next = [{ id: 'renamed', label: 'Alpha' }];

    expect(areArticleSectionsEqual(current, next)).toBe(false);
  });

  it('returns false when a label differs', () => {
    const current = [{ id: 'alpha', label: 'Alpha' }];
    const next = [{ id: 'alpha', label: 'Alfa' }];

    expect(areArticleSectionsEqual(current, next)).toBe(false);
  });
});

describe('getArticleElement', () => {
  it('returns null when the document has no project article', () => {
    expect(getArticleElement()).toBeNull();
  });

  it('returns the project article element when one exists', () => {
    const article = createArticle([{ html: 'Alpha' }]);

    expect(getArticleElement()).toBe(article);
  });
});
