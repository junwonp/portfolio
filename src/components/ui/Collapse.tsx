'use client';

import type React from 'react';

import * as styles from './Collapse.css';

interface CollapseProps {
  isOpen: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export default function Collapse({ isOpen, className, id, children }: CollapseProps) {
  return (
    <div
      id={id}
      className={`${styles.collapse} ${isOpen ? styles.open : ''} ${className ?? ''}`}
      inert={!isOpen}
    >
      <div className={styles.collapseInner}>{children}</div>
    </div>
  );
}
