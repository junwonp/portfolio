import React from "react";

import type { ProjectDetailBlock } from "@/lib/content/editableContent";
import { renderEditableMarkdown } from "@/lib/content/editableContent";
import type { PostMetadata } from "@/lib/types/post";
import type { Language } from "@/lib/utils/language";

import ImageDescription from "./ImageDescription";
import ImageGallery from "./ImageGallery";
import MermaidDiagram from "./MermaidDiagram";
import ProjectAchievements from "./ProjectAchievements";
import ProjectLightbox from "./ProjectLightbox";
import ProjectTechStack from "./ProjectTechStack";

interface Props {
  blocks: ProjectDetailBlock[];
  locale: Language;
  metadata: PostMetadata;
}

interface ProjectDetailBlockRendererProps {
  block: ProjectDetailBlock;
  locale: Language;
  metadata: PostMetadata;
}

export function ProjectDetailBlockRenderer({
  block,
  locale,
  metadata,
}: ProjectDetailBlockRendererProps) {
  if (block.type === "markdown") {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: renderEditableMarkdown(block.markdown),
        }}
      />
    );
  }

  if (block.type === "techStack") {
    return metadata.techStack ? (
      <ProjectTechStack techStack={metadata.techStack} locale={locale} />
    ) : null;
  }

  if (block.type === "achievements") {
    return (
      <ProjectAchievements
        achievements={block.achievements.map((achievement) => ({
          ...achievement,
          detail: renderEditableMarkdown(achievement.detail),
        }))}
      />
    );
  }

  if (block.type === "lightbox") {
    return <ProjectLightbox variant={block.variant} images={block.images} />;
  }

  if (block.type === "mediaGallery") {
    return (
      <ImageGallery>
        {block.images.map((image) => (
          <ImageDescription
            key={`${image.src}:${image.alt}`}
            src={image.src}
            mobileSrc={image.mobileSrc}
            alt={image.alt}
          >
            {image.caption}
          </ImageDescription>
        ))}
      </ImageGallery>
    );
  }

  return <MermaidDiagram chart={block.chart} eyebrow={block.eyebrow} title={block.title} />;
}

export default function ProjectDetailBlocks({ blocks, locale, metadata }: Props) {
  return (
    <>
      {blocks.map((block) => (
        <ProjectDetailBlockRenderer
          key={block.id}
          block={block}
          locale={locale}
          metadata={metadata}
        />
      ))}
    </>
  );
}
