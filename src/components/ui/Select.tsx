import { ChevronsUpDown } from 'lucide-react';

import { customSelectContainer, selectControl, triggerIcon } from './Select.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  disabled?: boolean;
  id?: string;
  name?: string;
  'aria-label'?: string;
  onChange?: (value: string) => void;
  options: readonly Option[];
  placeholder?: string;
  value?: string;
}

export default function Select({
  disabled = false,
  id,
  name = '',
  'aria-label': ariaLabel,
  onChange,
  options,
  placeholder = '선택해주세요',
  value = '',
}: SelectProps) {
  const showPlaceholder = !options.some((option) => option.value === value);

  return (
    <span className={customSelectContainer}>
      <select
        id={id}
        className={selectControl}
        name={name}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {showPlaceholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={triggerIcon} aria-hidden="true">
        <ChevronsUpDown size={16} />
      </span>
    </span>
  );
}
