import type { ReactNode } from 'react';

import * as styles from './EmptyState.css';

interface EmptyStateProps {
  message: string;
  children?: ReactNode;
}

export default function EmptyState({ message, children }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>{message}</p>
      {children}
    </div>
  );
}
