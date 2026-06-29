'use client';

import React from 'react';

import EditableContentButton from '@/lib/components/EditableContentButton';
import EducationList from '@/lib/components/EducationList';
import SectionHeader from '@/lib/components/SectionHeader';
import Title from '@/lib/components/Title';
import type { Labels } from '@/lib/data/labels';
import type { EducationProps, IntroductionProps } from '@/lib/types/about';
import type { Language } from '@/lib/utils/language';

import styles from './HomePage.module.css';

interface EditableIntroSectionProps {
  labels: Labels;
  locale: Language;
  summaryIntroduction: IntroductionProps;
}

export function EditableIntroSection({
  labels,
  locale,
  summaryIntroduction,
}: EditableIntroSectionProps) {
  return (
    <section id="section-intro" className={styles['fade-slide-enter']}>
      <EditableContentButton
        area="home"
        initialValue={summaryIntroduction}
        label="소개"
        locale={locale}
        targetKey="introduction"
        textareaLabel="소개 수정"
      >
        {({ editor, isEditing, trigger }) => (
          <>
            <div className={styles['section-edit-row']}>{trigger}</div>
            {isEditing ? (
              editor
            ) : (
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
            )}
          </>
        )}
      </EditableContentButton>
    </section>
  );
}

interface EditableEducationSectionProps {
  education: EducationProps[];
  labels: Labels;
  locale: Language;
}

export function EditableEducationSection({
  education,
  labels,
  locale,
}: EditableEducationSectionProps) {
  return (
    <section id="section-education" className={styles['fade-slide-enter']}>
      <EditableContentButton
        area="home"
        initialValue={education}
        label="학력"
        locale={locale}
        targetKey="education"
        textareaLabel="학력 수정"
      >
        {({ editor, isEditing, trigger }) => (
          <>
            <div className={styles['section-heading-row']}>
              <SectionHeader title={labels.sectionEducation} />
              {trigger}
            </div>
            {isEditing ? editor : <EducationList education={education} />}
          </>
        )}
      </EditableContentButton>
    </section>
  );
}
