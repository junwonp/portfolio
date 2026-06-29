import type { ProjectDetailBlock } from "@/lib/content/editableContent";
import { skillsShared } from "@/lib/data/skills";
import type { ContentOverrideArea } from "@/lib/server/editableContentStore";

export type EditableValue =
  | boolean
  | null
  | number
  | string
  | EditableValue[]
  | { [key: string]: EditableValue };

export type EditableRecord = Record<string, EditableValue>;
export type EditablePath = Array<number | string>;

export const blockTypes: ProjectDetailBlock["type"][] = [
  "markdown",
  "techStack",
  "achievements",
  "lightbox",
  "mediaGallery",
  "mermaid",
];

export const allSkillNames = Array.from(
  new Set(skillsShared.flatMap((group) => group.list)),
).sort((a, b) => a.localeCompare(b));

const fieldLabels: Record<string, string> = {
  achievements: "성과",
  accent: "강조",
  additional: "추가 링크",
  alt: "대체 텍스트",
  blocks: "콘텐츠 블록",
  caption: "캡션",
  chart: "Mermaid 차트",
  companyName: "회사명",
  date: "날짜",
  dateFrom: "시작일",
  dateTo: "종료일",
  description: "설명",
  detail: "상세 내용",
  detailLabel: "상세 링크 라벨",
  detailLink: "상세 링크",
  eyebrow: "보조 제목",
  featuredSkills: "대표 스킬",
  focusKeywords: "핵심 키워드",
  githubLink: "GitHub 링크",
  highlights: "하이라이트",
  id: "ID",
  image: "대표 이미지",
  images: "이미지",
  index: "순서",
  label: "라벨",
  linkedinLink: "LinkedIn 링크",
  list: "스킬 목록",
  markdown: "마크다운",
  metrics: "지표",
  mobileSrc: "모바일 소스",
  name: "이름",
  pillars: "핵심 문구",
  platforms: "플랫폼",
  productLink: "제품 링크",
  project: "프로젝트",
  role: "직책",
  school: "학교",
  skills: "스킬",
  src: "소스",
  status: "상태",
  tagline: "소개 문구",
  tag: "태그",
  techStack: "기술 스택",
  title: "제목",
  titleBadge: "배지",
  type: "유형",
  value: "값",
  variant: "표시 방식",
};

export const isRecord = (value: unknown): value is EditableRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toEditableValue = (value: unknown): EditableValue => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(toEditableValue);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        toEditableValue(item),
      ]),
    );
  }

  return "";
};

export const getValueAtPath = (
  value: EditableValue,
  path: EditablePath,
): EditableValue | undefined => {
  let current: EditableValue | undefined = value;

  for (const segment of path) {
    if (Array.isArray(current) && typeof segment === "number") {
      current = current[segment];
    } else if (isRecord(current) && typeof segment === "string") {
      current = current[segment];
    } else {
      return undefined;
    }
  }

  return current;
};

export const updateAtPath = (
  value: EditableValue,
  path: EditablePath,
  nextValue: EditableValue,
): EditableValue => {
  if (path.length === 0) {
    return nextValue;
  }

  const [segment, ...rest] = path;

  if (Array.isArray(value) && typeof segment === "number") {
    return value.map((item, index) =>
      index === segment ? updateAtPath(item, rest, nextValue) : item,
    );
  }

  if (isRecord(value) && typeof segment === "string") {
    return {
      ...value,
      [segment]: updateAtPath(value[segment] ?? "", rest, nextValue),
    };
  }

  return value;
};

export const removeAtPath = (
  value: EditableValue,
  path: EditablePath,
  index: number,
): EditableValue => {
  const list = getValueAtPath(value, path);
  if (!Array.isArray(list)) return value;

  return updateAtPath(
    value,
    path,
    list.filter((_, itemIndex) => itemIndex !== index),
  );
};

export const moveAtPath = (
  value: EditableValue,
  path: EditablePath,
  index: number,
  direction: -1 | 1,
): EditableValue => {
  const list = getValueAtPath(value, path);
  if (!Array.isArray(list)) return value;

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= list.length) return value;

  const next = [...list];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];

  return updateAtPath(value, path, next);
};

export const isSkillListField = (key: string, targetKey: string): boolean =>
  key === "skills" ||
  key === "featuredSkills" ||
  key === "techStack" ||
  targetKey.endsWith("::techStack") ||
  (targetKey === "skills" && key === "list");

export const isLongTextField = (key: string, value: string): boolean =>
  key === "chart" ||
  key === "description" ||
  key === "detail" ||
  key === "highlights" ||
  key === "markdown" ||
  key === "tagline" ||
  value.length > 96;

export const labelFor = (key: string): string => fieldLabels[key] ?? key;

export const isMonthInputField = (key: string): boolean => key === "dateFrom" || key === "dateTo";

