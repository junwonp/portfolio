import type {
  PrintableResumeData,
  ResumePageSection,
  ResumeTextPart,
  ResumeWorkEntry,
} from '@/lib/data/printableResume';

import styles from './PrintableResume.module.css';
import PrintableResumeToolbar from './PrintableResumeToolbar';

interface PrintableResumeProps {
  resume: PrintableResumeData;
}

const renderParts = (parts: ResumeTextPart[]) =>
  parts.map((part, index) => {
    if (typeof part === 'string') {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return <strong key={`${part.text}-${index}`}>{part.text}</strong>;
  });

const renderBulletList = (bullets: ResumeTextPart[][]) => {
  if (bullets.length === 0) return null;

  return (
    <ul className={styles.bullets}>
      {bullets.map((bullet, index) => (
        <li key={index}>{renderParts(bullet)}</li>
      ))}
    </ul>
  );
};

const renderWorkEntry = (entry: ResumeWorkEntry, index: number) => (
  <article className={styles.workEntry} key={`${entry.companyName ?? 'continued'}-${index}`}>
    {entry.companyName && (
      <header className={styles.workHeader}>
        <div>
          <h3>{entry.companyName}</h3>
          {entry.role && <p className={styles.role}>{entry.role}</p>}
        </div>
        <div className={styles.periodBlock}>
          {entry.period && <p>{entry.period}</p>}
          {entry.location && <p>{entry.location}</p>}
        </div>
      </header>
    )}

    {entry.projects.map((project) => (
      <section className={styles.projectBlock} key={project.title}>
        <h4>{project.title}</h4>
        {project.summary && <p className={styles.projectSummary}>{renderParts(project.summary)}</p>}
        {renderBulletList(project.bullets)}
      </section>
    ))}
  </article>
);

const renderSection = (section: ResumePageSection) => {
  if (section.type === 'work') {
    return (
      <section className={styles.section}>
        {section.title && <h2>{section.title}</h2>}
        {section.entries.map(renderWorkEntry)}
      </section>
    );
  }

  if (section.type === 'skills') {
    return (
      <section className={styles.section}>
        <h2>{section.title}</h2>
        <dl className={styles.skills}>
          {section.groups.map((group) => (
            <div className={styles.skillRow} key={group.label}>
              <dt>{group.label}</dt>
              <dd>{group.values.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>{section.title}</h2>
      <div className={styles.simpleList}>
        {section.items.map((item) => (
          <article className={styles.simpleItem} key={item.title}>
            <header>
              <h3>{item.title}</h3>
              <p>{item.period}</p>
            </header>
            {renderBulletList(item.bullets)}
          </article>
        ))}
      </div>
    </section>
  );
};

export default function PrintableResume({ resume }: PrintableResumeProps) {
  return (
    <div className={styles.resumeShell}>
      <PrintableResumeToolbar />
      <article className={styles.resumeDocument} aria-label="Junwon Park printable resume">
        {resume.pages.map((page, pageIndex) => (
          <section className={styles.resumePage} key={pageIndex} aria-label={`Resume page ${pageIndex + 1}`}>
            {pageIndex === 0 && (
              <header className={styles.hero}>
                <h1>{resume.name}</h1>
                <p className={styles.headline}>{resume.role}</p>
                <address className={styles.contactList}>
                  {resume.contactItems.map((item) => (
                    <span className={styles.contactItem} key={item.label}>
                      <strong>{item.label}:</strong>{' '}
                      {item.href ? <a href={item.href}>{item.value}</a> : item.value}
                    </span>
                  ))}
                </address>
                <section className={styles.summary} aria-labelledby="resume-summary-title">
                  <h2 id="resume-summary-title">{resume.summaryTitle}</h2>
                  {renderBulletList(resume.summaryBullets)}
                </section>
              </header>
            )}

            {page.sections.map((section, sectionIndex) => (
              <div className={styles.sectionFrame} key={`${section.type}-${sectionIndex}`}>
                {renderSection(section)}
              </div>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
