'use client';

import type { ReactNode } from 'react';
import React from 'react';

import BentoSkills from '@/lib/components/BentoSkills';
import DesktopSideNav from '@/lib/components/DesktopSideNav';
import type { HomePageData } from '@/lib/components/HomePage';
import PortfolioContentLayout from '@/lib/components/PortfolioContentLayout';
import ProjectSpotlightList from '@/lib/components/ProjectSpotlightList';
import SectionHeader from '@/lib/components/SectionHeader';
import WorkAccordion from '@/lib/components/WorkAccordion';

import styles from './HomePage.module.css';

interface HomePageClientProps {
  data: HomePageData;
  educationSection: ReactNode;
  introSection: ReactNode;
  mobileHeader: ReactNode;
}

export default function HomePageClient({
  data,
  educationSection,
  introSection,
  mobileHeader,
}: HomePageClientProps) {
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
              <div className={styles['section-heading-row']}>
                <SectionHeader title={labels.sectionWork} />
              </div>
              <WorkAccordion experiences={filteredWork} locale={data.locale} />
            </section>
          </>
        )}

        <section id="section-skills" className={styles['fade-slide-enter']}>
          <div className={styles['section-heading-row']}>
            <SectionHeader title={labels.sectionSkills} />
          </div>
          {resumeData.skills && <BentoSkills locale={data.locale} skills={resumeData.skills} />}
        </section>

        {filteredProjects.length > 0 && (
          <section id="section-projects" className={styles['fade-slide-enter']}>
            <div className={styles['section-heading-row']}>
              <SectionHeader title={labels.sectionAwards} />
            </div>
            <ProjectSpotlightList experiences={filteredProjects} labels={labels} variant="resume" />
          </section>
        )}

        {filteredArchives.length > 0 && (
          <section id="section-archives" className={styles['fade-slide-enter']}>
            <div className={styles['section-heading-row']}>
              <SectionHeader title={labels.sectionArchives} />
            </div>
            <ProjectSpotlightList experiences={filteredArchives} labels={labels} variant="resume" />
          </section>
        )}

        {educationSection}
      </div>
    </PortfolioContentLayout>
  );
}
