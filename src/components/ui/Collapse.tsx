"use client";

import React from "react";

import { useCollapseHeight } from "@/lib/hooks/useCollapseHeight";

import * as styles from "./Collapse.css";

interface CollapseProps {
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Collapse({ isOpen, className, children }: CollapseProps) {
  const { ref, style } = useCollapseHeight(isOpen);

  return (
    <div
      className={`${styles.collapse} ${isOpen ? styles.open : ""} ${className ?? ""}`}
      style={style}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}
