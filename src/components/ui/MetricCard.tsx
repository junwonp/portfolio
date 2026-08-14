import React from "react";

import { cardSurface } from "@/components/ui/surface.css";

import { metricCard, metricDesc, metricLabel, metricValue } from "./MetricCard.css";

interface MetricCardProps {
  value: string;
  label: string;
  description?: string;
}

export default function MetricCard({ value, label, description }: MetricCardProps) {
  return (
    <div className={`${metricCard} ${cardSurface}`}>
      <dd className={metricValue}>{value}</dd>
      <dt className={metricLabel}>{label}</dt>
      {description && <small className={metricDesc}>{description}</small>}
    </div>
  );
}
