'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Period from '@/components/ui/Period';
import RichText from '@/components/ui/RichText';
import type { WorkExperienceProps } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
import Collapse from '@/components/ui/Collapse';
import { reportInteraction } from '@/components/analytics/analyticsTransport';
import { useAccordionState } from '@/lib/states/accordion';
import { parseMarkdown } from '@/lib/utils/markdown';

import * as styles from './CompanyCard.css';
import ProjectItem from './ProjectItem';

interface Props {
  exp: WorkExperienceProps;
  isFiltered: boolean;
  labels: Labels;
}

export default function CompanyCard({ exp, isFiltered, labels }: Props) {
  const { hasCompany, toggleCompany } = useAccordionState();
  const isCompanyOpen = hasCompany(exp.companyName) || isFiltered;

  const handleToggle = () => {
    if (!isFiltered) {
      reportInteraction({
        interactionType: 'accordion_company',
        interactionLabel: exp.companyName,
        action: isCompanyOpen ? 'close' : 'open',
      });
      toggleCompany(exp.companyName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFiltered && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      reportInteraction({
        interactionType: 'accordion_company',
        interactionLabel: exp.companyName,
        action: isCompanyOpen ? 'close' : 'open',
      });
      toggleCompany(exp.companyName);
    }
  };

  const renderAdditionalLink = () =>
    exp.additional ? (
      <a
        href={exp.additional.link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.additionalLink}
      >
        {exp.additional.label} →
      </a>
    ) : null;

  return (
    <div className={styles.companyWrapper}>
      <div className={`${styles.companyCard} ${isCompanyOpen ? styles.open : ''}`}>
        <div
          className={styles.companyHeader}
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isCompanyOpen}
        >
          <div className={styles.companyTop}>
            <div className={styles.companyLeft}>
              <span className={styles.companyName}>{exp.companyName}</span>
              <div className={styles.badges}>
                {exp.titleBadge && <Badge text={exp.titleBadge} color="primary" />}
                {!exp.dateTo && <Badge text={labels.present} color="green" />}
              </div>
            </div>
            <div className={`${styles.companyRight} ${styles.pcOnly}`}>
              <Period dateFrom={exp.dateFrom} dateTo={exp.dateTo} />
            </div>
          </div>

          <div className={styles.companyInfoRow}>
            <div className={styles.roleLine}>
              <span className={styles.role}>{exp.role}</span>
              <span className={styles.roleSeparator}>·</span>
              <span className={styles.periodCompact}>
                <Period dateFrom={exp.dateFrom} dateTo={exp.dateTo} />
              </span>
            </div>
            <div className={styles.expandIndicator}>
              <span>{isCompanyOpen ? labels.hideDetails : labels.showDetails}</span>
              <ChevronDown
                size={20}
                strokeWidth={2}
                className={`${styles.chevronIcon} ${isCompanyOpen ? styles.open : ''}`}
              />
            </div>
          </div>

          {exp.highlights && exp.highlights.length > 0 && (
            <ul className={styles.highlights}>
              {exp.highlights.map((item) => (
                <li key={item}>
                  <span className={styles.bullet} />
                  <span className={styles.highlightText}>
                    <RichText parts={parseMarkdown(item)} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {renderAdditionalLink()}

        <Collapse isOpen={isCompanyOpen}>
          <div className={styles.projectList}>
            {exp.project.map((project) => (
              <ProjectItem
                key={`${project.id}:${project.title}`}
                project={project}
                companyName={exp.companyName}
                detailsMode="compact"
                isFiltered={isFiltered}
                labels={labels}
              />
            ))}
          </div>
        </Collapse>
      </div>
    </div>
  );
}
