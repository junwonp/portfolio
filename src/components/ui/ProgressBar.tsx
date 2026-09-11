import * as styles from './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  tone?: 'primary' | 'success' | 'warning';
  label?: string;
}

export default function ProgressBar({ value, tone = 'primary', label }: ProgressBarProps) {
  // Clamp so out-of-range inputs can never overflow the track
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`${styles.fill} ${styles.tone[tone]}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}
