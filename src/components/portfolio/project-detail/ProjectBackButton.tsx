"use client";

import { ArrowLeft } from "lucide-react";

interface Props {
  label: string;
  className?: string;
}

export default function ProjectBackButton({ label, className }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (typeof window !== "undefined") history.back();
      }}
      aria-label={label}
      title={label}
    >
      <ArrowLeft width={20} height={20} strokeWidth={2.5} />
    </button>
  );
}
