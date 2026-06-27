import type { ContentOverrideArea } from '@/lib/server/editableContentStore';
import type { Language } from '@/lib/utils/language';
import { isValidLanguage } from '@/lib/utils/language';

const VALID_AREAS = new Set<ContentOverrideArea>(['home', 'project-detail']);
const TARGET_KEY_PATTERN = /^[a-zA-Z0-9:_-]{1,160}$/;
const HOME_TARGET_KEYS = new Set([
  'archives',
  'education',
  'introduction',
  'otherExperiences',
  'skills',
  'workExperiences',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

const hasOnlyKeys = (value: Record<string, unknown>, keys: readonly string[]): boolean =>
  Object.keys(value).every((key) => keys.includes(key));

const isMetricItem = (value: unknown): value is { label: string; value: string } =>
  isRecord(value) &&
  hasOnlyKeys(value, ['label', 'value']) &&
  isString(value.label) &&
  isString(value.value);

const isPillarItem = (value: unknown): value is {
  description: string;
  index: string;
  title: string;
} =>
  isRecord(value) &&
  hasOnlyKeys(value, ['description', 'index', 'title']) &&
  isString(value.description) &&
  isString(value.index) &&
  isString(value.title);

const isIntroductionOverride = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !hasOnlyKeys(value, [
      'focusKeywords',
      'githubLink',
      'linkedinLink',
      'metrics',
      'name',
      'pillars',
      'role',
      'tagline',
    ])
  ) {
    return false;
  }

  return (
    (!('name' in value) || isString(value.name)) &&
    (!('role' in value) || isString(value.role)) &&
    (!('tagline' in value) || isString(value.tagline)) &&
    (!('githubLink' in value) || isString(value.githubLink)) &&
    (!('linkedinLink' in value) || isString(value.linkedinLink)) &&
    (!('focusKeywords' in value) || isStringArray(value.focusKeywords)) &&
    (!('metrics' in value) || (Array.isArray(value.metrics) && value.metrics.every(isMetricItem))) &&
    (!('pillars' in value) || (Array.isArray(value.pillars) && value.pillars.every(isPillarItem)))
  );
};

const isProjectItem = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !hasOnlyKeys(value, [
      'dateFrom',
      'dateTo',
      'description',
      'detail',
      'detailLink',
      'featuredSkills',
      'id',
      'metrics',
      'skills',
      'title',
    ])
  ) {
    return false;
  }

  return (
    isString(value.dateFrom) &&
    (!('dateTo' in value) || isString(value.dateTo)) &&
    isString(value.description) &&
    isStringArray(value.detail) &&
    (!('detailLink' in value) || isString(value.detailLink)) &&
    (!('featuredSkills' in value) || isStringArray(value.featuredSkills)) &&
    isString(value.id) &&
    isString(value.title) &&
    (!('skills' in value) || isStringArray(value.skills)) &&
    (!('metrics' in value) ||
      (Array.isArray(value.metrics) && value.metrics.every(isMetricItem)))
  );
};

const isProjectArrayOverride = (value: unknown): boolean =>
  Array.isArray(value) && value.every(isProjectItem);

const isAdditionalLink = (value: unknown): boolean =>
  isRecord(value) &&
  hasOnlyKeys(value, ['label', 'link']) &&
  isString(value.label) &&
  isString(value.link);

const isWorkExperienceOverride = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !hasOnlyKeys(value, [
      'additional',
      'companyName',
      'dateFrom',
      'dateTo',
      'highlights',
      'project',
      'role',
      'titleBadge',
    ])
  ) {
    return false;
  }

  return (
    isString(value.companyName) &&
    isString(value.dateFrom) &&
    (!('dateTo' in value) || isString(value.dateTo)) &&
    (!('highlights' in value) || isStringArray(value.highlights)) &&
    isString(value.role) &&
    (!('titleBadge' in value) || isString(value.titleBadge)) &&
    (!('additional' in value) || isAdditionalLink(value.additional)) &&
    isProjectArrayOverride(value.project)
  );
};

