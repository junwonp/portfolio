"use client";

import { lazy, Suspense } from "react";

import { useDeferredClientRender } from "@/lib/hooks/useDeferredClientRender";

const Footer = lazy(() => import("@/components/portfolio/layout/Footer"));

export default function DeferredFooter() {
  const shouldRender = useDeferredClientRender(1600);

  if (!shouldRender) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  );
}
