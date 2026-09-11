import PrintToolbar from '@/components/print/PrintToolbar';
import type {
  PrintableResumeData,
  ResumePageSection,
  ResumeTextPart,
  ResumeWorkEntry,
} from '@/content/printableResume';

import * as styles from './PrintableResume.css';

interface PrintableResumeProps {
  resume: PrintableResumeData;
}

const renderParts = (parts: ResumeTextPart[]) =>
  parts.map((part, index) => {
    if (typeof part === 'string') {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    if ('code' in part) {
      return (
        <code className={styles.inlineCode} key={`${part.text}-${index}`}>
          {part.text}
        </code>
      );
    }

    return <strong key={`${part.text}-${index}`}>{part.text}</strong>;
  });

const renderBulletList = (bullets: ResumeTextPart[][]) => {
  if (bullets.length === 0) return null;

  return (
    <ul className={styles.bullets}>
      {bullets.map((bullet) => (
        <li key={String(bullet).slice(0, 60)}>{renderParts(bullet)}</li>
      ))}
    </ul>
  );
};

const renderWorkEntry = (entry: ResumeWorkEntry) => (
  <article
    className={styles.workEntry}
    key={`${entry.companyName ?? 'continued'}-${entry.role ?? ''}`}
  >
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
        <div className={styles.projectHeader}>
          <h4>{project.title}</h4>
          {project.period && <p className={styles.projectPeriod}>{project.period}</p>}
        </div>
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
      {/*
        Scoped to this document so the resume prints at true A4 size with no
        browser scaling; the page element below carries its own padding
      */}
      <style>{'@page { size: A4; margin: 0 }'}</style>
      <PrintToolbar ariaLabel="Resume actions" />
      <article className={styles.resumeDocument} aria-label="Junwon Park printable resume">
        {resume.pages.map((page, pageIndex) => (
          <section
            className={styles.resumePage}
            key={pageIndex}
            aria-label={`Resume page ${pageIndex + 1}`}
          >
            {pageIndex === 0 && (
              <header className={styles.hero}>
                <div className={styles.heroTopRow}>
                  <div className={styles.identityBlock}>
                    <h1>{resume.name}</h1>
                    <p className={styles.headline}>{resume.role}</p>
                  </div>
                  <address className={styles.contactList}>
                    {(() => {
                      const loc = resume.contactItems.find((item) => item.label === 'Location');
                      const email = resume.contactItems.find((item) => item.label === 'Email');
                      const github = resume.contactItems.find((item) => item.label === 'GitHub');
                      const portfolio = resume.contactItems.find(
                        (item) => item.label === 'Portfolio',
                      );

                      return (
                        <>
                          <div className={styles.contactRow}>
                            {loc && <span>{loc.value}</span>}
                            {loc && email && <span className={styles.divider}>|</span>}
                            {email && (
                              <span className={styles.secureEmail}>
                                <span>me</span>
                                <span className={styles.atSign} />
                                <span>junwon.dev</span>
                              </span>
                            )}
                          </div>
                          {github && (
                            <div className={styles.contactRow}>
                              <span>
                                <strong>GitHub:</strong> <a href={github.href}>{github.value}</a>
                              </span>
                            </div>
                          )}
                          {portfolio && (
                            <div className={styles.contactRow}>
                              <span>
                                <strong>Portfolio:</strong>{' '}
                                <a href={portfolio.href}>
                                  {portfolio.value.replace('https://', '')}
                                </a>
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </address>
                </div>
                <ul className={styles.metricStrip} aria-label="핵심 성과 지표">
                  {resume.heroMetrics.map((metric) => (
                    <li key={`${metric.value}-${metric.label}`}>
                      <span className={styles.metricValue}>{metric.value}</span>
                      <span className={styles.metricLabel}>{metric.label}</span>
                    </li>
                  ))}
                </ul>
                <section className={styles.summary} aria-labelledby="resume-summary-title">
                  <h2 id="resume-summary-title">{resume.summaryTitle}</h2>
                  {renderBulletList(resume.summaryBullets)}
                </section>
                <p className={styles.techLine}>
                  <strong>Tech</strong> {resume.techKeywords.join(' · ')}
                </p>
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
