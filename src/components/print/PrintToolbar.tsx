'use client';

import { Printer } from 'lucide-react';

import * as styles from './PrintToolbar.css';

interface PrintToolbarProps {
  ariaLabel?: string;
}

export default function PrintToolbar({ ariaLabel }: PrintToolbarProps) {
  return (
    <div className={styles.toolbar} role="group" aria-label={ariaLabel}>
      <button className={styles.printButton} type="button" onClick={() => window.print()}>
        <Printer aria-hidden="true" size={16} />
        <span>PDF 저장 / 인쇄</span>
      </button>
    </div>
  );
}
