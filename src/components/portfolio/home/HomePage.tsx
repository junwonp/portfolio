import BentoSkills from '@/components/portfolio/home/BentoSkills';
import EducationList from '@/components/portfolio/home/EducationList';
import ProjectSpotlightList from '@/components/portfolio/home/ProjectSpotlightList';
import SectionHeader from '@/components/portfolio/home/SectionHeader';
import Title from '@/components/portfolio/home/Title';
import WorkAccordion from '@/components/portfolio/home/WorkAccordion';
import PortfolioContentLayout from '@/components/portfolio/layout/PortfolioContentLayout';
import DeferredMobileStickyHeader from '@/components/portfolio/navigation/DeferredMobileStickyHeader';
import DesktopSideNav from '@/components/portfolio/navigation/DesktopSideNav';
import type { IntroductionProps, OtherExperienceProps } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
import type { ResumeData } from '@/lib/portfolio/resume';
import type { Language } from '@/lib/utils/language';

import * as styles from './HomePage.css';

interface NavSection {
  id: string;
  label: string;
}

export interface HomePageData {
  featuredWebProjects: OtherExperienceProps[];
  featuredProjectsMode: 'role-fit' | 'selected';
  labels: Labels;
  locale: Language;
  navSections: NavSection[];
  resumeData: ResumeData;
  summaryIntroduction: IntroductionProps;
}

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
      <section id="section-intro" className={styles.fadeSlideEnter}>
        <Title
          name={data.summaryIntroduction.name}
          pillars={data.summaryIntroduction.pillars}
          role={data.summaryIntroduction.role}
          tagline={data.summaryIntroduction.tagline}
        />
      </section>

      <div className={styles.contentWrapper}>
        {workExperiences.length > 0 && (
          <>
            {featuredWebProjects.length > 0 && (
              <section id="section-featured" className={styles.fadeSlideEnter}>
                <div className={styles.sectionHeadingRow}>
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

            <section id="section-work" className={styles.fadeSlideEnter}>
              <div className={styles.sectionHeadingRow}>
                <SectionHeader title={labels.sectionWork} />
              </div>
              <WorkAccordion experiences={workExperiences} locale={locale} />
            </section>
          </>
        )}

        <section id="section-skills" className={styles.fadeSlideEnter}>
          <div className={styles.sectionHeadingRow}>
            <SectionHeader title={labels.sectionSkills} />
          </div>
          {skills && <BentoSkills locale={locale} skills={skills} />}
        </section>

        {otherExperiences.length > 0 && (
          <section id="section-projects" className={styles.fadeSlideEnter}>
            <div className={styles.sectionHeadingRow}>
              <SectionHeader title={labels.sectionAwards} />
            </div>
            <ProjectSpotlightList
              experiences={otherExperiences}
              labels={labels}
              variant="resume"
            />
          </section>
        )}

        {archives.length > 0 && (
          <section id="section-archives" className={styles.fadeSlideEnter}>
            <div className={styles.sectionHeadingRow}>
              <SectionHeader title={labels.sectionArchives} />
            </div>
            <ProjectSpotlightList experiences={archives} labels={labels} variant="resume" />
          </section>
        )}

        <section id="section-education" className={styles.fadeSlideEnter}>
          <div className={styles.sectionHeadingRow}>
            <SectionHeader title={labels.sectionEducation} />
          </div>
          {resumeData.education && <EducationList education={resumeData.education} />}
        </section>
      </div>
    </PortfolioContentLayout>
  );
}
