'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

import EditableContentButton from '@/lib/components/EditableContentButton';
import type { EditableValue } from '@/lib/components/editableContentEditorModel';
import type { Labels } from '@/lib/data/labels';
import { useAccordionState } from '@/lib/states/accordion';
import type { ProjectItem as ProjectItemType, WorkExperienceProps } from '@/lib/types/about';
import { type Language,SUPPORTED_LANGUAGES } from '@/lib/utils/language';
import { parseMarkdown } from '@/lib/utils/markdown';

import Badge from './Badge';
import styles from './CompanyCard.module.css';
import Period from './Period';
import ProjectItem from './ProjectItem';
import RichText from './RichText';

interface Props {
  editorConfig?: {
    allExperiences: WorkExperienceProps[];
    allExperiencesByLocale: Record<Language, WorkExperienceProps[]>;
    companyIndex: number;
    locale: Language;
  };
  exp: WorkExperienceProps;
  isFiltered: boolean;
  labels: Labels;
}

const normalizeCompanyForEditor = (exp: WorkExperienceProps): EditableValue =>
  ({
    companyName: exp.companyName,
    titleBadge: exp.titleBadge ?? '',
    role: exp.role,
    dateFrom: exp.dateFrom,
    dateTo: exp.dateTo ?? '',
    highlights: exp.highlights ?? [],
    project: exp.project,
  }) as unknown as EditableValue;

const normalizeProjectForEditor = (project: ProjectItemType): EditableValue =>
  ({
    id: project.id,
    title: project.title,
    description: project.description,
    dateFrom: project.dateFrom,
    dateTo: project.dateTo ?? '',
    detailLink: project.detailLink ?? '',
    detail: project.detail,
    featuredSkills: project.featuredSkills ?? [],
    skills: project.skills ?? [],
    metrics: project.metrics ?? [],
  }) as unknown as EditableValue;

