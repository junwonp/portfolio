import { error } from '@sveltejs/kit';

import { detailProjectSlugs, getProjectMetadata } from '$lib/content/projects';
import { GITHUB_PROFILE } from '$lib/data/constants';
import type { PostMetadata } from '$lib/types/post';

import type { PageServerLoad } from './$types';

export const prerender = false;

export const entries = () => {
  return detailProjectSlugs.map((slug) => ({ slug }));
};

export const load: PageServerLoad = async ({ params, parent }) => {
  const { slug } = params;

  const parentData = await parent();
  const locale = parentData.locale;

  const rawMetadata = getProjectMetadata(slug, locale);

  if (!rawMetadata) {
    error(404, { message: `Project "${slug}" not found in ${locale}.` });
  }

  const metadata: PostMetadata = {
    ...rawMetadata,
    githubLink:
      rawMetadata.githubLink && !rawMetadata.githubLink.startsWith('http')
        ? `${GITHUB_PROFILE}/${rawMetadata.githubLink}`
        : rawMetadata.githubLink,
  };

  return {
    metadata,
    slug,
    locale,
  };
};
