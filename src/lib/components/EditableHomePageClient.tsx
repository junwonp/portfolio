'use client';

import type { ReactNode } from 'react';
import React from 'react';

import BentoSkills from '@/lib/components/BentoSkills';
import DesktopSideNav from '@/lib/components/DesktopSideNav';
import EditableContentButton from '@/lib/components/EditableContentButton';
import type { EditableValue } from '@/lib/components/editableContentEditorModel';
import EditableWorkAccordion from '@/lib/components/EditableWorkAccordion';
import type { HomePageData } from '@/lib/components/HomePage';
import PortfolioContentLayout from '@/lib/components/PortfolioContentLayout';
import ProjectSpotlightList from '@/lib/components/ProjectSpotlightList';
import SectionHeader from '@/lib/components/SectionHeader';

import styles from './HomePage.module.css';

interface EditableHomePageClientProps {
  data: HomePageData;
  educationSection: ReactNode;
  introSection: ReactNode;
  mobileHeader: ReactNode;
}

const createWorkExperienceDraft = (): EditableValue => ({
  companyName: '',
  titleBadge: '',
  role: '',
  dateFrom: '',
  dateTo: '',
  highlights: [],
  project: [],
});

export default function EditableHomePageClient({
  data,
  educationSection,
  introSection,
  mobileHeader,
}: EditableHomePageClientProps) {
  const isAdminEditor = data.isAdminEditor === true;
  const labels = data.labels;
  const resumeData = data.resumeData;
  const featuredWebProjects = data.featuredWebProjects;
  const featuredProjectsTitle =
    data.featuredProjectsMode === 'role-fit'
      ? labels.sectionFeaturedProjects
      : labels.sectionSelectedProjects;
  const navSections = data.navSections;

  const filteredWork = resumeData.workExperiences;
  const filteredProjects = resumeData.otherExperiences;
  const filteredArchives = resumeData.archives;

  return (
    <PortfolioContentLayout
      contentClassName={styles['main-content']}
      mobileHeader={mobileHeader}
      sideNav={<DesktopSideNav sections={navSections} />}
    >
      {introSection}

      <div className={styles['content-wrapper']}>
        {filteredWork.length > 0 && (
          <>
            {featuredWebProjects.length > 0 && (
              <section id="section-featured" className={styles['fade-slide-enter']}>
                <div className={styles['section-heading-row']}>
                  <SectionHeader title={featuredProjectsTitle} />
                </div>
                <ProjectSpotlightList
                  experiences={featuredWebProjects}
                  labels={labels}
                  variant="spotlight"
                  skillLimit={6}
                />
              </section>
            )}

            <section id="section-work" className={styles['fade-slide-enter']}>
              {isAdminEditor ? (
                <EditableContentButton
                  area="home"
                  hiddenFields={['project']}
                  initialValue={createWorkExperienceDraft()}
                  initialValuesByLocale={{
                    en: createWorkExperienceDraft(),
                    ko: createWorkExperienceDraft(),
                  }}
                  label="경력 추가"
                  locale={data.locale}
                  payloadBuilder={(value, targetLocale) => [
                    ...data.resumeDataByLocale[targetLocale].workExperiences,
                    value,
                  ]}
                  showEditorHeader={false}
                  targetKey="workExperiences"
                  textareaLabel="경력 추가"
                  triggerKind="add"
                >
                  {({ editor, isEditing, trigger }) => (
                    <>
                      <div className={styles['section-heading-row']}>
                        <SectionHeader title={labels.sectionWork} />
                        {trigger}
                      </div>
                      {isEditing && editor}
                      <EditableWorkAccordion
                        editorConfig={{
                          allExperiences: resumeData.workExperiences,
                          allExperiencesByLocale: {
                            en: data.resumeDataByLocale.en.workExperiences,
                            ko: data.resumeDataByLocale.ko.workExperiences,
                          },
                          locale: data.locale,
                        }}
                        experiences={filteredWork}
                        locale={data.locale}
                      />
                    </>
                  )}
                </EditableContentButton>
              ) : (
                <>
                  <div className={styles['section-heading-row']}>
                    <SectionHeader title={labels.sectionWork} />
                  </div>
                  <EditableWorkAccordion
                    editorConfig={{
                      allExperiences: resumeData.workExperiences,
                      allExperiencesByLocale: {
                        en: data.resumeDataByLocale.en.workExperiences,
                        ko: data.resumeDataByLocale.ko.workExperiences,
                      },
                      locale: data.locale,
                    }}
                    experiences={filteredWork}
                    locale={data.locale}
                  />
                </>
              )}
            </section>
          </>
        )}

        <section id="section-skills" className={styles['fade-slide-enter']}>
          {isAdminEditor ? (
            <EditableContentButton
              area="home"
              initialValue={resumeData.skills}
              initialValuesByLocale={{
                en: data.resumeDataByLocale.en.skills,
                ko: data.resumeDataByLocale.ko.skills,
              }}
              label="스킬"
              locale={data.locale}
              showEditorHeader={false}
              targetKey="skills"
              textareaLabel="스킬 수정"
            >
              {({ editor, isEditing, trigger }) => (
                <>
                  <div className={styles['section-heading-row']}>
                    <SectionHeader title={labels.sectionSkills} />
                    {trigger}
                  </div>
                  {isEditing
                    ? editor
                    : resumeData.skills && (
                        <BentoSkills locale={data.locale} skills={resumeData.skills} />
                      )}
                </>
              )}
            </EditableContentButton>
          ) : (
            <>
              <div className={styles['section-heading-row']}>
                <SectionHeader title={labels.sectionSkills} />
              </div>
              {resumeData.skills && <BentoSkills locale={data.locale} skills={resumeData.skills} />}
            </>
          )}
        </section>

        {filteredProjects.length > 0 && (
          <section id="section-projects" className={styles['fade-slide-enter']}>
            {isAdminEditor ? (
              <EditableContentButton
                area="home"
                initialValue={resumeData.otherExperiences}
                initialValuesByLocale={{
                  en: data.resumeDataByLocale.en.otherExperiences,
                  ko: data.resumeDataByLocale.ko.otherExperiences,
                }}
                label="프로젝트"
                locale={data.locale}
                showEditorHeader={false}
                targetKey="otherExperiences"
                textareaLabel="프로젝트 수정"
              >
                {({ editor, isEditing, trigger }) => (
                  <>
                    <div className={styles['section-heading-row']}>
                      <SectionHeader title={labels.sectionAwards} />
                      {trigger}
                    </div>
                    {isEditing ? (
                      editor
                    ) : (
                      <ProjectSpotlightList
                        experiences={filteredProjects}
                        labels={labels}
                        variant="resume"
                      />
                    )}
                  </>
                )}
              </EditableContentButton>
            ) : (
              <>
                <div className={styles['section-heading-row']}>
                  <SectionHeader title={labels.sectionAwards} />
                </div>
                <ProjectSpotlightList
                  experiences={filteredProjects}
                  labels={labels}
                  variant="resume"
                />
              </>
            )}
          </section>
        )}

        {filteredArchives.length > 0 && (
          <section id="section-archives" className={styles['fade-slide-enter']}>
            {isAdminEditor ? (
              <EditableContentButton
                area="home"
                initialValue={resumeData.archives}
                initialValuesByLocale={{
                  en: data.resumeDataByLocale.en.archives,
                  ko: data.resumeDataByLocale.ko.archives,
                }}
                label="아카이브"
                locale={data.locale}
                showEditorHeader={false}
                targetKey="archives"
                textareaLabel="아카이브 수정"
              >
                {({ editor, isEditing, trigger }) => (
                  <>
                    <div className={styles['section-heading-row']}>
                      <SectionHeader title={labels.sectionArchives} />
                      {trigger}
                    </div>
                    {isEditing ? (
                      editor
                    ) : (
                      <ProjectSpotlightList
                        experiences={filteredArchives}
                        labels={labels}
                        variant="resume"
                      />
                    )}
                  </>
                )}
              </EditableContentButton>
            ) : (
              <>
                <div className={styles['section-heading-row']}>
                  <SectionHeader title={labels.sectionArchives} />
                </div>
                <ProjectSpotlightList
                  experiences={filteredArchives}
                  labels={labels}
                  variant="resume"
                />
              </>
            )}
          </section>
        )}

        {educationSection}
      </div>
    </PortfolioContentLayout>
  );
}
