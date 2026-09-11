import dynamic from 'next/dynamic';

import AnimatedSection from '@/components/portfolio/home/AnimatedSection';
import EducationList from '@/components/portfolio/home/EducationList';
import ProjectSpotlightList from '@/components/portfolio/home/ProjectSpotlightList';
import Title from '@/components/portfolio/home/Title';
import SectionHeading from '@/components/ui/SectionHeading';

const BentoSkills = dynamic(() => import('@/components/portfolio/home/BentoSkills'));
const WorkAccordion = dynamic(() => import('@/components/portfolio/home/WorkAccordion'));

import PortfolioContentLayout from '@/components/portfolio/layout/PortfolioContentLayout';
import DeferredMobileStickyHeader from '@/components/portfolio/navigation/DeferredMobileStickyHeader';
import DesktopSideNav from '@/components/portfolio/navigation/DesktopSideNav';
import type { HomePageData } from '@/lib/portfolio/homeTypes';

import * as styles from './HomePage.css';

interface Props {
  data: HomePageData;
}

export default function HomePage({ data }: Props) {
  const { featuredProjectsMode, featuredWebProjects, labels, locale, navSections, resumeData } =
    data;
  const { archives, otherExperiences, skills, workExperiences } = resumeData;
  const featuredProjectsTitle =
    featuredProjectsMode === 'role-fit'
      ? labels.sectionFeaturedProjects
      : labels.sectionSelectedProjects;

  const mobileHeader = (
    <DeferredMobileStickyHeader
      githubLink={resumeData.introduction.githubLink}
      linkedinLink={resumeData.introduction.linkedinLink}
      name={resumeData.introduction.name}
    />
  );

  return (
    <PortfolioContentLayout
      contentClassName={styles.mainContent}
      mobileHeader={mobileHeader}
      sideNav={<DesktopSideNav sections={navSections} />}
    >
      <AnimatedSection id="section-intro" delay={0}>
        <Title
          name={data.summaryIntroduction.name}
          pillars={data.summaryIntroduction.pillars}
          role={data.summaryIntroduction.role}
          tagline={data.summaryIntroduction.tagline}
        />
      </AnimatedSection>

      <div className={styles.contentWrapper}>
        {workExperiences.length > 0 && (
          <>
            {featuredWebProjects.length > 0 && (
              <AnimatedSection id="section-featured" delay={90}>
                <SectionHeading title={featuredProjectsTitle} />
                <ProjectSpotlightList
                  experiences={featuredWebProjects}
                  labels={labels}
                  variant="spotlight"
                  skillLimit={6}
                />
              </AnimatedSection>
            )}

            <AnimatedSection id="section-work" delay={180}>
              <SectionHeading title={labels.sectionWork} />
              <WorkAccordion experiences={workExperiences} locale={locale} />
            </AnimatedSection>
          </>
        )}

        <AnimatedSection id="section-skills" delay={270}>
          <SectionHeading title={labels.sectionSkills} />
          {skills && <BentoSkills locale={locale} skills={skills} />}
        </AnimatedSection>

        {otherExperiences.length > 0 && (
          <AnimatedSection id="section-projects" delay={360}>
            <SectionHeading title={labels.sectionAwards} />
            <ProjectSpotlightList experiences={otherExperiences} labels={labels} variant="resume" />
          </AnimatedSection>
        )}

        {archives.length > 0 && (
          <AnimatedSection id="section-archives" delay={450}>
            <SectionHeading title={labels.sectionArchives} />
            <ProjectSpotlightList experiences={archives} labels={labels} variant="resume" />
          </AnimatedSection>
        )}

        <AnimatedSection id="section-education" delay={540}>
          <SectionHeading title={labels.sectionEducation} />
          {resumeData.education && <EducationList education={resumeData.education} />}
        </AnimatedSection>
      </div>
    </PortfolioContentLayout>
  );
}
