import React from "react";

import { metricCard, metricDesc, metricLabel, metricValue } from "./MetricCard.css";

interface MetricCardProps {
  value: string;
  label: string;
  description?: string;
}

export default function MetricCard({ value, label, description }: MetricCardProps) {
  return (
    <div className={metricCard}>
      <dd className={metricValue}>{value}</dd>
      <dt className={metricLabel}>{label}</dt>
      {description && <small className={metricDesc}>{description}</small>}
    </div>
  );
}
