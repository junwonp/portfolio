import type {
  ArchiveProps,
  CertificateProps,
  EducationProps,
  IntroductionProps,
  OtherExperienceProps,
  SkillProps,
  WorkExperienceProps,
} from '../../types/about';
import type { Language } from '../utils/language';
import * as enData from './resume.en';
import * as koData from './resume.ko';

export interface ResumeData {
  introduction: IntroductionProps;
  workExperiences: WorkExperienceProps[];
  otherExperiences: OtherExperienceProps[];
  certificates: CertificateProps[];
  education: EducationProps[];
  skills: SkillProps[];
  archives: ArchiveProps[];
}

const resumeDataMap: Record<Language, ResumeData> = {
  ko: {
    introduction: koData.introduction,
    workExperiences: koData.workExperiences,
    otherExperiences: koData.otherExperiences,
    certificates: koData.certificates,
    education: koData.education,
    skills: koData.skills,
    archives: koData.archives,
  },
  en: {
    introduction: enData.introduction,
    workExperiences: enData.workExperiences,
    otherExperiences: enData.otherExperiences,
    certificates: enData.certificates,
    education: enData.education,
    skills: enData.skills,
    archives: enData.archives,
  },
};

export const getResumeData = (lang: Language): ResumeData => {
  return resumeDataMap[lang];
};

export const resumeData = resumeDataMap.en;
