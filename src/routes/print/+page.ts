import type { Component } from 'svelte';

import { GITHUB_PROFILE } from '$lib/data/constants';
import { getResumeData } from '$lib/data/resume';
import type { PostMetadata } from '$lib/types/post';

import type { PageLoad } from './$types';

interface PostModule {
  default: Component;
  metadata?: PostMetadata;
}

const allPosts = import.meta.glob<PostModule>('/src/lib/posts/*.svx');

export const load: PageLoad = async ({ data, depends }) => {
  const { locale } = data;
  depends(`locale:${locale}`);

  const resumeData = getResumeData(locale);

  const slugs: string[] = [];
  const seen = new Set<string>();

  const addSlug = (detailLink?: string) => {
    if (!detailLink) return;
    const slug = detailLink.replace('/projects/', '');
    if (!seen.has(slug)) {
      seen.add(slug);
      slugs.push(slug);
    }
  };

  for (const exp of resumeData.workExperiences) {
    for (const project of exp.project) addSlug(project.detailLink);
  }
  for (const exp of resumeData.otherExperiences) {
    for (const project of exp.project) addSlug(project.detailLink);
  }

  const posts = (
    await Promise.all(
      slugs.map(async (slug) => {
        const path = `/src/lib/posts/${slug}.${locale}.svx`;
        if (!(path in allPosts)) return null;

        const module = await allPosts[path]();
        const metadata: PostMetadata = { ...(module.metadata ?? {}) };

        if (metadata.githubLink && !metadata.githubLink.startsWith('http')) {
          metadata.githubLink = `${GITHUB_PROFILE}/${metadata.githubLink}`;
        }

        return { slug, component: module.default, metadata };
      }),
    )
  ).filter((p): p is { slug: string; component: Component; metadata: PostMetadata } => p !== null);

  return { ...data, posts };
};
