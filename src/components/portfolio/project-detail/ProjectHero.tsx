import type { CSSProperties } from 'react';

import Badge from '@/components/ui/Badge';
import MetricCard from '@/components/ui/MetricCard';
import RichText from '@/components/ui/RichText';
import type { PostMetadata } from '@/lib/portfolio/projectTypes';
import { parseMarkdown } from '@/lib/utils/markdown';

import * as styles from './ProjectDetailPage.css';

interface Props {
  metadata: PostMetadata;
  metricColumnCount: number;
  slug: string;
}

export default function ProjectHero({ metadata, metricColumnCount, slug }: Props) {
  return (
    <>
      <div className={styles.heroMeta}>
        {metadata.role && <Badge text={metadata.role} color="primary" />}
        {metadata.status && <Badge text={metadata.status} color="green" />}
        {metadata.date && <Badge text={metadata.date} color="sub" />}
      </div>

      <h1 className={styles.heroTitle}>{metadata.title || slug}</h1>

      {(metadata.tagline || metadata.description) && (
        <p className={styles.heroTagline}>
          <RichText parts={parseMarkdown(metadata.tagline || metadata.description || '')} />
        </p>
      )}

      {metadata.metrics && metadata.metrics.length > 0 && (
        <dl
          className={styles.metricsRow}
          style={
            {
              '--metric-count': metricColumnCount,
            } as CSSProperties
          }
        >
          {metadata.metrics.map((metric) => (
            <MetricCard key={metric.label} value={metric.value} label={metric.label} />
          ))}
        </dl>
      )}
    </>
  );
}
