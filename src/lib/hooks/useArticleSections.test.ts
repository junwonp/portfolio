// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useArticleSections } from '@/lib/hooks/useArticleSections';

function mountArticle(headings: string[]): HTMLElement {
  const article = document.createElement('article');
  article.className = 'project-article';

  for (const heading of headings) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    article.appendChild(h2);
  }

  document.body.appendChild(article);
  return article;
}

async function mutateArticle(mutate: () => void): Promise<void> {
  await act(async () => {
    mutate();
    // MutationObserver callbacks are microtasks; a macrotask tick flushes them.
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

afterEach(() => {
  // Vitest globals are off, so RTL's auto-cleanup never registers; unmount explicitly.
  cleanup();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('useArticleSections', () => {
  it('reads the sections of an existing project article on mount', () => {
    mountArticle(['Alpha', 'Work: Recent Roles']);

    const { result } = renderHook(() => useArticleSections());

    expect(result.current).toEqual([
      { id: 'alpha', label: 'Alpha' },
      { id: 'work-recent-roles', label: 'Work' },
    ]);
  });

  it('updates the result when the observed article gains a heading', async () => {
    const article = mountArticle(['Alpha']);

    const { result } = renderHook(() => useArticleSections());
    expect(result.current).toHaveLength(1);

    const added = document.createElement('h2');
    added.textContent = 'Beta';
    await mutateArticle(() => {
      article.appendChild(added);
    });

    expect(result.current).toEqual([
      { id: 'alpha', label: 'Alpha' },
      { id: 'beta', label: 'Beta' },
    ]);
  });

  it('keeps the same state reference when a mutation changes no sections', async () => {
    const article = mountArticle(['Alpha']);

    const { result } = renderHook(() => useArticleSections());
    const before = result.current;

    await mutateArticle(() => {
      article.appendChild(document.createElement('p'));
    });

    expect(result.current).toBe(before);
  });

  it('disconnects the observer when the component unmounts', () => {
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    mountArticle(['Alpha']);

    const { unmount } = renderHook(() => useArticleSections());
    unmount();

    expect(disconnect).toHaveBeenCalled();
  });

  it('stays empty when the document has no project article', () => {
    document.body.innerHTML = '';

    const { result } = renderHook(() => useArticleSections());

    expect(result.current).toEqual([]);
  });
});
