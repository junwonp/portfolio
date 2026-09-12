'use client';

import React, { useId } from 'react';

import SkillGroups from '@/components/portfolio/SkillGroups';
import ArrowLink from '@/components/ui/ArrowLink';
import Collapse from '@/components/ui/Collapse';
import Period from '@/components/ui/Period';
import RichText from '@/components/ui/RichText';
import type { ProjectItem as ProjectItemType } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
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
  toggle?: { expanded: boolean; onToggle: () => void };
  titleLevel?: 3 | 4;
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
  toggle,
  titleLevel = 3,
  labels,
}: ProjectContentProps) {
  const collapseId = useId();
  const isToggleHeader = Boolean(toggle);
  const TitleTag = titleLevel === 4 ? 'h4' : 'h3';
  const { visibleSkills, hiddenSkillCount, hiddenSkillsSummary } = (() => {
    const projectSkills = sortSkills(project.skills ?? []);
    if (skillLimit === undefined) {
      return {
        visibleSkills: projectSkills,
        hiddenSkillCount: 0,
        hiddenSkillsSummary: '',
      };
    }

    const featuredSkills = project.featuredSkills ?? [];
    const featuredSet = new Set(featuredSkills);
    const remainingSkills = projectSkills.filter((skill: string) => !featuredSet.has(skill));
    const prioritized = [...featuredSkills, ...remainingSkills];

    const selected = prioritized.slice(0, skillLimit);
    const hidden = prioritized.slice(skillLimit);

    return {
      visibleSkills: sortSkills(selected),
      hiddenSkillCount: hidden.length,
      hiddenSkillsSummary: sortSkills(hidden).join(', '),
    };
  })();

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
            <SkillGroups skills={visibleSkills} />
            {hiddenSkillCount > 0 && (
              <span className={styles.moreChip} title={hiddenSkillsSummary}>
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
      <div
        className={`${styles.resumeHeader}${isToggleHeader ? ` ${styles.resumeHeaderInteractive}` : ''}`}
        {...headerProps}
      >
        {isToggleHeader ? (
          <TitleTag className={styles.resumeHeading}>
            <button
              type="button"
              className={styles.resumeToggle}
              onClick={toggle?.onToggle}
              aria-controls={collapseId}
              aria-expanded={toggle?.expanded}
            >
              <span className={styles.titleGroupInline}>
                <span className={styles.titleRow}>
                  <span className={styles.resumeTitle}>{project.title}</span>
                </span>
                <span className={styles.metaRow}>
                  {titleBadge && <span className={styles.badge}>{titleBadge}</span>}
                  <span className={styles.resumePeriod}>
                    <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
                  </span>
                </span>
              </span>
            </button>
          </TitleTag>
        ) : (
          <div className={styles.titleGroupInline}>
            <div className={styles.titleRow}>
              <TitleTag className={styles.resumeTitle}>{project.title}</TitleTag>
            </div>
            <div className={styles.metaRow}>
              {titleBadge && <span className={styles.badge}>{titleBadge}</span>}
              <span className={styles.resumePeriod}>
                <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
              </span>
            </div>
          </div>
        )}

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

      <Collapse id={collapseId} isOpen={showBody}>
        <div className={styles.resumeBody}>
          <p className={styles.resumeDescription}>
            <span>{project.description}</span>
          </p>

          {showDetails && project.detail && project.detail.length > 0 && (
            <dl className={styles.detailGrid}>
              {project.detail.map((line: string) => {
                const parsed = parseDetailLine(line);
                return (
                  <div className={styles.detailRow} key={line}>
                    {parsed.label && (
                      <dt className={styles.detailLabel}>
                        <span className={styles.labelPill}>{parsed.label}</span>
                      </dt>
                    )}
                    <dd className={styles.detailText}>
                      <RichText parts={parseMarkdown(parsed.content)} />
                    </dd>
                  </div>
                );
              })}
            </dl>
          )}

          {visibleSkills.length > 0 && (
            <div className={styles.skills}>
              <SkillGroups skills={visibleSkills} />
              {hiddenSkillCount > 0 && (
                <span className={styles.moreChip} title={hiddenSkillsSummary}>
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
