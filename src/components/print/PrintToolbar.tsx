'use client';

import { Printer } from 'lucide-react';

import * as styles from './PrintToolbar.css';

interface PrintToolbarProps {
  ariaLabel?: string;
  hint?: string;
  buttonLabel?: string;
}

export default function PrintToolbar({
  ariaLabel,
  hint,
  buttonLabel = 'PDF 저장 / 인쇄',
}: PrintToolbarProps) {
  return (
    <div className={styles.toolbar} role="group" aria-label={ariaLabel}>
      {hint && <p className={styles.hint}>{hint}</p>}
      <button className={styles.printButton} type="button" onClick={() => window.print()}>
        <Printer aria-hidden="true" size={16} />
        <span>{buttonLabel}</span>
      </button>
    </div>
  );
}
