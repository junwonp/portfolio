'use client';

import React from 'react';

import Badge from '@/lib/components/Badge';
import EditableContentButton from '@/lib/components/EditableContentButton';
import ProjectDetailBlocks from '@/lib/components/ProjectDetailBlocks';
import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import { getLabels } from '@/lib/data/labels';
import type { PostMetadata } from '@/lib/types/post';
import type { Language } from '@/lib/utils/language';

import styles from './ProjectDetailPage.module.css';

interface EditableProjectHeroProps {
  locale: Language;
  metadata: PostMetadata;
  slug: string;
}

function ProjectHeroContent({ metadata, slug }: EditableProjectHeroProps) {
  const metricColumnCount = Math.min(metadata.metrics?.length ?? 1, 4);

  return (
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
          className={`${styles['metrics-row']} ${
            metricColumnCount === 4 ? styles['has-four-metrics'] : ''
          }`}
          style={
            {
              '--metric-count': metricColumnCount,
            } as React.CSSProperties
          }
        >
          {metadata.metrics.map((metric) => (
            <div key={metric.label} className={styles.metric}>
              <dt className={styles['metric-lbl']}>{metric.label}</dt>
              <dd className={styles['metric-val']}>{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}

export function EditableProjectHero({ locale, metadata, slug }: EditableProjectHeroProps) {
  return (
    <EditableContentButton
      area="project-detail"
      initialValue={metadata.techStack ?? []}
      label="기술 스택"
      locale={locale}
      targetKey={`${slug}::techStack`}
      textareaLabel="기술 스택 수정"
    >
      {({ editor: techStackEditor, isEditing: isEditingTechStack, trigger: techStackTrigger }) => (
        <EditableContentButton
          area="project-detail"
          initialValue={metadata}
          label="프로젝트 정보"
          locale={locale}
          targetKey={`${slug}::metadata`}
          textareaLabel="프로젝트 정보 수정"
        >
          {({ editor: heroEditor, isEditing: isEditingHero, trigger: heroTrigger }) => (
            <>
              <div className={styles['editor-toolbar']}>
                {heroTrigger}
                {techStackTrigger}
              </div>
              {isEditingHero ? (
                heroEditor
              ) : (
                <>
                  {isEditingTechStack && techStackEditor}
                  <ProjectHeroContent locale={locale} metadata={metadata} slug={slug} />
                </>
              )}
            </>
          )}
        </EditableContentButton>
      )}
    </EditableContentButton>
  );
}

interface EditableProjectArticleProps {
  detailBlocks?: ProjectDetailBlock[];
  locale: Language;
  metadata: PostMetadata;
  slug: string;
}

export function EditableProjectArticle({
  detailBlocks,
  locale,
  metadata,
  slug,
}: EditableProjectArticleProps) {
  const labels = getLabels(locale);
  const detailContent = detailBlocks ? (
    <ProjectDetailBlocks blocks={detailBlocks} locale={locale} metadata={metadata} />
  ) : (
    <p className={styles['error-msg']}>{labels.contentLoadError}</p>
  );

  return (
    <EditableContentButton
      area="project-detail"
      initialValue={detailBlocks ?? []}
      label="상세 콘텐츠"
      locale={locale}
      targetKey={`${slug}::blocks`}
      textareaLabel="상세 콘텐츠 수정"
    >
      {({ editor, isEditing, trigger }) => (
        <>
          <div className={styles['editor-toolbar']}>{trigger}</div>
          {isEditing ? editor : detailContent}
        </>
      )}
    </EditableContentButton>
  );
}
