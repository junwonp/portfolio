'use client';

import { useEffect, useState } from 'react';

import {
  type ArticleSection,
  areArticleSectionsEqual,
  getArticleElement,
  readArticleSections,
} from '@/lib/utils/articleSections';

export function useArticleSections(): ArticleSection[] {
  const [sections, setSections] = useState<ArticleSection[]>([]);

  useEffect(() => {
    const article = getArticleElement();
    if (!article) {
      return;
    }

    const sync = () => {
      const next = readArticleSections(article);
      setSections((current) => (areArticleSectionsEqual(current, next) ? current : next));
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(article, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return sections;
}
