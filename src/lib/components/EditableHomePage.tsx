import React from 'react';

import EditableHomePageClient from '@/lib/components/EditableHomePageClient';
import {
  EditableEducationSection,
  EditableIntroSection,
} from '@/lib/components/HomeEditableSections';
import type { HomePageData } from '@/lib/components/HomePage';
import MobileStickyHeader from '@/lib/components/MobileStickyHeader';

interface Props {
  data: HomePageData;
}

export default function EditableHomePage({ data }: Props) {
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
    <EditableIntroSection
      labels={labels}
      locale={data.locale}
      summaryIntroduction={summaryIntroduction}
      summaryIntroductionByLocale={data.summaryIntroductionByLocale}
    />
  );

  const educationSection = resumeData.education ? (
    <EditableEducationSection
      education={resumeData.education}
      educationByLocale={{
        en: data.resumeDataByLocale.en.education,
        ko: data.resumeDataByLocale.ko.education,
      }}
      labels={labels}
      locale={data.locale}
    />
  ) : null;

  return (
    <EditableHomePageClient
      data={data}
      educationSection={educationSection}
      introSection={introSection}
      mobileHeader={mobileHeader}
    />
  );
}
