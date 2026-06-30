'use client';

import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';

import BentoSkills from '@/lib/components/BentoSkills';
import BottomSkillBar from '@/lib/components/BottomSkillBar';
import DesktopSideNav from '@/lib/components/DesktopSideNav';
import EditableContentButton from '@/lib/components/EditableContentButton';
import type { EditableValue } from '@/lib/components/editableContentEditorModel';
import ExperienceList from '@/lib/components/ExperienceList';
import type { HomePageData } from '@/lib/components/HomePage';
import SectionHeader from '@/lib/components/SectionHeader';
import WorkAccordion from '@/lib/components/WorkAccordion';
import { useSkillState } from '@/lib/states/skills';

import styles from './HomePage.module.css';

interface HomePageClientProps {
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

export default function HomePageClient({
  data,
  educationSection,
  introSection,
  mobileHeader,
}: HomePageClientProps) {
  const {
    selectedTechs,
    isEmpty: isSkillStateEmpty,
    isPanelOpen: isSkillPanelOpen,
    close: closeSkillState,
  } = useSkillState();
  const [bottomBarHeight, setBottomBarHeight] = useState(0);

  const isAdminEditor = data.isAdminEditor === true;
  const labels = data.labels;
  const resumeData = data.resumeData;
  const featuredWebProjects = data.featuredWebProjects;
  const navSections = data.navSections;

  const filteredWork = useMemo(() => {
    if (isSkillStateEmpty) return resumeData.workExperiences;
    return resumeData.workExperiences
      .map((exp) => ({
        ...exp,
        project: exp.project.filter((p) => selectedTechs.every((tech) => p.skills?.includes(tech))),
      }))
      .filter((exp) => exp.project.length > 0);
  }, [isSkillStateEmpty, selectedTechs, resumeData.workExperiences]);

  const filteredProjects = useMemo(() => {
    if (isSkillStateEmpty) return resumeData.otherExperiences;
    return resumeData.otherExperiences.filter((exp) =>
      exp.project.some((p) => selectedTechs.every((tech) => p.skills?.includes(tech))),
    );
  }, [isSkillStateEmpty, selectedTechs, resumeData.otherExperiences]);

  const filteredArchives = useMemo(() => {
    if (isSkillStateEmpty) return resumeData.archives;
    return resumeData.archives.filter((exp) =>
      exp.project.some((p) => selectedTechs.every((tech) => p.skills?.includes(tech))),
    );
  }, [isSkillStateEmpty, selectedTechs, resumeData.archives]);

  const isAllEmpty = useMemo(() => {
    return (
      !isSkillStateEmpty &&
      filteredWork.length === 0 &&
      filteredProjects.length === 0 &&
      filteredArchives.length === 0
    );
  }, [isSkillStateEmpty, filteredWork, filteredProjects, filteredArchives]);

  return (
    <article
      style={{
        paddingBottom: isSkillPanelOpen ? `${bottomBarHeight + 64}px` : '0px',
        transition: 'padding-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {mobileHeader}

      <div className={`${styles.layout} ${isSkillPanelOpen ? styles['is-selection-mode'] : ''}`}>
        {!isSkillPanelOpen && (
          <div className={styles['nav-wrapper']}>
            <DesktopSideNav sections={navSections} />
          </div>
        )}

        <div className={styles['main-content']}>
          {!isSkillPanelOpen && introSection}

          <div className={styles['content-wrapper']}>
            {filteredWork.length > 0 && (
              <>
                {!isSkillPanelOpen && featuredWebProjects.length > 0 && (
                  <section id="section-featured" className={styles['fade-slide-enter']}>
                    <div className={styles['section-heading-row']}>
                      <SectionHeader title={labels.sectionFeaturedProjects} />
                    </div>
                    <ExperienceList
                      experiences={featuredWebProjects}
                      labels={labels}
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
                          <WorkAccordion
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
                      <WorkAccordion experiences={filteredWork} locale={data.locale} />
                    </>
                  )}
                </section>
              </>
            )}

            {!isSkillPanelOpen && (
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
                    {resumeData.skills && (
                      <BentoSkills locale={data.locale} skills={resumeData.skills} />
                    )}
                  </>
                )}
              </section>
            )}

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
                        {isEditing ? editor : <ExperienceList experiences={filteredProjects} labels={labels} />}
                      </>
                    )}
                  </EditableContentButton>
                ) : (
                  <>
                    <div className={styles['section-heading-row']}>
                      <SectionHeader title={labels.sectionAwards} />
                    </div>
                    <ExperienceList experiences={filteredProjects} labels={labels} />
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
                        {isEditing ? editor : <ExperienceList experiences={filteredArchives} labels={labels} />}
                      </>
                    )}
                  </EditableContentButton>
                ) : (
                  <>
                    <div className={styles['section-heading-row']}>
                      <SectionHeader title={labels.sectionArchives} />
                    </div>
                    <ExperienceList experiences={filteredArchives} labels={labels} />
                  </>
                )}
              </section>
            )}

            {!isSkillPanelOpen && educationSection}

            {isAllEmpty && (
              <div className={styles['empty-state']}>
                <div className={styles['empty-icon']}>📂</div>
                <h3>{labels.noProjectsFound}</h3>
                <button
                  className={styles['empty-clear-btn']}
                  onClick={() => {
                    closeSkillState();
                  }}
                >
                  {labels.skillFilterClear}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSkillPanelOpen && resumeData.skills && (
        <BottomSkillBar skills={resumeData.skills} onHeightChange={setBottomBarHeight} />
      )}
    </article>
  );
}
