import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';

import { GITHUB_PROFILE } from '$lib/data/constants';
import type { Language } from '$lib/utils/language';

import type { PageServerLoad } from './$types';

export const prerender = false;

export const entries = () => {
  const posts = import.meta.glob<PostModule>('/src/lib/posts/*.svx', {
    eager: true,
  });

  const slugs = new Set<string>();

  Object.keys(posts).forEach((path) => {
    const slugMatch = path.match(/\/([^/]+)\.(ko|en)\.svx$/);
    if (slugMatch) {
      slugs.add(slugMatch[1]);
    }
  });

  return Array.from(slugs).map((slug) => ({ slug }));
};

export interface PostMetadata {
  name?: string;
  title?: string;
  description?: string;
  role?: string;
  tagline?: string;
  date?: string;
  image?: string;
  githubLink?: string;
  productLink?: string;
  [key: string]: unknown;
}

interface PostModule {
  default: Component;
  metadata?: PostMetadata;
}

const posts: Record<string, PostModule> = import.meta.glob<PostModule>('/src/lib/posts/*.svx', {
  eager: true,
});

export const load: PageServerLoad = async ({ params, parent }) => {
  const { slug } = params;

  const parentData = await parent();
  const locale = parentData.locale as Language;

  const langSpecificPath = `/src/lib/posts/${slug}.${locale}.svx`;

  if (!(langSpecificPath in posts)) {
    error(404, { message: `Project "${slug}" not found in ${locale}.` });
  }

  const postModule = posts[langSpecificPath];
  const metadata: PostMetadata = postModule.metadata || {};

  if (metadata.githubLink && !metadata.githubLink.startsWith('http')) {
    metadata.githubLink = `${GITHUB_PROFILE}/${metadata.githubLink}`;
  }

  return {
    metadata,
    slug,
    locale,
  };
};
