'use client';

import React from 'react';
import Image from 'next/image';

import ProjectContent from '@/lib/components/ProjectContent';
import type { Labels } from '@/lib/data/labels';
import type { OtherExperienceProps } from '@/lib/types/about';

import styles from './ProjectSpotlightList.module.css';

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
    <div className={isSpotlight ? styles['spotlight-list'] : styles['resume-list']}>
      {experiences.map((experience) => {
        const project = experience.project[0];
        if (!project) return null;

        if (isSpotlight) {
          const cardContent = (
            <>
              {project.thumbnail && (
                <div
                  className={`${styles['thumbnail-frame']} ${
                    project.thumbnail.kind === 'icon'
                      ? styles['thumbnail-frame-icon']
                      : styles['thumbnail-frame-screenshot']
                  }`}
                >
                  <Image
                    src={project.thumbnail.src}
                    alt={project.thumbnail.alt}
                    fill
                    sizes="(max-width: 768px) 88px, 144px"
                    className={`${styles.thumbnail} ${
                      project.thumbnail.kind === 'icon'
                        ? styles['thumbnail-icon']
                        : styles['thumbnail-screenshot']
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
                className={`${styles.card} ${styles['is-link']} ${project.thumbnail ? styles['has-thumbnail'] : ''}`}
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
              className={`${styles.card} ${project.thumbnail ? styles['has-thumbnail'] : ''}`}
              data-project-surface="spotlight"
            >
              {cardContent}
            </div>
          );
        }

        return (
          <div
            key={project.id}
            className={styles['resume-row']}
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
