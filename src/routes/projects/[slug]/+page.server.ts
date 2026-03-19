import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';

import { GITHUB_PROFILE } from '$lib/data/constants';
import type { PostMetadata } from '$lib/types/post';

import type { PageServerLoad } from './$types';

export const prerender = false;

interface PostModule {
  default: Component;
  metadata?: PostMetadata;
}

const posts: Record<string, PostModule> = import.meta.glob<PostModule>('/src/lib/posts/*.svx', {
  eager: true,
});

export const entries = () => {
  const slugs = new Set<string>();

  Object.keys(posts).forEach((path) => {
    const slugMatch = path.match(/\/([^/]+)\.(ko|en)\.svx$/);
    if (slugMatch) {
      slugs.add(slugMatch[1]);
    }
  });

  return Array.from(slugs).map((slug) => ({ slug }));
};

export const load: PageServerLoad = async ({ params, parent }) => {
  const { slug } = params;

  const parentData = await parent();
  const locale = parentData.locale;

  const langSpecificPath = `/src/lib/posts/${slug}.${locale}.svx`;

  if (!(langSpecificPath in posts)) {
    error(404, { message: `Project "${slug}" not found in ${locale}.` });
  }

  const postModule = posts[langSpecificPath];
  const metadata: PostMetadata = postModule.metadata ?? {};

  if (metadata.githubLink && !metadata.githubLink.startsWith('http')) {
    metadata.githubLink = `${GITHUB_PROFILE}/${metadata.githubLink}`;
  }

  return {
    metadata,
    slug,
    locale,
  };
};
