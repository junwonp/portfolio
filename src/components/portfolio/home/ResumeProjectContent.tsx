'use client';

import type { HTMLAttributes } from 'react';
import { useId } from 'react';

import ArrowLink from '@/components/ui/ArrowLink';
import Collapse from '@/components/ui/Collapse';
import Period from '@/components/ui/Period';
import RichText from '@/components/ui/RichText';
import type { ProjectItem } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
import type { ResolvedProjectSkills } from '@/lib/portfolio/projectSkills';
import { parseMarkdown } from '@/lib/utils/markdown';
import * as styles from './ProjectContent.css';
import ProjectSkillChips from './ProjectSkillChips';

interface Props {
  headerProps?: HTMLAttributes<HTMLDivElement>;
  isLinkWrapped: boolean;
  labels: Labels;
  project: ProjectItem;
  reloadDetailLink: boolean;
  resolvedSkills: ResolvedProjectSkills;
  showBody: boolean;
  showDetails: boolean;
  titleBadge?: string;
  titleLevel: 3 | 4;
  toggle?: { expanded: boolean; onToggle: () => void };
}

interface DetailLine {
  content: string;
  label: string;
}

function parseDetailLine(line: string): DetailLine {
  const match = line.match(/^\*\*\[(.*?)\]\*\*(.*)$/);
  if (match) {
    return { label: match[1], content: match[2].trim() };
  }
  return { label: '', content: line };
}

export default function ResumeProjectContent({
  headerProps,
  isLinkWrapped,
  labels,
  project,
  reloadDetailLink,
  resolvedSkills,
  showBody,
  showDetails,
  titleBadge,
  titleLevel,
  toggle,
}: Props) {
  const collapseId = useId();
  const isToggleHeader = Boolean(toggle);
  const TitleTag = titleLevel === 4 ? 'h4' : 'h3';

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

          {showDetails && project.detail.length > 0 && (
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

          <ProjectSkillChips
            visibleSkills={resolvedSkills.visibleSkills}
            hiddenSkillCount={resolvedSkills.hiddenSkillCount}
            hiddenSkillsSummary={resolvedSkills.hiddenSkillsSummary}
          />
        </div>
      </Collapse>
    </div>
  );
}
