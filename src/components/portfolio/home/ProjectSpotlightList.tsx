'use client';

import React from 'react';
import Image from 'next/image';

import ProjectContent from '@/components/portfolio/home/ProjectContent';
import { cardSurface } from "@/components/ui/surface.css";
import type { OtherExperienceProps } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';

import * as styles from './ProjectSpotlightList.css';

interface ProjectSpotlightListProps {
  experiences: OtherExperienceProps[];
  labels: Labels;
  variant?: 'spotlight' | 'resume';
  skillLimit?: number;
}

export default function ProjectSpotlightList({
  experiences,
  labels,
  skillLimit,
  variant = 'spotlight',
}: ProjectSpotlightListProps) {
  const isSpotlight = variant === 'spotlight';
  const effectiveSkillLimit = isSpotlight ? (skillLimit ?? 6) : skillLimit;

  return (
    <div className={isSpotlight ? styles.spotlightList : styles.resumeList}>
      {experiences.map((experience) => {
        const project = experience.project[0];
        if (!project) return null;

        if (isSpotlight) {
          const cardContent = (
            <>
              {project.thumbnail && (
                <div
                  className={`${styles.thumbnailFrame} ${
                    project.thumbnail.kind === 'icon'
                      ? styles.thumbnailFrameIcon
                      : styles.thumbnailFrameScreenshot
                  }`}
                >
                  <Image
                    src={project.thumbnail.src}
                    alt={project.thumbnail.alt}
                    fill
                    sizes="(max-width: 768px) 88px, 144px"
                    className={`${styles.thumbnail} ${
                      project.thumbnail.kind === 'icon'
                        ? styles.thumbnailIcon
                        : styles.thumbnailScreenshot
                    }`}
                  />
                </div>
              )}

              <div className={styles.body}>
                <ProjectContent
                  project={project}
                  titleBadge={experience.titleBadge}
                  variant="spotlight"
                  skillLimit={effectiveSkillLimit}
                  labels={labels}
                />
              </div>
            </>
          );

          if (project.detailLink) {
            return (
              <a
                key={project.id}
                href={project.detailLink}
                className={`${styles.card} ${cardSurface} ${styles.isLink} ${project.thumbnail ? styles.hasThumbnail : ''}`}
                data-project-link-card="true"
                data-project-surface="spotlight"
              >
                {cardContent}
              </a>
            );
          }

          return (
            <div
              key={project.id}
              className={`${styles.card} ${cardSurface} ${project.thumbnail ? styles.hasThumbnail : ''}`}
              data-project-surface="spotlight"
            >
              {cardContent}
            </div>
          );
        }

        return (
          <div
            key={project.id}
            className={styles.resumeRow}
            data-project-surface="resume"
          >
            <ProjectContent
              project={project}
              titleBadge={experience.titleBadge}
              variant="resume"
              skillLimit={effectiveSkillLimit}
              showDetails={false}
              isLinkWrapped={false}
              reloadDetailLink
              labels={labels}
            />
          </div>
        );
      })}
    </div>
  );
}
