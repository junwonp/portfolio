import type { MDXProps } from 'mdx/types';
import type { ComponentType } from 'react';

import type { PostMetadata } from '@/lib/portfolio/projectTypes';
import type { Language } from '@/lib/utils/language';

interface ProjectDetailMdxProps extends MDXProps {
  locale: Language;
  metadata: PostMetadata;
}

export type ProjectDetailMdxComponent = ComponentType<ProjectDetailMdxProps>;
