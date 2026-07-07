'use client';

import { Printer } from 'lucide-react';

import styles from './PrintableResume.module.css';

export default function PrintableResumeToolbar() {
  return (
    <div className={styles.toolbar} aria-label="Resume actions">
      <button className={styles.printButton} type="button" onClick={() => window.print()}>
        <Printer aria-hidden="true" size={16} />
        <span>Print / PDF</span>
      </button>
    </div>
  );
}
