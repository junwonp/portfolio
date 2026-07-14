import type { PostMetadata } from '@/lib/types/post';

export interface ProjectDetailAchievement {
  accent?: boolean;
  detail: string;
  tag: string;
  title: string;
}

export interface ProjectDetailImage {
  alt: string;
  caption?: string;
  height?: number;
  mobileSrc?: string;
  src: string;
  width?: number;
}

export type ProjectDetailBlock =
  | {
      id: string;
      markdown: string;
      type: 'markdown';
    }
  | {
      id: string;
      type: 'techStack';
    }
  | {
      achievements: ProjectDetailAchievement[];
      id: string;
      type: 'achievements';
    }
  | {
      id: string;
      images: ProjectDetailImage[];
      type: 'lightbox';
      variant?: 'default' | 'phone';
    }
  | {
      id: string;
      images: ProjectDetailImage[];
      type: 'mediaGallery';
    }
  | {
      chart: string;
      eyebrow?: string;
      id: string;
      title: string;
      type: 'mermaid';
    };

export interface ProjectDetailContent {
  blocks: ProjectDetailBlock[];
  metadata: PostMetadata;
}

export interface ProjectDetailContentOverride {
  blocks?: ProjectDetailBlock[];
  metadata?: Partial<PostMetadata>;
  techStack?: string[];
}
