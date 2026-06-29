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

export default function ProjectDetailBlocks({ blocks, locale, metadata }: Props) {
  return (
    <>
      {blocks.map((block) => {
        if (block.type === "markdown") {
          return (
            <div
              key={block.id}
              dangerouslySetInnerHTML={{
                __html: renderEditableMarkdown(block.markdown),
              }}
            />
          );
        }

        if (block.type === "techStack") {
          return metadata.techStack ? (
            <ProjectTechStack
              key={block.id}
              techStack={metadata.techStack}
              locale={locale}
            />
          ) : null;
        }

        if (block.type === "achievements") {
          return (
            <ProjectAchievements
              key={block.id}
              achievements={block.achievements.map((achievement) => ({
                ...achievement,
                detail: renderEditableMarkdown(achievement.detail),
              }))}
            />
          );
        }

        if (block.type === "lightbox") {
          return (
            <ProjectLightbox
              key={block.id}
              variant={block.variant}
              images={block.images}
            />
          );
        }

        if (block.type === "mediaGallery") {
          return (
            <ImageGallery key={block.id}>
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

        return (
          <MermaidDiagram
            key={block.id}
            chart={block.chart}
            eyebrow={block.eyebrow}
            title={block.title}
          />
        );
      })}
    </>
  );
}
