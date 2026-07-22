'use client';

import { Printer } from 'lucide-react';

import styles from './PrintablePortfolio.module.css';

interface PrintablePortfolioProps {
  slug?: string;
}

export default function PrintablePortfolio({ slug }: PrintablePortfolioProps) {
  const portfolioUrl = slug ? `https://junwon.dev/${slug}` : 'https://junwon.dev';

  return (
    <div className={styles.shell}>
      <div className={styles.toolbar} aria-label="Portfolio print actions">
        <button className={styles.printButton} type="button" onClick={() => window.print()}>
          <Printer aria-hidden="true" size={16} />
          <span>PDF 저장 / 인쇄</span>
        </button>
      </div>

      <article className={styles.document} aria-label="Junwon Park portfolio gate document">
        <section className={styles.page}>
          <div className={styles.content}>
            <h1 className={styles.title}>박준원 포트폴리오</h1>
            
            <hr className={styles.divider} />
            
            <p className={styles.description}>
              아래 버튼이나 링크를 클릭하시면<br />
              상세 이력과 프로젝트 성과를 확인하실 수 있는<br />
              웹 포트폴리오로 바로 이동합니다.
            </p>
            
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
              포트폴리오 방문하기
            </a>
            
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className={styles.linkText}>
              {portfolioUrl}
            </a>
          </div>

          <footer className={styles.footer}>
            <p>본 문서는 채용 플랫폼 내 링크 접수를 대신하여 생성된 안내 문서입니다.</p>
            <p>© 2021 - {new Date().getFullYear()} Junwon Park. All rights reserved.</p>
          </footer>
        </section>
      </article>
    </div>
  );
}
