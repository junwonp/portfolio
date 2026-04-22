import { i18nData } from '$lib/data/resume.i18n';
import type { SharedProject } from '$lib/data/resume.shared';
import {
  archivesShared,
  certificateOrder,
  certificatesShared,
  educationOrder,
  educationShared,
  otherExperiencesShared,
  sharedIntroduction,
  skillsShared,
  workExperiencesShared,
} from '$lib/data/resume.shared';
import type {
  ArchiveProps,
  CertificateProps,
  EducationProps,
  IntroductionProps,
  OtherExperienceProps,
  SkillProps,
  WorkExperienceProps,
} from '$lib/types/about';
import type { Language } from '$lib/utils/language';

export interface ResumeData {
  archives: ArchiveProps[];
  certificates: CertificateProps[];
  education: EducationProps[];
  introduction: IntroductionProps;
  otherExperiences: OtherExperienceProps[];
  skills: SkillProps[];
  workExperiences: WorkExperienceProps[];
}

export const getResumeData = (lang: Language): ResumeData => {
  const i18n = i18nData[lang];

  const introduction: IntroductionProps = {
    ...sharedIntroduction,
    ...i18n.introduction,
  };

  const workExperiences: WorkExperienceProps[] = workExperiencesShared.map((exp) => {
    const i18nExp = i18n.workExperiences[exp.id];
    return {
      companyName: i18nExp.companyName,
      titleBadge: i18nExp.titleBadge,
      dateFrom: exp.dateFrom,
      dateTo: exp.dateTo,
      highlights: i18nExp.highlights,
      role: i18nExp.role,
      additional: i18nExp.additional,
      project: (exp.projects as SharedProject[]).map((proj) => {
        const i18nProj = i18nExp.projects[proj.id];
        return {
          dateFrom: proj.dateFrom,
          dateTo: proj.dateTo,
          detailLink: proj.detailLink,
          skills: proj.skills,
          description: i18nProj.description,
          detail: i18nProj.detail,
          title: i18nProj.title,
          metrics: i18nProj.metrics,
        };
      }),
    };
  });

  const otherExperiences: OtherExperienceProps[] = otherExperiencesShared.map((exp) => {
    const i18nExp = i18n.otherExperiences[exp.id];
    return {
      titleBadge: i18nExp.titleBadge,
      project: [
        {
          dateFrom: exp.dateFrom,
          dateTo: exp.dateTo,
          detailLink: exp.detailLink,
          skills: exp.skills,
          description: i18nExp.description,
          detail: i18nExp.detail,
          title: i18nExp.title,
        },
      ],
    };
  });

  const archives: ArchiveProps[] = archivesShared.map((arch) => {
    const i18nArch = i18n.archives[arch.id];
    return {
      project: [
        {
          dateFrom: arch.dateFrom,
          dateTo: arch.dateTo,
          detailLink: arch.detailLink,
          skills: arch.skills,
          description: i18nArch.description,
          detail: i18nArch.detail,
          title: i18nArch.title,
        },
      ],
    };
  });

  const certificates: CertificateProps[] = certificateOrder.map((id) => ({
    link: certificatesShared[id].link,
    label: i18n.certificates[id].label,
  }));

  const education: EducationProps[] = educationOrder.map((id) => ({
    ...educationShared[id],
    ...i18n.education[id],
  }));

  const skills: SkillProps[] = skillsShared.map((skill) => ({
    id: skill.id,
    title: i18n.skills[skill.id],
    list: skill.list,
  }));

  return {
    introduction,
    workExperiences,
    otherExperiences,
    archives,
    certificates,
    education,
    skills,
  };
};
