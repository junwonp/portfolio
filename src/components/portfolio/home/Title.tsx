import type { PillarItem } from '@/lib/portfolio/homeTypes';

import styles from './Title.module.css';

interface Props {
  name: string;
  pillars?: PillarItem[];
  role: string;
  tagline: string;
}

export default function Title({ name, pillars, role, tagline }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles['title-container']}>
        <h1 className={styles.title}>{name}</h1>
      </div>
      {role && <h2 className={styles.role}>{role}</h2>}
      <p className={styles.tagline}>{tagline}</p>

      {pillars && pillars.length > 0 && (
        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <div className={styles.pillar} key={pillar.index}>
              <span className={styles['pillar-index']}>{pillar.index}</span>
              <div className={styles['pillar-content']}>
                <span className={styles['pillar-title']}>{pillar.title}</span>
                <span className={styles['pillar-desc']}>{pillar.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
