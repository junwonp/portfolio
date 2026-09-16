import { GITHUB_PROFILE } from '@/config/site';
import generatedProjectImages from '@/lib/generated/projectImages.json';
import { projectCatalog } from '@/lib/portfolio/catalog';
import type { EducationProps, MetricItem, PillarItem } from '@/lib/portfolio/homeTypes';
import { getLabels } from '@/lib/portfolio/labels';
import { getResumeData } from '@/lib/portfolio/resume';
import type { ProjectContentEntry } from '@/lib/portfolio/types';
import type { Language } from '@/lib/utils/language';

/** summaryDetails is long-form; the document shows at most six lines per project. */
const maxBulletsPerProject = 6;
/** Three screenshots share one figure row; more would have to shrink past legibility. */
const maxImagesPerProject = 3;

export interface DocumentProjectBlock {
  id: string;
  title: string;
  period: string;
  role?: string;
  summary?: string;
  metrics: MetricItem[];
  techStack: string[];
  platforms: string[];
  paradigm?: 'agentic' | 'assisted';
  productLink?: string;
  githubLink?: string;
  bullets: string[];
  /** Representative screenshot first, then body figures; empty when the project has none. */
  images: string[];
}

export interface DocumentSection {
  kind: 'work' | 'other' | 'archive' | 'skills' | 'education';
  title: string;
  projects: DocumentProjectBlock[];
}

export interface PortfolioDocument {
  name: string;
  role: string;
  tagline: string;
  contact: {
    githubLink: string;
    linkedinLink: string;
  };
  heroMetrics: MetricItem[];
  pillars: PillarItem[];
  sections: DocumentSection[];
  education: EducationProps[];
  skills: { title: string; list: string[] }[];
  locale: Language;
}

interface BlockDraft {
  dateFrom: string;
  dateTo?: string;
  description: string;
  detail: readonly string[];
  featuredSkills?: readonly string[];
  id: string;
  metrics?: readonly MetricItem[];
  role?: string;
  skills?: readonly string[];
  title: string;
}

const projectById: ReadonlyMap<string, ProjectContentEntry> = new Map(
  projectCatalog.map((project): [string, ProjectContentEntry] => [project.id, project]),
);

const formatYearMonth = (value: string): string => {
  const [year, month] = value.split('-');
  if (!year) return '';

  // Year-only periods ('2024') stay as-is; day-precision metadata ('2026-04-22') trims to the month.
  return month ? `${year}.${month}` : year;
};

const formatPeriod = (
  dateFrom: string,
  dateTo: string | undefined,
  presentLabel: string,
): string => {
  const start = formatYearMonth(dateFrom);
  if (!start) return '';

  // A missing end date means the work is ongoing; the shared label keeps both locales in sync.
  if (!dateTo) return `${start} – ${presentLabel}`;
  // Period.tsx drops a duplicated end date, so a one-month project reads as a single date here too.
  if (dateTo === dateFrom) return start;

  return `${start} – ${formatYearMonth(dateTo)}`;
};

const hasText = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/** Frontmatter stores a bare repo path; paper needs the URL a reader can type. */
const resolveGithubLink = (link: string | null | undefined): string | undefined => {
  if (!hasText(link)) return undefined;

  return link.startsWith('http') ? link : `${GITHUB_PROFILE}/${link}`;
};

const generatedImages: Readonly<Record<string, readonly string[]>> = generatedProjectImages;

/** The MDX bodies hold the curated screenshots; the script in scripts/ extracts them per project. */
const resolveImages = (slug: string): string[] =>
  (generatedImages[slug] ?? []).filter(hasText).slice(0, maxImagesPerProject);

