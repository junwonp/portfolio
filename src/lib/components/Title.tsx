import type { CSSProperties } from "react";

import type { MetricItem, PillarItem } from "@/lib/types/about";

import styles from "./Title.module.css";

interface Props {
  metrics?: MetricItem[];
  name: string;
  pillars?: PillarItem[];
  role: string;
  tagline: string;
}

export default function Title({
  metrics,
  name,
  pillars,
  role,
  tagline,
}: Props) {
  const metricColumnCount = Math.min(metrics?.length ?? 1, 4);

  return (
    <header className={styles.header}>
      <div className={styles["title-container"]}>
        <h1 className={styles.title}>{name}</h1>
      </div>
      {role && <h2 className={styles.role}>{role}</h2>}
      <p className={styles.tagline}>{tagline}</p>

      {metrics && metrics.length > 0 && (
        <dl
          className={`${styles["metrics-grid"]} ${metricColumnCount === 4 ? styles["has-four-metrics"] : ""}`}
          style={{ "--metric-count": metricColumnCount } as CSSProperties}
        >
          {metrics.map((metric) => (
            <div className={styles["metric-cell"]} key={metric.label}>
              <dt className={styles["metric-label"]}>{metric.label}</dt>
              <dd className={styles["metric-value"]}>{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {pillars && pillars.length > 0 && (
        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <div className={styles.pillar} key={pillar.index}>
              <span className={styles["pillar-index"]}>{pillar.index}</span>
              <div className={styles["pillar-content"]}>
                <span className={styles["pillar-title"]}>{pillar.title}</span>
                <span className={styles["pillar-desc"]}>{pillar.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
