import type React from 'react';
import dynamic from 'next/dynamic';

import type { Language } from '@/lib/utils/language';

export type ProjectMdxComponent = React.ComponentType<Record<string, unknown>>;

const createMdxComponent = (loader: () => Promise<unknown>): ProjectMdxComponent =>
  dynamic<Record<string, unknown>>(async () => {
    const mdxModule = (await loader()) as { default: ProjectMdxComponent };
    return mdxModule.default;
  });

export const projectMdxMap: Record<string, Record<Language, ProjectMdxComponent>> = {
  'agentic-workflow': {
    en: createMdxComponent(() => import('@/lib/content/projects/agentic-workflow/detail.en.mdx')),
    ko: createMdxComponent(() => import('@/lib/content/projects/agentic-workflow/detail.ko.mdx')),
  },
  aira: {
    en: createMdxComponent(() => import('@/lib/content/projects/aira/detail.en.mdx')),
    ko: createMdxComponent(() => import('@/lib/content/projects/aira/detail.ko.mdx')),
  },
  'camerafi-studio': {
    en: createMdxComponent(() => import('@/lib/content/projects/camerafi-studio/detail.en.mdx')),
    ko: createMdxComponent(() => import('@/lib/content/projects/camerafi-studio/detail.ko.mdx')),
  },
  'election-aggregator': {
    en: createMdxComponent(() => import('@/lib/content/projects/election-aggregator/detail.en.mdx')),
    ko: createMdxComponent(() => import('@/lib/content/projects/election-aggregator/detail.ko.mdx')),
  },
  'mnd-excel-viewer': {
    en: createMdxComponent(() => import('@/lib/content/projects/mnd-excel-viewer/detail.en.mdx')),
    ko: createMdxComponent(() => import('@/lib/content/projects/mnd-excel-viewer/detail.ko.mdx')),
  },
  'oneline-bank': {
    en: createMdxComponent(() => import('@/lib/content/projects/oneline-bank/detail.en.mdx')),
    ko: createMdxComponent(() => import('@/lib/content/projects/oneline-bank/detail.ko.mdx')),
  },
  'sveltekit-portfolio': {
    en: createMdxComponent(() => import('@/lib/content/projects/sveltekit-portfolio/detail.en.mdx')),
    ko: createMdxComponent(() => import('@/lib/content/projects/sveltekit-portfolio/detail.ko.mdx')),
  },
  'today-weather': {
    en: createMdxComponent(() => import('@/lib/content/projects/today-weather/detail.en.mdx')),
    ko: createMdxComponent(() => import('@/lib/content/projects/today-weather/detail.ko.mdx')),
  },
};

export const projectMdxSlugs = Object.keys(projectMdxMap);