const toBlock = (draft: BlockDraft, lang: Language, presentLabel: string): DocumentProjectBlock => {
  const entry = projectById.get(draft.id);
  const metadata = entry?.content[lang].detailMetadata;
  const techStack = draft.skills?.length ? draft.skills : (draft.featuredSkills ?? []);
  const productLink = hasText(metadata?.productLink) ? metadata.productLink : undefined;
  const githubLink = resolveGithubLink(metadata?.githubLink);

  return {
    id: draft.id,
    title: draft.title,
    // A project without its own dates still needs a period, so the catalog date is the last resort.
    period: formatPeriod(
      draft.dateFrom || metadata?.date || '',
      draft.dateTo ?? metadata?.dateTo,
      presentLabel,
    ),
    ...(draft.role ? { role: draft.role } : {}),
    ...(draft.description ? { summary: draft.description } : {}),
    metrics: [...(draft.metrics ?? [])],
    techStack: [...techStack],
    platforms: (metadata?.platforms ?? []).filter(hasText),
    // paradigm is shared reading of the Korean frontmatter, so it is read from the catalog entry.
    ...(entry?.paradigm ? { paradigm: entry.paradigm } : {}),
    ...(productLink ? { productLink } : {}),
    ...(githubLink ? { githubLink } : {}),
    // Whole bullets only: a mid-string cut would leave an unclosed markdown marker.
    bullets: draft.detail.slice(0, maxBulletsPerProject),
    // The manifest is keyed by slug, and a project's id does not always match one.
    images: resolveImages(entry?.slug ?? draft.id),
  };
};

const toStandaloneDraft = (project: ProjectContentEntry, lang: Language): BlockDraft => {
  const content = project.content[lang];

  return {
    dateFrom: project.dateFrom ?? '',
    dateTo: project.dateTo,
    description: content.description,
    detail: content.summaryDetails,
    featuredSkills: project.featuredSkills,
    id: project.id,
    metrics: content.metrics,
    skills: project.skills,
    title: content.title,
  };
};

export function buildPortfolioDocument(lang: Language): PortfolioDocument {
  const { archives, education, introduction, otherExperiences, skills, workExperiences } =
    getResumeData(lang);
  const labels = getLabels(lang);

  const sections: DocumentSection[] = [
    // Skills lead: the stack is what a reader scans first, and the renderer
    // derives the section numbers from this order.
    // The list renders from the top-level field, so this section stays empty.
    { kind: 'skills', title: labels.sectionSkills, projects: [] },
    {
      kind: 'work',
      title: labels.sectionWork,
      projects: workExperiences.flatMap((experience) =>
        experience.project.map((project) =>
          toBlock(
            {
              ...project,
              // Company dates cover a project that carries no dates of its own.
              dateFrom: project.dateFrom || experience.dateFrom,
              dateTo: project.dateTo ?? experience.dateTo,
              role: experience.role,
            },
            lang,
            labels.present,
          ),
        ),
      ),
    },
    {
      kind: 'other',
      // This group lists projects only, so the awards wording would be wrong here.
      title: labels.sectionProjects,
      projects: otherExperiences.flatMap((experience) =>
        experience.project.map((project) => toBlock(project, lang, labels.present)),
      ),
    },
    {
      kind: 'archive',
      title: labels.sectionArchives,
      projects: [
        ...archives.flatMap((archive) =>
          archive.project.map((project) => toBlock(project, lang, labels.present)),
        ),
        // Standalone catalog projects sit outside the resume groupings, so append them here to
        // keep the document complete.
        ...projectCatalog.flatMap((project) =>
          project.section === 'standalone'
            ? [toBlock(toStandaloneDraft(project, lang), lang, labels.present)]
            : [],
        ),
      ],
    },
    // Education renders from the top-level field, so its section stays empty.
    { kind: 'education', title: labels.sectionEducation, projects: [] },
  ];

  return {
    name: introduction.name,
    role: introduction.role,
    tagline: introduction.tagline,
    contact: {
      githubLink: introduction.githubLink,
      linkedinLink: introduction.linkedinLink,
    },
    heroMetrics: [...(introduction.metrics ?? [])],
    pillars: [...(introduction.pillars ?? [])],
    sections,
    education: [...education],
    // skillGroupTitles is already applied by getResumeData; no display string is invented here.
    skills: skills.map((skill) => ({ title: skill.title, list: [...skill.list] })),
    locale: lang,
  };
}
