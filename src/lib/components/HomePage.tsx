import React from "react";

import DeferredMobileStickyHeader from "@/lib/components/DeferredMobileStickyHeader";
import EducationList from "@/lib/components/EducationList";
import HomePageClient from "@/lib/components/HomePageClient";
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
  featuredProjectsMode: 'role-fit' | 'selected';
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

export default async function HomePage({ data }: Props) {
  const isAdminEditor = data.isAdminEditor === true;
  const resumeData = data.resumeData;
  const summaryIntroduction = data.summaryIntroduction;
  const labels = data.labels;

  if (isAdminEditor) {
    const { default: EditableHomePage } = await import("@/lib/components/EditableHomePage");

    return <EditableHomePage data={data} />;
  }

  const mobileHeader = (
    <DeferredMobileStickyHeader
      githubLink={resumeData.introduction.githubLink}
      linkedinLink={resumeData.introduction.linkedinLink}
      name={resumeData.introduction.name}
    />
  );

  const introSection = (
    <section id="section-intro" className={styles["fade-slide-enter"]}>
      <Title
        metrics={summaryIntroduction.metrics}
        name={summaryIntroduction.name}
        pillars={summaryIntroduction.pillars}
        role={summaryIntroduction.role}
        tagline={summaryIntroduction.tagline}
      />
    </section>
  );

  const educationSection = (
    <section id="section-education" className={styles["fade-slide-enter"]}>
      <>
        <div className={styles["section-heading-row"]}>
          <SectionHeader title={labels.sectionEducation} />
        </div>
        {resumeData.education && <EducationList education={resumeData.education} />}
      </>
    </section>
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
