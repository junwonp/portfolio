'use client';

import React from 'react';

import { getLabels } from '@/lib/data/labels';
import type { WorkExperienceProps } from '@/lib/types/about';
import type { Language } from '@/lib/utils/language';

import CompanyCard from './CompanyCard';
import styles from './WorkAccordion.module.css';

interface Props {
  experiences: WorkExperienceProps[];
  locale: Language;
}

export default function WorkAccordion({ experiences, locale }: Props) {
  const labels = getLabels(locale);
  const isFiltered = false;

  return (
    <div className={styles.accordion}>
      {experiences.map((exp) => {
        return (
          <CompanyCard
            key={exp.companyName}
            exp={exp}
            isFiltered={isFiltered}
            labels={labels}
          />
        );
      })}
    </div>
  );
}
