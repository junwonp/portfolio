import React from 'react';

import Badge from '@/lib/components/Badge';
import ProjectDetailBlocks from '@/lib/components/ProjectDetailBlocks';
import ProjectToc from '@/lib/components/ProjectToc';
import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import { getLabels } from '@/lib/data/labels';
import type { PostMetadata } from '@/lib/types/post';
import type { Language } from '@/lib/utils/language';

import Github from './Icon/Github';
import Globe from './Icon/Globe';
import MetricCard from './MetricCard';
import PortfolioContentLayout from './PortfolioContentLayout';
import ProjectDetailClientEffects from './ProjectDetailClientEffects';
import styles from './ProjectDetailPage.module.css';

interface Props {
  slug: string;
  locale: Language;
  metadata: PostMetadata;
  detailBlocks?: ProjectDetailBlock[];
}

export default function ProjectDetailPage({
  slug,
  locale,
  metadata,
  detailBlocks,
}: Props) {
  const labels = getLabels(locale);
  const metricColumnCount = Math.min(metadata.metrics?.length ?? 1, 4);
  const githubHref = !metadata.githubLink
    ? ''
    : metadata.githubLink.startsWith('http')
      ? metadata.githubLink
      : `https://github.com/${metadata.githubLink}`;

  const heroContent = (
    <>
      <div className={styles['hero-meta']}>
        {metadata.role && <Badge text={metadata.role} color="primary" />}
        {metadata.status && <Badge text={metadata.status} color="green" />}
        {metadata.date && <Badge text={metadata.date} color="sub" />}
      </div>

      <h1 className={styles['hero-title']}>{metadata.title || slug}</h1>

      {metadata.tagline ? (
        <p className={styles['hero-tagline']}>{metadata.tagline}</p>
      ) : (
        metadata.description && <p className={styles['hero-tagline']}>{metadata.description}</p>
      )}

      {metadata.metrics && metadata.metrics.length > 0 && (
        <dl
          className={styles['metrics-row']}
          style={
            {
              '--metric-count': metricColumnCount,
            } as React.CSSProperties
          }
        >
          {metadata.metrics.map((metric) => (
            <MetricCard key={metric.label} value={metric.value} label={metric.label} />
          ))}
        </dl>
      )}
    </>
  );

  const detailContent = detailBlocks ? (
    <ProjectDetailBlocks blocks={detailBlocks} locale={locale} metadata={metadata} />
  ) : (
    <p className={styles['error-msg']}>{labels.contentLoadError}</p>
  );

  const desktopHeader = (
    <div className={styles['topbar-links']}>
      {githubHref && (
        <a
          className={`${styles['topbar-link']} ${styles.github}`}
          href={githubHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Github width={15} height={15} />
          GitHub
        </a>
      )}
      {metadata.productLink && (
        <a
          className={`${styles['topbar-link']} ${styles.primary}`}
          href={metadata.productLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe width={15} height={15} />
          {labels.visitSite}
        </a>
      )}
    </div>
  );

  return (
    <>
      <ProjectDetailClientEffects
        githubLink={metadata.githubLink}
        productLink={metadata.productLink}
      />

      <div id="intro-header-sentinel"></div>

      <PortfolioContentLayout
        contentClassName={styles.content}
        desktopHeader={desktopHeader}
        sideNav={<ProjectToc />}
      >
        <div className={styles.hero}>
          {heroContent}
        </div>

        <article className={`project-article ${styles['project-article']}`}>
          {detailContent}
        </article>
      </PortfolioContentLayout>
    </>
  );
}
