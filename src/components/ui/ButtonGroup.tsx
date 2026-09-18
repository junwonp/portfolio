'use client';

import Button from './Button';
import * as styles from './ButtonGroup.css';

interface ButtonGroupOption {
  value: string;
  label: string;
}

interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  ariaLabel?: string;
  className?: string;
}

export default function ButtonGroup({
  options,
  value,
  onChange,
  size = 'md',
  ariaLabel,
  className = '',
}: ButtonGroupProps) {
  const classes = [styles.base, className].filter(Boolean).join(' ');

  return (
    <div role="group" aria-label={ariaLabel} className={classes}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Button
            key={option.value}
            type="button"
            shape="pill"
            size={size}
            variant={selected ? 'primary' : 'ghost'}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
