import React from "react";

import EducationList from "@/lib/components/EducationList";
import {
  EditableEducationSection,
  EditableIntroSection,
} from "@/lib/components/HomeEditableSections";
import HomePageClient from "@/lib/components/HomePageClient";
import MobileStickyHeader from "@/lib/components/MobileStickyHeader";
import SectionHeader from "@/lib/components/SectionHeader";
import Title from "@/lib/components/Title";
import type { HomeContentOverride } from "@/lib/content/editableContent";
import type { Labels } from "@/lib/data/labels";
import type { ResumeData } from "@/lib/data/resume";
import type {
  IntroductionProps,
  OtherExperienceProps,
} from "@/lib/types/about";
import type { Language } from "@/lib/utils/language";

import styles from "./HomePage.module.css";

interface NavSection {
  id: string;
  label: string;
}

export interface HomePageData {
  featuredWebProjects: OtherExperienceProps[];
  homeContentOverride?: HomeContentOverride | null;
  isAdminEditor?: boolean;
  labels: Labels;
  locale: Language;
  navSections: NavSection[];
  resumeData: ResumeData;
  resumeDataByLocale: Record<Language, ResumeData>;
  summaryIntroduction: IntroductionProps;
  summaryIntroductionByLocale: Record<Language, IntroductionProps>;
}

interface Props {
  data: HomePageData;
}

export default function HomePage({ data }: Props) {
  const isAdminEditor = data.isAdminEditor === true;
  const resumeData = data.resumeData;
  const summaryIntroduction = data.summaryIntroduction;
  const labels = data.labels;

  const mobileHeader = (
    <MobileStickyHeader
      githubLink={resumeData.introduction.githubLink}
      linkedinLink={resumeData.introduction.linkedinLink}
      name={resumeData.introduction.name}
    />
  );

  const introSection = (
    isAdminEditor ? (
      <EditableIntroSection
        labels={labels}
        locale={data.locale}
        summaryIntroduction={summaryIntroduction}
        summaryIntroductionByLocale={data.summaryIntroductionByLocale}
      />
    ) : (
      <section id="section-intro" className={styles["fade-slide-enter"]}>
        <Title
          githubLink={summaryIntroduction.githubLink}
          linkedinLink={summaryIntroduction.linkedinLink}
          labels={labels}
          metrics={summaryIntroduction.metrics}
          name={summaryIntroduction.name}
          pillars={summaryIntroduction.pillars}
          role={summaryIntroduction.role}
          tagline={summaryIntroduction.tagline}
        />
      </section>
    )
  );

  const educationSection = (
    isAdminEditor && resumeData.education ? (
      <EditableEducationSection
        education={resumeData.education}
        educationByLocale={{
          en: data.resumeDataByLocale.en.education,
          ko: data.resumeDataByLocale.ko.education,
        }}
        labels={labels}
        locale={data.locale}
      />
    ) : (
      <section id="section-education" className={styles["fade-slide-enter"]}>
        <>
          <div className={styles["section-heading-row"]}>
            <SectionHeader title={labels.sectionEducation} />
          </div>
          {resumeData.education && <EducationList education={resumeData.education} />}
        </>
      </section>
    )
  );

  return (
    <HomePageClient
      data={data}
      educationSection={educationSection}
      introSection={introSection}
      mobileHeader={mobileHeader}
    />
  );
}
