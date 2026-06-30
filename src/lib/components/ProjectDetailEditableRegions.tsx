'use client';

import React from 'react';

import Badge from '@/lib/components/Badge';
import EditableContentButton from '@/lib/components/EditableContentButton';
import {
  type EditableValue,
  replaceEditableArrayRange,
} from '@/lib/components/editableContentEditorModel';
import ProjectDetailBlocks, {
  ProjectDetailBlockRenderer,
} from '@/lib/components/ProjectDetailBlocks';
import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import {
  createProjectDetailBlockSections,
  stripLeadingMarkdownHeading,
} from '@/lib/content/projectDetailSections';
import { getLabels } from '@/lib/data/labels';
import type { PostMetadata } from '@/lib/types/post';
import type { Language } from '@/lib/utils/language';

import styles from './ProjectDetailPage.module.css';

interface EditableProjectHeroProps {
  locale: Language;
  metadata: PostMetadata;
  metadataByLocale?: Record<Language, PostMetadata>;
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

const toProjectDetailBlocks = (value: EditableValue): ProjectDetailBlock[] =>
  Array.isArray(value) ? (value as unknown as ProjectDetailBlock[]) : [];

const stripDisplayedSectionHeading = (blocks: ProjectDetailBlock[]): ProjectDetailBlock[] =>
  blocks
    .map((block, index) => (index === 0 ? stripLeadingMarkdownHeading(block) : block))
    .filter((block) => block.type !== 'markdown' || block.markdown.trim().length > 0);

export function EditableProjectHero({
  locale,
  metadata,
  metadataByLocale,
  slug,
}: EditableProjectHeroProps) {
  return (
    <EditableContentButton
      area="project-detail"
      initialValue={metadata.techStack ?? []}
      initialValuesByLocale={
        metadataByLocale
          ? {
              en: metadataByLocale.en.techStack ?? [],
              ko: metadataByLocale.ko.techStack ?? [],
            }
          : undefined
      }
      label="기술 스택"
      locale={locale}
      showEditorHeader={false}
      targetKey={`${slug}::techStack`}
      textareaLabel="기술 스택 수정"
    >
      {({ editor: techStackEditor, isEditing: isEditingTechStack, trigger: techStackTrigger }) => (
        <EditableContentButton
          area="project-detail"
          initialValue={metadata}
          initialValuesByLocale={metadataByLocale}
          label="프로젝트 정보"
          locale={locale}
          showEditorHeader={false}
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
  detailBlocksByLocale?: Record<Language, ProjectDetailBlock[] | undefined>;
  locale: Language;
  metadata: PostMetadata;
  slug: string;
}

export function EditableProjectArticle({
  detailBlocks,
  detailBlocksByLocale,
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

  const sections = detailBlocks ? createProjectDetailBlockSections(detailBlocks) : [];
  const getLocalizedBlocks = (targetLocale: Language): ProjectDetailBlock[] =>
    detailBlocksByLocale?.[targetLocale] ?? detailBlocks ?? [];

  return (
    <>
      {sections.length === 0 && detailContent}

      {sections.map((section) => {
        const sectionLength = section.blocks.length;
        const sectionLabel = section.heading?.text ?? '상세 콘텐츠';
        const renderBlocks = stripDisplayedSectionHeading(section.blocks);

        return (
          <EditableContentButton
            key={`${section.id}:${section.startIndex}`}
            area="project-detail"
            initialValue={section.blocks}
            initialValuesByLocale={
              detailBlocksByLocale
                ? {
                    en: getLocalizedBlocks('en').slice(
                      section.startIndex,
                      section.startIndex + sectionLength,
                    ),
                    ko: getLocalizedBlocks('ko').slice(
                      section.startIndex,
                      section.startIndex + sectionLength,
                    ),
                  }
                : undefined
            }
            label={`${sectionLabel} 수정`}
            locale={locale}
            payloadBuilder={(value, targetLocale) => {
              const localizedBlocks = getLocalizedBlocks(targetLocale);
              const nextBlocks = replaceEditableArrayRange(
                localizedBlocks as unknown as EditableValue[],
                section.startIndex,
                sectionLength,
                toProjectDetailBlocks(value) as unknown as EditableValue[],
              );

              return { blocks: nextBlocks };
            }}
            showEditorHeader={false}
            targetKey={`${slug}::blocks`}
            textareaLabel={`${sectionLabel} 수정`}
          >
            {({ editor, isEditing, trigger }) => (
              <section className={styles['editable-detail-section']}>
                <div className={styles['editable-section-heading']}>
                  {section.heading ? (
                    <h2>{section.heading.text}</h2>
                  ) : (
                    <span className={styles['section-fallback-title']}>{sectionLabel}</span>
                  )}
                  {trigger}
                </div>

                {isEditing
                  ? editor
                  : renderBlocks.map((block) => (
                      <ProjectDetailBlockRenderer
                        key={block.id}
                        block={block}
                        locale={locale}
                        metadata={metadata}
                      />
                    ))}
              </section>
            )}
          </EditableContentButton>
        );
      })}
    </>
  );
}
