import { isRegisteredSkillName } from '@/lib/data/skills';

import { frontmatter as enMetadata } from './detail.en.mdx';
import { frontmatter as koMetadata } from './detail.ko.mdx';

import { defineProject } from '../types';

export const onelineBankProject = defineProject({
  id: koMetadata.id!,
  slug: 'oneline-bank',
  section: koMetadata.section!,
  parentId: koMetadata.parentId,
  dateFrom: koMetadata.dateFrom,
  dateTo: koMetadata.dateTo,
  detailPath: koMetadata.detailPath as `/projects/${string}`,
  icon: koMetadata.icon,
  paradigm: koMetadata.paradigm as 'assisted' | 'agentic',
  featuredSkills: (koMetadata.featuredSkills || []).filter(isRegisteredSkillName),
  skills: (koMetadata.techStack || []).filter(isRegisteredSkillName),
  content: {
    en: {
      title: enMetadata.title!,
      description: enMetadata.description!,
      metrics: enMetadata.metrics,
      summaryDetails: enMetadata.summaryDetails || [],
      detailMetadata: enMetadata,
    },
    ko: {
      title: koMetadata.title!,
      description: koMetadata.description!,
      metrics: koMetadata.metrics,
      summaryDetails: koMetadata.summaryDetails || [],
      detailMetadata: koMetadata,
    },
  },
});
