'use client';

import { Printer } from 'lucide-react';

import { GITHUB_PROFILE, LINKEDIN_PROFILE } from '@/config/site';

import * as styles from './PrintablePortfolio.css';

interface PrintProjectData {
  title: string;
  description: string;
  skills: string[];
}

interface PrintablePortfolioProps {
  projects: PrintProjectData[];
  companyName?: string;
  role?: string;
  portfolioUrl: string;
}

const roleLabels: Record<string, string> = {
  ai: 'AI Engineer',
  mobile: 'Mobile Developer',
  web: 'Frontend Engineer',
};

const defaultRoleLabel = 'Frontend Engineer';

export default function PrintablePortfolio({
  projects,
  companyName,
  role,
  portfolioUrl,
}: PrintablePortfolioProps) {
  const roleLabel = (role && roleLabels[role]) || defaultRoleLabel;

  return (
    <div className={styles.shell}>
      <div className={styles.toolbar} aria-label="Portfolio print actions">
        <button className={styles.printButton} type="button" onClick={() => window.print()}>
          <Printer aria-hidden="true" size={16} />
          <span>PDF 저장 / 인쇄</span>
        </button>
      </div>

      <article className={styles.document} aria-label="Junwon Park portfolio summary">
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.headerTop}>
              <div>
                <h1 className={styles.headerTitle}>박준원</h1>
                <p className={styles.headerRole}>{roleLabel}</p>
                {companyName && <p className={styles.headerCompany}>지원: {companyName}</p>}
              </div>
              <div className={styles.headerLinks}>
                <a
                  href={GITHUB_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.headerLink}
                >
                  GitHub
                </a>
                <a
                  href={LINKEDIN_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.headerLink}
                >
                  LinkedIn
                </a>
              </div>
            </div>
            <hr className={styles.headerDivider} />
          </header>

          {projects.length > 0 && (
            <section className={styles.projectsSection} aria-label="Featured projects">
              <h2 className={styles.projectsHeading}>대표 프로젝트</h2>
              <div className={styles.projectList}>
                {projects.slice(0, 4).map((project, index) => (
                  <div key={project.title} className={styles.projectCard}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDescription}>{project.description}</p>
                    {project.skills.length > 0 && (
                      <div className={styles.skillTags}>
                        {project.skills.slice(0, 5).map((skill) => (
                          <span key={skill} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.ctaSection}>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              포트폴리오 방문하기
            </a>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkText}
            >
              {portfolioUrl}
            </a>
            <p className={styles.ctaNote}>
              본 문서는 채용 플랫폼 내 링크 접수를 대신하여 생성된 안내 문서입니다.
            </p>
          </section>

          <hr className={styles.ctaDivider} />

          <footer className={styles.footer}>
            <p>© 2021 - {new Date().getFullYear()} Junwon Park. All rights reserved.</p>
          </footer>
        </div>
      </article>
    </div>
  );
}
