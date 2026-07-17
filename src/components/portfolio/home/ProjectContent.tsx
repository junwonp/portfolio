'use client';

import React, { useMemo } from 'react';

import ArrowLink from '@/components/ui/ArrowLink';
import Period from '@/components/ui/Period';
import RichText from '@/components/ui/RichText';
import SkillChip from '@/components/ui/SkillChip';
import type { ProjectItem as ProjectItemType } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
import { getSkillCategory } from '@/lib/portfolio/skills';
import { parseMarkdown } from '@/lib/utils/markdown';
import { sortSkills } from '@/lib/utils/skills';

import styles from './ProjectContent.module.css';

interface ProjectContentProps {
  project: ProjectItemType;
  titleBadge?: string;
  variant: 'spotlight' | 'resume';
  skillLimit?: number;
  showBody?: boolean;
  showDetails?: boolean;
  isLinkWrapped?: boolean;
  reloadDetailLink?: boolean;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  labels: Labels;
}

export default function ProjectContent({
  project,
  titleBadge,
  variant,
  skillLimit,
  showBody = true,
  showDetails = false,
  isLinkWrapped = false,
  reloadDetailLink = false,
  headerProps,
  labels,
}: ProjectContentProps) {
  const sortedSkills = useMemo(() => {
    const projectSkills = sortSkills(project.skills ?? []);
    if (skillLimit === undefined) return projectSkills;

    const featuredSkills = project.featuredSkills ?? [];
    const remainingSkills = projectSkills.filter(
      (skill: string) => !featuredSkills.includes(skill),
    );
    return [...featuredSkills, ...remainingSkills];
  }, [project.featuredSkills, project.skills, skillLimit]);

  const visibleSkills = skillLimit === undefined ? sortedSkills : sortedSkills.slice(0, skillLimit);
  const hiddenSkillCount = sortedSkills.length - visibleSkills.length;

  const mainSkillsLabel = useMemo(() => {
    const language = sortedSkills.find((skill) => getSkillCategory(skill) === 'languages');
    const framework = sortedSkills.find((skill) => getSkillCategory(skill) === 'frameworks');
    return [language, framework].filter(Boolean).join(', ');
  }, [sortedSkills]);

  function parseDetailLine(line: string) {
    const match = line.match(/^\*\*\[(.*?)\]\*\*(.*)$/);
    if (match) {
      return { label: match[1], content: match[2].trim() };
    }
    return { label: '', content: line };
  }

  const isSpotlight = variant === 'spotlight';

  if (isSpotlight) {
    return (
      <div className={styles['spotlight-content']}>
        <div className={styles.header}>
          <div className={styles['title-group']}>
            <h3 className={styles.title}>{project.title}</h3>
            {titleBadge && <span className={styles.badge}>{titleBadge}</span>}
          </div>
          {project.detailLink && (
            <span className={styles['link-mock']}>{labels.viewProjectDetails} →</span>
          )}
        </div>

        <p className={styles.description}>
          <RichText parts={parseMarkdown(project.description)} />
        </p>



        {visibleSkills.length > 0 && (
          <div className={styles.skills}>
            {visibleSkills.map((skill) => (
              <SkillChip key={skill} skill={skill} />
            ))}
            {hiddenSkillCount > 0 && (
              <span
                className={styles['more-chip']}
                title={sortedSkills.slice(skillLimit).join(', ')}
              >
                +{hiddenSkillCount}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles['resume-content']}>
      <div className={styles['resume-header']} {...headerProps}>
        <div className={styles['title-group-inline']}>
          <div className={styles['title-row']}>
            <h3 className={styles['resume-title']}>{project.title}</h3>
          </div>
          <div className={styles['meta-row']}>
            {titleBadge && <span className={styles.badge}>{titleBadge}</span>}
            <span className={styles['resume-period']}>
              <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
            </span>
          </div>
        </div>

        {project.detailLink && (
          <div className={styles['resume-link-area']}>
            {isLinkWrapped ? (
              <span className={styles['link-mock']}>{labels.viewProjectDetails} →</span>
            ) : (
              <ArrowLink
                href={project.detailLink}
                label={labels.viewProjectDetails}
                reload={reloadDetailLink}
              />
            )}
          </div>
        )}
      </div>

      {showBody && (
        <div className={styles['resume-body']}>
          <p className={styles['resume-description']}>
            <span className={styles['description-text']}>{project.description}</span>
            {mainSkillsLabel && (
              <>
                <span className={styles['desc-separator']}>·</span>
                <span className={styles['main-skills']}>{mainSkillsLabel}</span>
              </>
            )}
          </p>



          {showDetails && project.detail && project.detail.length > 0 && (
            <div className={styles['detail-grid']}>
              {project.detail.map((line: string) => {
                const parsed = parseDetailLine(line);
                return (
                  <div className={styles['detail-row']} key={line}>
                    {parsed.label && (
                      <div className={styles['detail-label']}>
                        <span className={styles['label-pill']}>{parsed.label}</span>
                      </div>
                    )}
                    <div className={styles['detail-text']}>
                      <RichText parts={parseMarkdown(parsed.content)} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {visibleSkills.length > 0 && (
            <div className={styles.skills}>
              {visibleSkills.map((skill: string) => (
                <SkillChip key={skill} skill={skill} />
              ))}
              {hiddenSkillCount > 0 && (
                <span
                  className={styles['more-chip']}
                  title={sortedSkills.slice(skillLimit).join(', ')}
                >
                  +{hiddenSkillCount}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
