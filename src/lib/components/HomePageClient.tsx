"use client";

import type { ReactNode } from "react";
import React, { useEffect, useMemo, useState } from "react";

import BentoSkills from "@/lib/components/BentoSkills";
import BottomSkillBar from "@/lib/components/BottomSkillBar";
import DesktopSideNav from "@/lib/components/DesktopSideNav";
import EditableContentButton from "@/lib/components/EditableContentButton";
import ExperienceList from "@/lib/components/ExperienceList";
import type { HomePageData } from "@/lib/components/HomePage";
import SectionHeader from "@/lib/components/SectionHeader";
import WorkAccordion from "@/lib/components/WorkAccordion";
import { useSkillState } from "@/lib/states/skills";

import styles from "./HomePage.module.css";

interface HomePageClientProps {
  data: HomePageData;
  educationSection: ReactNode;
  introSection: ReactNode;
  mobileHeader: ReactNode;
}

const SCROLL_KEY = "home-scroll-y";

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

  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: parseInt(saved, 10),
          behavior: "instant" as ScrollBehavior,
        });
      });
    }

    const handleScrollSave = () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };

    window.addEventListener("beforeunload", handleScrollSave);
    return () => {
      handleScrollSave();
      window.removeEventListener("beforeunload", handleScrollSave);
    };
  }, []);

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
        project: exp.project.filter((p) =>
          selectedTechs.every((tech) => p.skills?.includes(tech))
        ),
      }))
      .filter((exp) => exp.project.length > 0);
  }, [isSkillStateEmpty, selectedTechs, resumeData.workExperiences]);

  const filteredProjects = useMemo(() => {
    if (isSkillStateEmpty) return resumeData.otherExperiences;
    return resumeData.otherExperiences.filter((exp) =>
      exp.project.some((p) =>
        selectedTechs.every((tech) => p.skills?.includes(tech))
      )
    );
  }, [isSkillStateEmpty, selectedTechs, resumeData.otherExperiences]);

  const filteredArchives = useMemo(() => {
    if (isSkillStateEmpty) return resumeData.archives;
    return resumeData.archives.filter((exp) =>
      exp.project.some((p) =>
        selectedTechs.every((tech) => p.skills?.includes(tech))
      )
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
        paddingBottom: isSkillPanelOpen ? `${bottomBarHeight + 64}px` : "0px",
        transition: "padding-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {mobileHeader}

      <div
        className={`${styles.layout} ${isSkillPanelOpen ? styles["is-selection-mode"] : ""}`}
      >
        {!isSkillPanelOpen && (
          <div className={styles["nav-wrapper"]}>
            <DesktopSideNav sections={navSections} />
          </div>
        )}

        <div className={styles["main-content"]}>
          {!isSkillPanelOpen && introSection}

          <div className={styles["content-wrapper"]}>
            {filteredWork.length > 0 && (
              <>
                {!isSkillPanelOpen && featuredWebProjects.length > 0 && (
                  <section
                    id="section-featured"
                    className={styles["fade-slide-enter"]}
                  >
                    <div className={styles["section-heading-row"]}>
                      <SectionHeader title={labels.sectionFeaturedProjects} />
                    </div>
                    <ExperienceList
                      experiences={featuredWebProjects}
                      labels={labels}
                      skillLimit={6}
                    />
                  </section>
                )}

                <section
                  id="section-work"
                  className={styles["fade-slide-enter"]}
                >
                  <div className={styles["section-heading-row"]}>
                    <SectionHeader title={labels.sectionWork} />
                    {isAdminEditor && (
                      <EditableContentButton
                        area="home"
                        initialValue={resumeData.workExperiences}
                        label="Work"
                        locale={data.locale}
                        targetKey="workExperiences"
                        textareaLabel="Work section JSON"
                      />
                    )}
                  </div>
                  <WorkAccordion
                    experiences={filteredWork}
                    locale={data.locale}
                  />
                </section>
              </>
            )}

            {!isSkillPanelOpen && (
              <section
                id="section-skills"
                className={styles["fade-slide-enter"]}
              >
                <div className={styles["section-heading-row"]}>
                  <SectionHeader title={labels.sectionSkills} />
                  {isAdminEditor && (
                    <EditableContentButton
                      area="home"
                      initialValue={resumeData.skills}
                      label="Skills"
                      locale={data.locale}
                      targetKey="skills"
                      textareaLabel="Skills section JSON"
                    />
                  )}
                </div>
                {resumeData.skills && (
                  <BentoSkills
                    locale={data.locale}
                    skills={resumeData.skills}
                  />
                )}
              </section>
            )}

            {filteredProjects.length > 0 && (
              <section
                id="section-projects"
                className={styles["fade-slide-enter"]}
              >
                <div className={styles["section-heading-row"]}>
                  <SectionHeader title={labels.sectionAwards} />
                  {isAdminEditor && (
                    <EditableContentButton
                      area="home"
                      initialValue={resumeData.otherExperiences}
                      label="Projects"
                      locale={data.locale}
                      targetKey="otherExperiences"
                      textareaLabel="Projects section JSON"
                    />
                  )}
                </div>
                <ExperienceList
                  experiences={filteredProjects}
                  labels={labels}
                />
              </section>
            )}

            {filteredArchives.length > 0 && (
              <section
                id="section-archives"
                className={styles["fade-slide-enter"]}
              >
                <div className={styles["section-heading-row"]}>
                  <SectionHeader title={labels.sectionArchives} />
                  {isAdminEditor && (
                    <EditableContentButton
                      area="home"
                      initialValue={resumeData.archives}
                      label="Archives"
                      locale={data.locale}
                      targetKey="archives"
                      textareaLabel="Archives section JSON"
                    />
                  )}
                </div>
                <ExperienceList
                  experiences={filteredArchives}
                  labels={labels}
                />
              </section>
            )}

            {!isSkillPanelOpen && educationSection}

            {isAllEmpty && (
              <div className={styles["empty-state"]}>
                <div className={styles["empty-icon"]}>📂</div>
                <h3>{labels.noProjectsFound}</h3>
                <button
                  className={styles["empty-clear-btn"]}
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
        <BottomSkillBar
          skills={resumeData.skills}
          onHeightChange={setBottomBarHeight}
        />
      )}
    </article>
  );
}