export const isMarkdownListTextareaField = (key: string): boolean =>
  key === "detail" || key === "highlights";

export const toStringList = (value: EditableValue | undefined): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export const parseMarkdownListTextarea = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s+/, ""));

export const formatMarkdownListTextarea = (list: string[]): string =>
  list.map((item) => `- ${item}`).join("\n");

export const syncFeaturedSkillsWithSkills = (value: EditableValue): EditableValue => {
  if (Array.isArray(value)) {
    return value.map(syncFeaturedSkillsWithSkills);
  }

  if (!isRecord(value)) {
    return value;
  }

  const next = Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, syncFeaturedSkillsWithSkills(item)]),
  ) as EditableRecord;

  if (Array.isArray(next.skills) && Array.isArray(next.featuredSkills)) {
    const availableSkills = new Set(toStringList(next.skills));
    const selectedFeaturedSkills = toStringList(next.featuredSkills);

    return {
      ...next,
      featuredSkills: selectedFeaturedSkills.filter(
        (skill, index) => availableSkills.has(skill) && selectedFeaturedSkills.indexOf(skill) === index,
      ),
    };
  }

  return next;
};

export const createBlockTemplate = (
  type: ProjectDetailBlock["type"],
  index: number,
): EditableRecord => {
  const id = `block-${String(index + 1)}`;

  if (type === "markdown") {
    return { id, type, markdown: "## Section\n\nWrite content here." };
  }

  if (type === "techStack") {
    return { id, type };
  }

  if (type === "achievements") {
    return {
      id,
      type,
      achievements: [
        {
          tag: "Feature",
          accent: false,
          title: "Achievement title",
          detail: "Describe the result with **markdown**.",
        },
      ],
    };
  }

  if (type === "lightbox") {
    return {
      id,
      type,
      variant: "default",
      images: [{ src: "/images/example.webp", alt: "Screenshot", caption: "" }],
    };
  }

  if (type === "mediaGallery") {
    return {
      id,
      type,
      images: [{ src: "/images/example.webp", alt: "Media", caption: "" }],
    };
  }

  return {
    id,
    type,
    eyebrow: "Diagram",
    title: "Diagram title",
    chart: "flowchart TD\nA --> B",
  };
};

export const createArrayItemTemplate = (
  key: string,
  length: number,
): EditableValue => {
  if (key === "blocks") {
    return createBlockTemplate("markdown", length);
  }

  if (key === "metrics") {
    return { value: "", label: "" };
  }

  if (key === "pillars") {
    return {
      index: String(length + 1).padStart(2, "0"),
      title: "",
      description: "",
    };
  }

  if (key === "workExperiences") {
    return {
      companyName: "",
      role: "",
      dateFrom: "",
      dateTo: "",
      highlights: [],
      project: [],
    };
  }

  if (key === "project") {
    return {
      id: "",
      title: "",
      description: "",
      dateFrom: "",
      dateTo: "",
      detailLink: "",
      detail: [],
      featuredSkills: [],
      skills: [],
      metrics: [],
    };
  }

  if (key === "education") {
    return { school: "", major: "", dateFrom: "", dateTo: "" };
  }

  if (key === "skills") {
    return { id: "", title: "", list: [], description: "", detailLink: "" };
  }

  if (key === "achievements") {
    return { tag: "", accent: false, title: "", detail: "" };
  }

  if (key === "images") {
    return { src: "/images/example.webp", mobileSrc: "", alt: "", caption: "" };
  }

  return "";
};

export const normalizeInitialValue = (
  area: ContentOverrideArea,
  targetKey: string,
  initialValue: unknown,
): EditableValue => {
  if (area === "project-detail" && targetKey.endsWith("::blocks")) {
    if (isRecord(initialValue) && Array.isArray(initialValue.blocks)) {
      return toEditableValue(initialValue.blocks);
    }

    return Array.isArray(initialValue) ? toEditableValue(initialValue) : [];
  }

  if (area === "project-detail" && targetKey.endsWith("::techStack")) {
    if (isRecord(initialValue) && Array.isArray(initialValue.list)) {
      return toEditableValue(initialValue.list);
    }

    return Array.isArray(initialValue) ? toEditableValue(initialValue) : [];
  }

  return toEditableValue(initialValue);
};

export const buildContentOverridePayload = (
  area: ContentOverrideArea,
  targetKey: string,
  value: EditableValue,
): unknown => {
  if (area === "home") {
    return value;
  }

  if (targetKey.endsWith("::techStack")) {
    return { list: Array.isArray(value) ? value.filter((item) => typeof item === "string") : [] };
  }

  if (targetKey.endsWith("::blocks")) {
    return { blocks: Array.isArray(value) ? value : [] };
  }

  if (targetKey.endsWith("::metadata")) {
    return value;
  }

  return { markdown: typeof value === "string" ? value : "" };
};
