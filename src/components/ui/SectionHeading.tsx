import type { ReactNode } from 'react';

import * as styles from './SectionHeading.css';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  level?: 2 | 3;
  id?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  action,
  level = 2,
  id,
}: SectionHeadingProps) {
  const Heading = level === 2 ? 'h2' : 'h3';

  return (
    <div className={styles.row}>
      <div className={styles.heading}>
        <Heading id={id}>{title}</Heading>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
