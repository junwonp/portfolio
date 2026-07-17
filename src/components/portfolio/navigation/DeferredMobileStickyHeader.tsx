"use client";

import { lazy, Suspense } from "react";

import { useDeferredClientRender } from "@/lib/hooks/useDeferredClientRender";

const MobileStickyHeader = lazy(() => import("@/components/portfolio/navigation/MobileStickyHeader"));

interface DeferredMobileStickyHeaderProps {
  githubLink?: string;
  linkedinLink?: string;
  name: string;
}

export default function DeferredMobileStickyHeader({
  githubLink,
  linkedinLink,
  name,
}: DeferredMobileStickyHeaderProps) {
  const shouldRender = useDeferredClientRender();

  if (!shouldRender) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <MobileStickyHeader
        githubLink={githubLink}
        linkedinLink={linkedinLink}
        name={name}
      />
    </Suspense>
  );
}
