import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import type { InteractionCount } from '@/lib/server/admin/dashboardData';

import * as shared from './adminShared.css';
import {
  formatLocaleSwitchLabel,
  formatOutboundLinkLabel,
  formatThemeToggleLabel,
} from './dashboardLabels';
import * as styles from './InteractionInsightsPanel.css';

interface InteractionInsightsPanelProps {
  localeSwitches: InteractionCount[];
  outboundLinks: InteractionCount[];
  themeToggles: InteractionCount[];
}

interface InteractionRankingCardProps {
  title: string;
  subtitle: string;
  labelHeading: string;
  countHeading: string;
  emptyMessage: string;
  rows: InteractionCount[];
  formatLabel: (label: string) => string;
}

function InteractionRankingCard({
  title,
  subtitle,
  labelHeading,
  countHeading,
  emptyMessage,
  rows,
  formatLabel,
}: InteractionRankingCardProps) {
  return (
    <Card variant="glass" radius="sm" className={styles.insightsCard}>
      <SectionHeading level={2} title={title} subtitle={subtitle} />
      {rows.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className={shared.tableScroll}>
          <table>
            <thead>
              <tr>
                <th scope="col">{labelHeading}</th>
                <th scope="col" className={shared.num}>
                  {countHeading}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className={styles.labelCell} title={row.label}>
                    {formatLabel(row.label)}
                  </td>
                  <td className={shared.num}>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export function InteractionInsightsPanel({
  outboundLinks,
  themeToggles,
  localeSwitches,
}: InteractionInsightsPanelProps) {
  return (
    <div className={styles.insightsGrid}>
      <InteractionRankingCard
        title="외부 링크 클릭"
        subtitle="방문자가 실제로 클릭한 외부 목적지 순위입니다."
        labelHeading="목적지"
        countHeading="클릭 수"
        emptyMessage="아직 기록된 외부 링크 클릭이 없습니다."
        rows={outboundLinks}
        formatLabel={formatOutboundLinkLabel}
      />

      <InteractionRankingCard
        title="테마 전환 방향"
        subtitle="설정을 바꾼 방문자만 집계되며, 기본값을 그대로 둔 방문자는 제외됩니다. 어느 방향으로 전환됐는지가 기본 테마가 맞는지 판단하는 신호입니다."
        labelHeading="전환 방향"
        countHeading="전환 수"
        emptyMessage="아직 기록된 테마 전환이 없습니다."
        rows={themeToggles}
        formatLabel={formatThemeToggleLabel}
      />

      <InteractionRankingCard
        title="언어 전환"
        subtitle="언어를 바꾼 방문자만 집계된 전환 수입니다. 실제 언어 선호는 아래 접속 세션의 언어(Accept-Language) 열이 더 정확한 신호입니다."
        labelHeading="전환 언어"
        countHeading="전환 수"
        emptyMessage="아직 기록된 언어 전환이 없습니다."
        rows={localeSwitches}
        formatLabel={formatLocaleSwitchLabel}
      />
    </div>
  );
}
