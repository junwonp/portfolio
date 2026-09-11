import type { CSSProperties, ReactNode } from 'react';

import * as styles from './AnimatedSection.css';

interface AnimatedSectionProps {
  id: string;
  /** Stagger offset for the enter animation, in milliseconds. */
  delay: number;
  className?: string;
  children: ReactNode;
}

export default function AnimatedSection({ id, delay, className, children }: AnimatedSectionProps) {
  return (
    <section
      id={id}
      className={`${styles.fadeSlideEnter} ${className ?? ''}`.trim()}
      style={{ '--enter-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </section>
  );
}
