'use client';

import React from 'react';
import Image from 'next/image';

import ArrowLink from '@/lib/components/ArrowLink';
import SkillChip from '@/lib/components/SkillChip';
import type { Labels } from '@/lib/data/labels';
import { skillState } from '@/lib/states/skills';
import type { OtherExperienceProps } from '@/lib/types/about';
import { parseMarkdown } from '@/lib/utils/markdown';

import styles from './ProjectSpotlightList.module.css';
import RichText from './RichText';

interface ProjectSpotlightListProps {
  experiences: OtherExperienceProps[];
  labels: Labels;
  skillLimit?: number;
}

export default function ProjectSpotlightList({
  experiences,
  labels,
  skillLimit = 6,
}: ProjectSpotlightListProps) {
  return (
    <div className={styles['spotlight-list']}>
      {experiences.map((experience) => {
        const project = experience.project[0];
        if (!project) return null;

        const featuredSkills = project.featuredSkills ?? [];
        const remainingSkills = skillState
          .sort(project.skills ?? [])
          .filter((skill) => !featuredSkills.includes(skill));
        const sortedSkills = [...featuredSkills, ...remainingSkills];
        const visibleSkills = sortedSkills.slice(0, skillLimit);
        const hiddenSkillCount = sortedSkills.length - visibleSkills.length;
        const metrics = project.metrics?.slice(0, 3) ?? [];

        return (
          <article
            key={project.id}
            className={`${styles.card} ${project.thumbnail ? styles['has-thumbnail'] : ''}`}
          >
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
              <div className={styles.header}>
                <div className={styles['title-group']}>
                  <h3 className={styles.title}>{project.title}</h3>
                  {experience.titleBadge && (
                    <span className={styles.badge}>{experience.titleBadge}</span>
                  )}
                </div>
                {project.detailLink && (
                  <ArrowLink
                    href={project.detailLink}
                    label={labels.viewProjectDetails}
                    className={styles.link}
                    reload
                  />
                )}
              </div>

              <p className={styles.description}>
                <RichText parts={parseMarkdown(project.description)} />
              </p>

              {metrics.length > 0 && (
                <dl className={styles.metrics}>
                  {metrics.map((metric) => (
                    <div key={metric.label} className={styles['metric-item']}>
                      <dt>{metric.label}</dt>
                      <dd>{metric.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {visibleSkills.length > 0 && (
                <div className={styles.skills}>
                  {visibleSkills.map((skill) => (
                    <SkillChip key={skill} skill={skill} readonly />
                  ))}
                  {hiddenSkillCount > 0 && (
                    <span className={styles['more-chip']}>+{hiddenSkillCount}</span>
                  )}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
