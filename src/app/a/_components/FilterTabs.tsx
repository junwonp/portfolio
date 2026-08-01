import * as styles from './admin.css';

interface FilterTabsProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onChange: (value: T) => void;
  label?: string;
}

export function FilterTabs<T extends string>({ options, selected, onChange, label }: FilterTabsProps<T>) {
  return (
    <div className={styles.filterGroup}>
      {label && <span className={styles.filterLabel}>{label}</span>}
      <div className={styles.filterTabs}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={selected === opt.value ? styles.active : ''}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
