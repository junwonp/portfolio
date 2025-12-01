import type { Component } from 'svelte';

import type { PageLoad } from './$types';

interface PostModule {
  default: Component;
  metadata?: unknown;
}

const posts = import.meta.glob<PostModule>('/src/lib/posts/*.svx');

export const load: PageLoad = async ({ data, depends }) => {
  const { slug, locale } = data;

  depends(`locale:${locale}`);

  const langSpecificPath = `/src/lib/posts/${slug}.${locale}.svx`;
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
