'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import styles from './Select.module.css';

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  disabled?: boolean;
  name?: string;
  onChange?: (value: string) => void;
  options: readonly Option[];
  placeholder?: string;
  value?: string;
}

export default function Select({
  disabled = false,
  name = '',
  onChange,
  options,
  placeholder = '선택해주세요',
  value = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const currentLabel = options.find((opt) => opt.value === value)?.label ?? placeholder;

  const handleSelect = (optValue: string) => {
    if (disabled) return;
    onChange?.(optValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={selectRef}
      className={`${styles.customSelectContainer} ${isOpen ? styles.open : ''}`}
    >
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        className={`${styles.selectTrigger} ${disabled ? styles.disabled : ''}`}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className={styles.triggerLabel}>{currentLabel}</span>
        <span className={styles.triggerIcon}>
          <ChevronsUpDown size={16} />
        </span>
      </button>

      {isOpen && (
        <div className={styles.selectDropdown} role="listbox">
          <ul className={styles.optionsList}>
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`${styles.optionItem} ${opt.value === value ? styles.selected : ''}`}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => handleSelect(opt.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelect(opt.value);
                  }
                }}
                tabIndex={0}
              >
                <span className={styles.optionLabel}>{opt.label}</span>
                {opt.value === value && (
                  <span className={styles.checkIcon}>
                    <Check size={14} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
