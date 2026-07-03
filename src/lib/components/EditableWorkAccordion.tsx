'use client';

import React from 'react';

import { getLabels } from '@/lib/data/labels';
import type { WorkExperienceProps } from '@/lib/types/about';
import type { Language } from '@/lib/utils/language';

import EditableCompanyCard from './EditableCompanyCard';
import styles from './WorkAccordion.module.css';

interface Props {
  editorConfig: {
    allExperiences: WorkExperienceProps[];
    allExperiencesByLocale: Record<Language, WorkExperienceProps[]>;
    locale: Language;
  };
  experiences: WorkExperienceProps[];
  locale: Language;
}

export default function EditableWorkAccordion({ editorConfig, experiences, locale }: Props) {
  const labels = getLabels(locale);
  const isFiltered = false;

  return (
    <div className={styles.accordion}>
      {experiences.map((exp) => {
        const companyIndex = editorConfig.allExperiences.findIndex(
          (item) => item.companyName === exp.companyName,
        );

        return (
          <EditableCompanyCard
            key={`${companyIndex}:${exp.companyName}`}
            editorConfig={
              companyIndex >= 0
                ? {
                    ...editorConfig,
                    companyIndex,
                  }
                : undefined
            }
            exp={exp}
            isFiltered={isFiltered}
            labels={labels}
          />
        );
      })}
    </div>
  );
}
