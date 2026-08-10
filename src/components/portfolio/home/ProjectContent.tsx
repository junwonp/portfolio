'use client';

import React from 'react';

import ArrowLink from '@/components/ui/ArrowLink';
import Collapse from '@/components/ui/Collapse';
import Period from '@/components/ui/Period';
import RichText from '@/components/ui/RichText';
import SkillChip from '@/components/ui/SkillChip';
import type { ProjectItem as ProjectItemType } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
import { getSkillCategory } from '@/lib/portfolio/skills';
import { parseMarkdown } from '@/lib/utils/markdown';
import { sortSkills } from '@/lib/utils/skills';

import * as styles from './ProjectContent.css';

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

function parseDetailLine(line: string) {
  const match = line.match(/^\*\*\[(.*?)\]\*\*(.*)$/);
  if (match) {
    return { label: match[1], content: match[2].trim() };
  }
  return { label: '', content: line };
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
  const sortedSkills = (() => {
    const projectSkills = sortSkills(project.skills ?? []);
    if (skillLimit === undefined) return projectSkills;

    const featuredSkills = project.featuredSkills ?? [];
    const featuredSet = new Set(featuredSkills);
    const remainingSkills = projectSkills.filter(
      (skill: string) => !featuredSet.has(skill),
    );
    return [...featuredSkills, ...remainingSkills];
  })();

  const visibleSkills = skillLimit === undefined ? sortedSkills : sortedSkills.slice(0, skillLimit);
  const hiddenSkillCount = sortedSkills.length - visibleSkills.length;

  const language = sortedSkills.find((skill) => getSkillCategory(skill) === 'languages');
  const framework = sortedSkills.find((skill) => getSkillCategory(skill) === 'frameworks');
  const mainSkillsLabel = [language, framework].filter(Boolean).join(', ');


  const isSpotlight = variant === 'spotlight';

  if (isSpotlight) {
    return (
      <div className={styles.spotlightContent}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h3 className={styles.title}>{project.title}</h3>
            {titleBadge && <span className={styles.badge}>{titleBadge}</span>}
          </div>
          {project.detailLink && (
            <span className={styles.linkMock}>{labels.viewProjectDetails} →</span>
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
                className={styles.moreChip}
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
    <div className={styles.resumeContent}>
      <div className={styles.resumeHeader} {...headerProps}>
        <div className={styles.titleGroupInline}>
          <div className={styles.titleRow}>
            <h3 className={styles.resumeTitle}>{project.title}</h3>
          </div>
          <div className={styles.metaRow}>
            {titleBadge && <span className={styles.badge}>{titleBadge}</span>}
            <span className={styles.resumePeriod}>
              <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
            </span>
          </div>
        </div>

        {project.detailLink && (
          <div className={styles.resumeLinkArea}>
            {isLinkWrapped ? (
              <span className={styles.linkMock}>{labels.viewProjectDetails} →</span>
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

      <Collapse isOpen={showBody}>
          <div className={styles.resumeBody}>
            <p className={styles.resumeDescription}>
              <span>{project.description}</span>
              {mainSkillsLabel && (
                <>
                  <span className={styles.descSeparator}>·</span>
                  <span className={styles.mainSkills}>{mainSkillsLabel}</span>
                </>
              )}
            </p>

            {showDetails && project.detail && project.detail.length > 0 && (
              <div className={styles.detailGrid}>
                {project.detail.map((line: string) => {
                  const parsed = parseDetailLine(line);
                  return (
                    <div className={styles.detailRow} key={line}>
                      {parsed.label && (
                        <div className={styles.detailLabel}>
                          <span className={styles.labelPill}>{parsed.label}</span>
                        </div>
                      )}
                      <div className={styles.detailText}>
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
                    className={styles.moreChip}
                    title={sortedSkills.slice(skillLimit).join(', ')}
                  >
                    +{hiddenSkillCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </Collapse>
    </div>
  );
}
