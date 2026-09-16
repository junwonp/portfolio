import Image from 'next/image';
import type { ReactNode } from 'react';

import PrintToolbar from '@/components/print/PrintToolbar';
import { GITHUB_PROFILE, LINKEDIN_PROFILE } from '@/config/site';
import type {
  DocumentProjectBlock,
  DocumentSection,
  PortfolioDocument as PortfolioDocumentData,
} from '@/lib/portfolio/documentProjection';
import type { EducationProps, MetricItem } from '@/lib/portfolio/homeTypes';
import { getLabels, type Labels } from '@/lib/portfolio/labels';
import { getPrintImageUrl, getResponsiveImageProps } from '@/lib/utils/image';
import { parseMarkdown, type TextPart } from '@/lib/utils/markdown';

import { type FigureRowImage, layoutFigureRow } from './figureRow';
import PageSeams from './PageSeams';
import * as styles from './PortfolioDocument.css';

interface PortfolioDocumentProps {
  document: PortfolioDocumentData;
}

const renderParts = (parts: TextPart[]) =>
  parts.map((part, index) => {
    if (part.type === 'bold') {
      return <strong key={`${part.text}-${index}`}>{part.text}</strong>;
    }

    if (part.type === 'code') {
      return (
        <code className={styles.inlineCode} key={`${part.text}-${index}`}>
          {part.text}
        </code>
      );
    }

    return <span key={`${part.text}-${index}`}>{part.text}</span>;
  });

const MetricStrip = ({ metrics }: { metrics: MetricItem[] }) => {
  if (metrics.length === 0) return null;

  return (
    <ul className={styles.metrics}>
      {metrics.map((metric) => (
        <li className={styles.metric} key={`${metric.value}-${metric.label}`}>
          <span className={styles.metricValue}>{metric.value}</span>
          <span className={styles.metricLabel}>{metric.label}</span>
        </li>
      ))}
    </ul>
  );
};

const toPrintableUrl = (href: string): string => href.replace(/^https?:\/\/(www\.)?/, '');

interface ProjectLink {
  href: string;
  label: string;
}

const toProjectLinks = (project: DocumentProjectBlock): ProjectLink[] => {
  const links: ProjectLink[] = [];

  if (project.productLink) {
    links.push({ href: project.productLink, label: toPrintableUrl(project.productLink) });
  }

  if (project.githubLink) {
    links.push({ href: project.githubLink, label: toPrintableUrl(project.githubLink) });
  }

  return links;
};

interface ProjectMetaProps {
  labels: Labels;
  project: DocumentProjectBlock;
}

const ProjectMeta = ({ labels, project }: ProjectMetaProps) => {
  const links = toProjectLinks(project);
  const paradigm = project.paradigm
    ? labels[project.paradigm === 'agentic' ? 'paradigmAgentic' : 'paradigmAssisted']
    : undefined;

  if (project.platforms.length === 0 && links.length === 0 && !paradigm) return null;

  return (
    <div className={styles.projectMeta}>
      {paradigm && <span className={styles.paradigmBadge}>{paradigm}</span>}
      {project.platforms.length > 0 && (
        <span className={styles.projectPlatforms}>{project.platforms.join(' · ')}</span>
      )}
      {links.map((link) => (
        <a className={styles.projectLink} href={link.href} key={link.href}>
          {link.label}
        </a>
      ))}
    </div>
  );
};

/*
 * Orientation drives the variant: 480px is already over-sampled for a portrait
 * capture, while a landscape capture needs 768px to stay legible once its row
 * is scaled to the sheet's width.
 */
const toRowImage = (image: string): FigureRowImage | undefined => {
  const { height, width } = getResponsiveImageProps(image);
  if (!width || !height) return undefined;

  return {
    height,
    src: getPrintImageUrl(image, { width: height > width ? 480 : 768 }),
    width,
  };
};

const ProjectFigures = ({ images, title }: { images: string[]; title: string }) => {
  const sized = images
    .map(toRowImage)
    .filter((image): image is FigureRowImage => image !== undefined);
  const row = layoutFigureRow(sized);

  // An image with no recorded size is a broken reference; a row cannot be measured around it.
  if (!row) return null;

  return (
    <div className={styles.figureRow}>
      {row.cells.map((cell) => (
        <figure
          className={styles.figureCell}
          key={cell.image.src}
          style={{ height: cell.height, width: cell.width }}
        >
          <Image
            alt={title}
            className={styles.figureImage}
            height={cell.image.height}
            // Lazy loading races the print dialog and can leave a page blank.
            loading="eager"
            src={cell.image.src}
            unoptimized
            width={cell.image.width}
          />
        </figure>
      ))}
    </div>
  );
};

interface ProjectBlockProps {
  labels: Labels;
  project: DocumentProjectBlock;
}

