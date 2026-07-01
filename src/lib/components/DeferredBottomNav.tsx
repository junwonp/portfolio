"use client";

import { lazy, Suspense } from "react";

import { useDeferredClientRender } from "@/lib/hooks/useDeferredClientRender";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

const BottomNav = lazy(() => import("@/lib/components/BottomNav"));

interface DeferredBottomNavProps {
  isProject?: boolean;
}

export default function DeferredBottomNav({
  isProject = false,
}: DeferredBottomNavProps) {
  const isMobileNavViewport = useMediaQuery("(max-width: 960px)");
  const shouldRender = useDeferredClientRender();

  if (!isMobileNavViewport || !shouldRender) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <BottomNav isProject={isProject} />
    </Suspense>
  );
}
