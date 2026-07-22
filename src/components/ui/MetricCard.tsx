import React from "react";

import { metricCard, metricLabel, metricValue } from "./MetricCard.css";

interface MetricCardProps {
  value: string;
  label: string;
}

export default function MetricCard({ value, label }: MetricCardProps) {
  return (
    <div className={metricCard}>
      <dd className={metricValue}>{value}</dd>
      <dt className={metricLabel}>{label}</dt>
    </div>
  );
}
