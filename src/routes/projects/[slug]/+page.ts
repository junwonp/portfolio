import type { Component } from 'svelte';

import type { PostMetadata } from '$lib/types/post';

import type { PageLoad } from './$types';

interface PostModule {
  default: Component;
  metadata?: PostMetadata;
}

const posts = import.meta.glob<PostModule>('/src/lib/content/projects/*/detail.*.svx');

export const load: PageLoad = async ({ data, depends }) => {
  const { slug, locale } = data;

  depends(`locale:${locale}`);

  const langSpecificPath = `/src/lib/content/projects/${slug}/detail.${locale}.svx`;
  const postModuleLoader = posts[langSpecificPath] as (() => Promise<PostModule>) | undefined;

  if (!postModuleLoader) {
    throw new Error(`Project "${slug}" not found in ${locale}.`);
  }

  const postModule = await postModuleLoader();

  return {
    ...data,
    component: postModule.default,
  };
};