const createProjectDraft = (companyName: string, projectCount: number): EditableValue => ({
  id: `${companyName || 'company'}-project-${projectCount + 1}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, ''),
  title: '',
  description: '',
  dateFrom: '',
  dateTo: '',
  detailLink: '',
  detail: [],
  featuredSkills: [],
  skills: [],
  metrics: [],
});

export default function EditableCompanyCard({ editorConfig, exp, isFiltered, labels }: Props) {
  const { hasCompany, toggleCompany } = useAccordionState();

  const isCompanyOpen = hasCompany(exp.companyName) || isFiltered;
  const editableCompany = editorConfig?.allExperiences[editorConfig.companyIndex];

  const getEditableCompany = (targetLocale: Language): WorkExperienceProps | undefined =>
    editorConfig?.allExperiencesByLocale[targetLocale]?.[editorConfig.companyIndex];

  const buildCompanyPayload = (value: EditableValue, targetLocale: Language) => {
    if (!editorConfig) return [];

    const allExperiences = editorConfig.allExperiencesByLocale[targetLocale] ?? [];
    const targetCompany = getEditableCompany(targetLocale);
    if (!targetCompany) return allExperiences;

    return allExperiences.map((item, index) =>
      index === editorConfig.companyIndex
        ? {
            ...(value as unknown as WorkExperienceProps),
            ...(targetCompany.additional ? { additional: targetCompany.additional } : {}),
            project: targetCompany.project,
          }
        : item,
    );
  };

  const buildProjectPayload = (
    value: EditableValue,
    projectIndex: number,
    targetLocale: Language,
  ) => {
    if (!editorConfig) return [];

    const allExperiences = editorConfig.allExperiencesByLocale[targetLocale] ?? [];

    return allExperiences.map((item, index) =>
      index === editorConfig.companyIndex
        ? {
            ...item,
            project: item.project.map((project, nestedIndex) =>
              nestedIndex === projectIndex ? (value as unknown as ProjectItemType) : project,
            ),
          }
        : item,
    );
  };

  const buildAddProjectPayload = (value: EditableValue, targetLocale: Language) => {
    if (!editorConfig) return [];

    const allExperiences = editorConfig.allExperiencesByLocale[targetLocale] ?? [];

    return allExperiences.map((item, index) =>
      index === editorConfig.companyIndex
        ? {
            ...item,
            project: [...item.project, value as unknown as ProjectItemType],
          }
        : item,
    );
  };

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

  const renderCompanyHeader = (
    companyEditTrigger?: React.ReactNode,
    projectAddTrigger?: React.ReactNode,
  ) => (
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
          {(companyEditTrigger || projectAddTrigger) && (
            <div
              className={styles['company-admin-actions']}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {companyEditTrigger}
              {projectAddTrigger}
            </div>
          )}
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
  );

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

  const renderProjectList = (projectAddEditor?: React.ReactNode, isAddingProject = false) => {
    if (!isCompanyOpen && !isAddingProject) return null;

    return (
      <div className={styles['project-list']}>
        {isAddingProject && (
          <div className={styles['project-inline-editor']}>{projectAddEditor}</div>
        )}
        {exp.project.map((project) => {
          const projectIndex =
            editableCompany?.project.findIndex(
              (item) => item.id === project.id || item.title === project.title,
            ) ?? -1;
          const editableProject =
            projectIndex >= 0 ? editableCompany?.project[projectIndex] : undefined;

          if (editorConfig && editableProject && projectIndex >= 0) {
            return (
              <EditableContentButton
                key={`${project.id}:${project.title}`}
                area="home"
                initialValue={normalizeProjectForEditor(editableProject)}
                initialValuesByLocale={Object.fromEntries(
                  SUPPORTED_LANGUAGES.map((targetLocale) => {
                    const localizedProject =
                      getEditableCompany(targetLocale)?.project[projectIndex] ?? editableProject;

                    return [targetLocale, normalizeProjectForEditor(localizedProject)];
                  }),
                ) as Record<Language, EditableValue>}
                label="프로젝트 수정"
                locale={editorConfig.locale}
                payloadBuilder={(value, targetLocale) =>
                  buildProjectPayload(value, projectIndex, targetLocale)
                }
                stopPropagation
                targetKey="workExperiences"
                textareaLabel="프로젝트 수정"
              >
                {({ editor, isEditing, trigger }) => (
                  <ProjectItem
                    companyName={exp.companyName}
                    editTrigger={trigger}
                    editor={editor}
                    isEditing={isEditing}
                    isFiltered={isFiltered}
                    labels={labels}
                    project={project}
                  />
                )}
              </EditableContentButton>
            );
          }

          return (
            <ProjectItem
              key={`${project.id}:${project.title}`}
              project={project}
              companyName={exp.companyName}
              isFiltered={isFiltered}
              labels={labels}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles['company-wrapper']}>
      <div className={`${styles['company-card']} ${isCompanyOpen ? styles.open : ''}`}>
        {editorConfig && editableCompany ? (
          <EditableContentButton
            area="home"
            initialValue={createProjectDraft(
              editableCompany.companyName,
              editableCompany.project.length,
            )}
            initialValuesByLocale={Object.fromEntries(
              SUPPORTED_LANGUAGES.map((targetLocale) => {
                const localizedCompany = getEditableCompany(targetLocale) ?? editableCompany;

                return [
                  targetLocale,
                  createProjectDraft(localizedCompany.companyName, localizedCompany.project.length),
                ];
              }),
            ) as Record<Language, EditableValue>}
            label="프로젝트 추가"
            locale={editorConfig.locale}
            payloadBuilder={buildAddProjectPayload}
            stopPropagation
            targetKey="workExperiences"
            textareaLabel="프로젝트 추가"
            triggerKind="add"
          >
            {({ editor: projectAddEditor, isEditing: isAddingProject, trigger: projectAddTrigger }) => (
              <EditableContentButton
                area="home"
                hiddenFields={['project']}
                initialValue={normalizeCompanyForEditor(editableCompany)}
                initialValuesByLocale={Object.fromEntries(
                  SUPPORTED_LANGUAGES.map((targetLocale) => [
                    targetLocale,
                    normalizeCompanyForEditor(getEditableCompany(targetLocale) ?? editableCompany),
                  ]),
                ) as Record<Language, EditableValue>}
                label="경력 수정"
                locale={editorConfig.locale}
                payloadBuilder={buildCompanyPayload}
                stopPropagation
                targetKey="workExperiences"
                textareaLabel="경력 수정"
              >
                {({ editor: companyEditor, isEditing: isEditingCompany, trigger: companyEditTrigger }) => (
                  <>
                    {isEditingCompany ? (
                      <div className={styles['company-inline-editor']}>{companyEditor}</div>
                    ) : (
                      <>
                        {renderCompanyHeader(companyEditTrigger, projectAddTrigger)}
                        {renderAdditionalLink()}
                      </>
                    )}
                    {renderProjectList(projectAddEditor, isAddingProject)}
                  </>
                )}
              </EditableContentButton>
            )}
          </EditableContentButton>
        ) : (
          <>
            {renderCompanyHeader()}
            {renderAdditionalLink()}
            {renderProjectList()}
          </>
        )}
      </div>
    </div>
  );
}
