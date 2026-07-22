import type { PillarItem } from '@/lib/portfolio/homeTypes';

import * as styles from './Title.css';

interface Props {
  name: string;
  pillars?: PillarItem[];
  role: string;
  tagline: string;
}

export default function Title({ name, pillars, role, tagline }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{name}</h1>
      </div>
      {role && <h2 className={styles.role}>{role}</h2>}
      <p className={styles.tagline}>{tagline}</p>

      {pillars && pillars.length > 0 && (
        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <div className={styles.pillar} key={pillar.index}>
              <span className={styles.pillarIndex}>{pillar.index}</span>
              <div className={styles.pillarContent}>
                <span className={styles.pillarTitle}>{pillar.title}</span>
                <span className={styles.pillarDesc}>{pillar.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
