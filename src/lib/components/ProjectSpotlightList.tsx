'use client';

import React from 'react';
import Image from 'next/image';

import SkillChip from '@/lib/components/SkillChip';
import type { Labels } from '@/lib/data/labels';
import type { OtherExperienceProps } from '@/lib/types/about';
import { parseMarkdown } from '@/lib/utils/markdown';
import { sortSkills } from '@/lib/utils/skills';

import MetricCard from './MetricCard';
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
        const remainingSkills = sortSkills(project.skills ?? [])
          .filter((skill: string) => !featuredSkills.includes(skill));
        const sortedSkills = [...featuredSkills, ...remainingSkills];
        const visibleSkills = sortedSkills.slice(0, skillLimit);
        const hiddenSkillCount = sortedSkills.length - visibleSkills.length;
        const metrics = project.metrics?.slice(0, 3) ?? [];

        return (
          <a
            key={project.id}
            href={project.detailLink ?? '#'}
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
                  <span className={styles['link-mock']}>
                    {labels.viewProjectDetails} →
                  </span>
                )}
              </div>

              <p className={styles.description}>
                <RichText parts={parseMarkdown(project.description)} />
              </p>

              {metrics.length > 0 && (
                <dl className={styles.metrics}>
                  {metrics.map((metric) => (
                    <MetricCard
                      key={metric.label}
                      value={metric.value}
                      label={metric.label}
                    />
                  ))}
                </dl>
              )}

              {visibleSkills.length > 0 && (
                <div className={styles.skills}>
                  {visibleSkills.map((skill: string) => (
                    <SkillChip key={skill} skill={skill} />
                  ))}
                  {hiddenSkillCount > 0 && (
                    <span className={styles['more-chip']}>+{hiddenSkillCount}</span>
                  )}
                </div>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}
