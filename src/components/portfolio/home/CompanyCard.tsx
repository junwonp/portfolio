'use client';

import { ChevronDown } from 'lucide-react';
import { useId } from 'react';

import Badge from '@/components/ui/Badge';
import Collapse from '@/components/ui/Collapse';
import OutboundLink from '@/components/ui/OutboundLink';
import Period from '@/components/ui/Period';
import RichText from '@/components/ui/RichText';
import { cardSurface } from '@/components/ui/surface.css';
import { reportInteraction } from '@/lib/analytics/analyticsTransport';
import type { WorkExperienceProps } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
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
  const collapseId = useId();

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

  const renderAdditionalLink = () =>
    exp.additional ? (
      <OutboundLink href={exp.additional.link} className={styles.additionalLink}>
        {exp.additional.label} →
      </OutboundLink>
    ) : null;

  return (
    <li className={styles.companyWrapper}>
      <div className={`${styles.companyCard} ${cardSurface} ${isCompanyOpen ? styles.open : ''}`}>
        <h3 className={styles.companyHeading}>
          <button
            type="button"
            className={styles.companyHeader}
            onClick={handleToggle}
            aria-controls={collapseId}
            aria-expanded={isCompanyOpen}
          >
            <span className={styles.companyTop}>
              <span className={styles.companyLeft}>
                <span className={styles.companyName}>{exp.companyName}</span>
                <span className={styles.badges}>
                  {exp.titleBadge && <Badge text={exp.titleBadge} color="primary" />}
                  {!exp.dateTo && <Badge text={labels.present} color="green" />}
                </span>
              </span>
              <span className={`${styles.companyRight} ${styles.pcOnly}`}>
                <Period dateFrom={exp.dateFrom} dateTo={exp.dateTo} />
              </span>
            </span>

            <span className={styles.companyInfoRow}>
              <span className={styles.roleLine}>
                <span className={styles.role}>{exp.role}</span>
                <span className={styles.roleSeparator}>·</span>
                <span className={styles.periodCompact}>
                  <Period dateFrom={exp.dateFrom} dateTo={exp.dateTo} />
                </span>
              </span>
              <span className={styles.expandIndicator}>
                <span>{isCompanyOpen ? labels.hideDetails : labels.showDetails}</span>
                <ChevronDown
                  size={20}
                  strokeWidth={2}
                  className={`${styles.chevronIcon} ${isCompanyOpen ? styles.open : ''}`}
                />
              </span>
            </span>
          </button>
        </h3>

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

        {renderAdditionalLink()}

        <Collapse id={collapseId} isOpen={isCompanyOpen}>
          <ul className={styles.projectList}>
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
          </ul>
        </Collapse>
      </div>
    </li>
  );
}
