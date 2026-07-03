'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

import type { Labels } from '@/lib/data/labels';
import { useAccordionState } from '@/lib/states/accordion';
import type { WorkExperienceProps } from '@/lib/types/about';
import { parseMarkdown } from '@/lib/utils/markdown';

import Badge from './Badge';
import styles from './CompanyCard.module.css';
import Period from './Period';
import ProjectItem from './ProjectItem';
import RichText from './RichText';

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
      toggleCompany(exp.companyName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFiltered && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleCompany(exp.companyName);
    }
  };

  const renderAdditionalLink = () =>
    exp.additional ? (
      <a
        href={exp.additional.link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles['additional-link']}
      >
        {exp.additional.label} →
      </a>
    ) : null;

  return (
    <div className={styles['company-wrapper']}>
      <div className={`${styles['company-card']} ${isCompanyOpen ? styles.open : ''}`}>
        <div
          className={styles['company-header']}
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isCompanyOpen}
        >
          <div className={styles['company-top']}>
            <div className={styles['company-left']}>
              <span className={styles['company-name']}>{exp.companyName}</span>
              <div className={styles.badges}>
                {exp.titleBadge && <Badge text={exp.titleBadge} color="primary" />}
                {!exp.dateTo && <Badge text={labels.present} color="green" />}
              </div>
            </div>
            <div className={`${styles['company-right']} ${styles['pc-only']}`}>
              <Period dateFrom={exp.dateFrom} dateTo={exp.dateTo} />
            </div>
          </div>

          <div className={styles['company-info-row']}>
            <div className={styles['role-line']}>
              <span className={styles.role}>{exp.role}</span>
              <span className={styles['role-separator']}>·</span>
              <span className={styles['period-compact']}>
                <Period dateFrom={exp.dateFrom} dateTo={exp.dateTo} />
              </span>
            </div>
            <div className={styles['expand-indicator']}>
              <span>{isCompanyOpen ? labels.hideDetails : labels.showDetails}</span>
              <ChevronDown
                size={20}
                strokeWidth={2}
                className={`${styles['chevron-icon']} ${isCompanyOpen ? styles.open : ''}`}
              />
            </div>
          </div>

          {exp.highlights && exp.highlights.length > 0 && (
            <ul className={styles.highlights}>
              {exp.highlights.map((item) => (
                <li key={item}>
                  <span className={styles.bullet} />
                  <span className={styles['highlight-text']}>
                    <RichText parts={parseMarkdown(item)} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {renderAdditionalLink()}

        {isCompanyOpen && (
          <div className={styles['project-list']}>
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
        )}
      </div>
    </div>
  );
}
