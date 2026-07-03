import React from 'react';

import Badge from '@/lib/components/Badge';
import ProjectDetailBlocks from '@/lib/components/ProjectDetailBlocks';
import {
  EditableProjectArticle,
  EditableProjectHero,
} from '@/lib/components/ProjectDetailEditableRegions';
import ProjectToc from '@/lib/components/ProjectToc';
import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import { getLabels } from '@/lib/data/labels';
import type { PostMetadata } from '@/lib/types/post';
import type { Language } from '@/lib/utils/language';

import Github from './Icon/Github';
import Globe from './Icon/Globe';
import MetricCard from './MetricCard';
import ProjectDetailClientEffects from './ProjectDetailClientEffects';
import styles from './ProjectDetailPage.module.css';

interface Props {
  slug: string;
  locale: Language;
  metadata: PostMetadata;
  detailBlocks?: ProjectDetailBlock[];
  projectContentByLocale: Record<
    Language,
    {
      detailBlocks?: ProjectDetailBlock[];
      metadata: PostMetadata;
    }
  >;
  isAdminEditor?: boolean;
}

export default function ProjectDetailPage({
  slug,
  locale,
  metadata,
  detailBlocks,
  projectContentByLocale,
  isAdminEditor = false,
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

  return (
    <>
      <ProjectDetailClientEffects
        githubLink={metadata.githubLink}
        productLink={metadata.productLink}
      />

      <div id="intro-header-sentinel"></div>

      {/* Desktop-only sticky header with back link and project links */}
      <header className={styles['project-topbar']}>
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
      </header>

      <div className={styles.layout}>
        <div className={styles['nav-wrapper']}>
          <ProjectToc />
        </div>

        <div className={styles['main-content']}>
          <div className={styles.content}>
            {/* Hero */}
            <div className={styles.hero}>
              {isAdminEditor ? (
                <EditableProjectHero
                  locale={locale}
                  metadata={metadata}
                  metadataByLocale={{
                    en: projectContentByLocale.en.metadata,
                    ko: projectContentByLocale.ko.metadata,
                  }}
                  slug={slug}
                />
              ) : (
                heroContent
              )}
            </div>

            <article className={`project-article ${styles['project-article']}`}>
              {isAdminEditor ? (
                <EditableProjectArticle
                  detailBlocks={detailBlocks}
                  detailBlocksByLocale={{
                    en: projectContentByLocale.en.detailBlocks,
                    ko: projectContentByLocale.ko.detailBlocks,
                  }}
                  locale={locale}
                  metadata={metadata}
                  slug={slug}
                />
              ) : (
                detailContent
              )}
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