const isOtherExperienceOverride = (value: unknown): boolean =>
  isRecord(value) &&
  hasOnlyKeys(value, ['project', 'titleBadge']) &&
  (!('titleBadge' in value) || isString(value.titleBadge)) &&
  isProjectArrayOverride(value.project);

const isArchiveOverride = (value: unknown): boolean =>
  isRecord(value) &&
  hasOnlyKeys(value, ['project']) &&
  isProjectArrayOverride(value.project);

const isSkillOverride = (value: unknown): boolean =>
  isRecord(value) &&
  hasOnlyKeys(value, ['detailLabel', 'detailLink', 'description', 'id', 'list', 'title']) &&
  isString(value.id) &&
  isString(value.title) &&
  isStringArray(value.list) &&
  (!('description' in value) || isString(value.description)) &&
  (!('detailLabel' in value) || isString(value.detailLabel)) &&
  (!('detailLink' in value) || isString(value.detailLink));

const isEducationOverride = (value: unknown): boolean =>
  isRecord(value) &&
  hasOnlyKeys(value, ['dateFrom', 'dateTo', 'major', 'school']) &&
  isString(value.school) &&
  isString(value.dateFrom) &&
  (!('dateTo' in value) || isString(value.dateTo)) &&
  (!('major' in value) || isString(value.major));

export const isValidContentOverrideArea = (value: unknown): value is ContentOverrideArea =>
  typeof value === 'string' && VALID_AREAS.has(value as ContentOverrideArea);

export const isValidContentOverrideTargetKey = (value: unknown): value is string =>
  typeof value === 'string' && TARGET_KEY_PATTERN.test(value);

export const isValidContentOverrideLocale = (value: unknown): value is Language =>
  isValidLanguage(value);

export const isValidContentOverridePayload = (
  area: ContentOverrideArea,
  targetKey: string,
  payload: unknown,
): boolean => {
  if (area === 'home') {
    return isValidHomeOverridePayload(targetKey, payload);
  }

  return isValidProjectDetailOverridePayload(targetKey, payload);
};

export const isValidHomeOverridePayload = (targetKey: string, payload: unknown): boolean => {
  if (!HOME_TARGET_KEYS.has(targetKey)) {
    return false;
  }

  if (targetKey === 'introduction') {
    return isIntroductionOverride(payload);
  }

  if (targetKey === 'workExperiences') {
    return isWorkExperienceOverrideArray(payload);
  }

  if (targetKey === 'otherExperiences') {
    return isOtherExperienceOverrideArray(payload);
  }

  if (targetKey === 'archives') {
    return isArchiveOverrideArray(payload);
  }

  if (targetKey === 'skills') {
    return isSkillOverrideArray(payload);
  }

  if (targetKey === 'education') {
    return isEducationOverrideArray(payload);
  }

  return false;
};

export const isValidProjectDetailOverridePayload = (
  targetKey: string,
  payload: unknown,
): boolean => {
  if (targetKey.endsWith('::techStack')) {
    return isRecord(payload) && hasOnlyKeys(payload, ['list']) && isStringArray(payload.list);
  }

  return isRecord(payload) && hasOnlyKeys(payload, ['markdown']) && isString(payload.markdown) && payload.markdown.trim().length > 0;
};

const isWorkExperienceOverrideArray = (value: unknown): boolean =>
  Array.isArray(value) && value.every(isWorkExperienceOverride);

const isOtherExperienceOverrideArray = (value: unknown): boolean =>
  Array.isArray(value) && value.every(isOtherExperienceOverride);

const isArchiveOverrideArray = (value: unknown): boolean =>
  Array.isArray(value) && value.every(isArchiveOverride);

const isSkillOverrideArray = (value: unknown): boolean =>
  Array.isArray(value) && value.every(isSkillOverride);

const isEducationOverrideArray = (value: unknown): boolean =>
  Array.isArray(value) && value.every(isEducationOverride);
