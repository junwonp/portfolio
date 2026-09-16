import React from 'react';

import PortfolioContentLayout from '@/components/portfolio/layout/PortfolioContentLayout';
import ProjectToc from '@/components/portfolio/project-detail/ProjectToc';
import Github from '@/components/ui/icon/Github';
import Globe from '@/components/ui/icon/Globe';
import OutboundLink from '@/components/ui/OutboundLink';
import { circleButton, pillButton } from '@/components/ui/surface.css';
import { getLabels } from '@/lib/portfolio/labels';
import type { PostMetadata } from '@/lib/portfolio/projectTypes';
import type { Language } from '@/lib/utils/language';

import ProjectBackButton from './ProjectBackButton';
import ProjectDetailClientEffects from './ProjectDetailClientEffects';
import * as styles from './ProjectDetailPage.css';
import ProjectHero from './ProjectHero';

interface Props {
  children: React.ReactNode;
  slug: string;
  locale: Language;
  metadata: PostMetadata;
}

export default function ProjectDetailPage({ children, slug, locale, metadata }: Props) {
  const labels = getLabels(locale);
  const metricColumnCount = Math.min(metadata.metrics?.length ?? 1, 4);
  const githubHref = !metadata.githubLink
    ? ''
    : metadata.githubLink.startsWith('http')
      ? metadata.githubLink
      : `https://github.com/${metadata.githubLink}`;

  const desktopHeader = (
    <nav className={styles.topbarLinks} aria-label="Project links">
      <ProjectBackButton
        label={labels.goBack}
        className={`${circleButton} glass-effect ${styles.backCircle}`}
      />
      <div className={styles.topbarRight}>
        {githubHref && (
          <OutboundLink
            className={`${styles.topbarLink} ${pillButton} ${styles.github}`}
            href={githubHref}
            ariaLabel="GitHub"
          >
            <Github width={15} height={15} />
            GitHub
          </OutboundLink>
        )}
        {metadata.productLink && (
          <OutboundLink
            className={`${styles.topbarLink} ${pillButton} ${styles.primary}`}
            href={metadata.productLink}
          >
            <Globe width={15} height={15} />
            {labels.visitSite}
          </OutboundLink>
        )}
      </div>
    </nav>
  );

  return (
    <>
      <ProjectDetailClientEffects
        githubLink={metadata.githubLink}
        productLink={metadata.productLink}
      />

      <div id="intro-header-sentinel" aria-hidden="true" />

      <PortfolioContentLayout
        contentClassName={styles.content}
        desktopHeader={desktopHeader}
        sideNav={<ProjectToc />}
      >
        <header className={styles.hero}>
          <ProjectHero metadata={metadata} metricColumnCount={metricColumnCount} slug={slug} />
        </header>

        <article className={`project-article ${styles.projectArticle}`}>{children}</article>
      </PortfolioContentLayout>
    </>
  );
}
