'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { reportInteraction } from '@/lib/analytics/analyticsTransport';
import { getThemeSnapshot, readThemePreference, subscribeTheme, toggleTheme } from '@/lib/theme';

import * as styles from './ThemeToggle.css';

interface Props {
  autoLabel: string;
  lightLabel: string;
  darkLabel: string;
  className?: string;
  iconSize?: number;
  onToggle?: () => void;
}

export default function ThemeToggle({
  autoLabel,
  lightLabel,
  darkLabel,
  className,
  iconSize = 18,
  onToggle,
}: Props) {
  const preference = useSyncExternalStore(subscribeTheme, readThemePreference, () => null);
  // The icon always mirrors the effective theme (sun/moon) — auto mode is
  // communicated by the label alone
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => false);

  const Icon = isDark ? Moon : Sun;
  const label = preference === 'dark' ? darkLabel : preference === 'light' ? lightLabel : autoLabel;

  const handleClick = () => {
    const nextIsDark = toggleTheme();
    reportInteraction({
      interactionType: 'theme_toggle',
      interactionLabel: nextIsDark ? 'dark' : 'light',
      action: 'open',
    });
    onToggle?.();
  };

  return (
    <button
      type="button"
      className={className ?? styles.toggle}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      <Icon size={iconSize} />
      <span>{label}</span>
    </button>
  );
}