const ProjectBlock = ({ labels, project }: ProjectBlockProps) => (
  <article className={styles.project}>
    <div className={styles.projectHeader}>
      <h3 className={styles.projectTitle}>{project.title}</h3>
      {project.period && <p className={styles.projectPeriod}>{project.period}</p>}
    </div>

    {project.role && <p className={styles.projectRole}>{project.role}</p>}

    <ProjectMeta labels={labels} project={project} />

    <MetricStrip metrics={project.metrics} />

    {project.summary && (
      <p className={styles.summary}>{renderParts(parseMarkdown(project.summary))}</p>
    )}

    {project.bullets.length > 0 && (
      <ul className={styles.bullets}>
        {project.bullets.map((bullet) => (
          <li key={bullet}>{renderParts(parseMarkdown(bullet))}</li>
        ))}
      </ul>
    )}

    {project.techStack.length > 0 && (
      <ul className={styles.chips}>
        {project.techStack.map((tech) => (
          <li className={styles.chip} key={tech}>
            {tech}
          </li>
        ))}
      </ul>
    )}

    {project.images.length > 0 && <ProjectFigures images={project.images} title={project.title} />}
  </article>
);

const formatEducationPeriod = (
  dateFrom: string,
  dateTo: string | undefined,
  presentLabel: string,
): string => {
  const start = dateFrom.replace('-', '.');
  if (!dateTo) return `${start} – ${presentLabel}`;

  return `${start} – ${dateTo.replace('-', '.')}`;
};

interface SectionBlockProps {
  education: EducationProps[];
  index: number;
  labels: Labels;
  section: DocumentSection;
  skills: PortfolioDocumentData['skills'];
}

const SectionBlock = ({ education, index, labels, section, skills }: SectionBlockProps) => {
  let body: ReactNode;

  if (section.kind === 'skills') {
    body = (
      <dl className={styles.skillList}>
        {skills.map((group) => (
          <div className={styles.skillRow} key={group.title}>
            <dt className={styles.skillTitle}>{group.title}</dt>
            <dd className={styles.skillValues}>{group.list.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    );
  } else if (section.kind === 'education') {
    body = (
      <div className={styles.educationList}>
        {education.map((entry) => (
          <div className={styles.educationRow} key={entry.school}>
            <div>
              <h3 className={styles.educationSchool}>{entry.school}</h3>
              {entry.major && <p className={styles.educationMajor}>{entry.major}</p>}
            </div>
            <p className={styles.educationPeriod}>
              {formatEducationPeriod(entry.dateFrom, entry.dateTo, labels.present)}
            </p>
          </div>
        ))}
      </div>
    );
  } else {
    body = section.projects.map((project) => (
      <ProjectBlock key={project.id} labels={labels} project={project} />
    ));
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>
        <span className={styles.sectionNumber}>{String(index + 1).padStart(2, '0')}</span>
        {section.title}
      </h2>
      {body}
    </section>
  );
};

export default function PortfolioDocument({ document }: PortfolioDocumentProps) {
  const labels = getLabels(document.locale);
  const { contact } = document;

  return (
    <main className={styles.shell}>
      {/* Scoped to this document so only this route prints at true A4 size. */}
      <style>{'@page { size: A4; margin: 0.6in 0.62in 0.5in }'}</style>

      <PrintToolbar ariaLabel={labels.printPage} hint={labels.printHint} />

      {/* Screen-only preview paper; precedes the sheet so it paints behind it. */}
      <PageSeams />

      <article
        aria-label={`${document.name} ${labels.resumeTitle}`}
        className={styles.sheet}
        data-document-sheet=""
      >
        <header className={styles.masthead}>
          <h1 className={styles.name}>{document.name}</h1>
          <p className={styles.role}>{document.role}</p>
          <p className={styles.tagline}>{document.tagline}</p>

          {(contact.githubLink || contact.linkedinLink) && (
            <address className={styles.contact}>
              {contact.githubLink && (
                <span className={styles.contactItem}>
                  {/* The projection carries a site path (/github); paper needs the profile URL. */}
                  <a href={GITHUB_PROFILE}>{GITHUB_PROFILE.replace('https://', '')}</a>
                </span>
              )}
              {contact.linkedinLink && (
                <span className={styles.contactItem}>
                  <a href={LINKEDIN_PROFILE}>
                    {LINKEDIN_PROFILE.replace(/^https:\/\/(www\.)?/, '')}
                  </a>
                </span>
              )}
            </address>
          )}

          <MetricStrip metrics={document.heroMetrics} />
        </header>

        {document.pillars.length > 0 && (
          <ul className={styles.pillars}>
            {document.pillars.map((pillar) => (
              <li className={styles.pillar} key={pillar.index}>
                <span className={styles.pillarIndex}>{pillar.index}</span>
                <div className={styles.pillarBody}>
                  <span className={styles.pillarTitle}>{pillar.title}</span>
                  <span className={styles.pillarDescription}>{pillar.description}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className={styles.paradigmLegend}>{labels.paradigmLegend}</p>

        {document.sections.map((section, index) => (
          <SectionBlock
            education={document.education}
            index={index}
            key={section.kind}
            labels={labels}
            section={section}
            skills={document.skills}
          />
        ))}
      </article>
    </main>
  );
}
