"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

import {
  getThemeSnapshot,
  readThemePreference,
  subscribeTheme,
  toggleTheme,
} from "@/lib/theme";

import * as styles from "./ThemeToggle.css";

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
  const label =
    preference === "dark" ? darkLabel : preference === "light" ? lightLabel : autoLabel;

  const handleClick = () => {
    toggleTheme();
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
