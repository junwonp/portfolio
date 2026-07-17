import React from "react";

import styles from "./MetricCard.module.css";

interface MetricCardProps {
  value: string;
  label: string;
}

export default function MetricCard({ value, label }: MetricCardProps) {
  return (
    <div className={styles["metric-card"]}>
      <dd className={styles["metric-value"]}>{value}</dd>
      <dt className={styles["metric-label"]}>{label}</dt>
    </div>
  );
}
