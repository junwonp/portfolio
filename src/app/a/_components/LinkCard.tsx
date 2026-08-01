'use client';

import { formatDateTime } from '@/lib/utils/date';

import * as styles from './admin.css';

import { deleteApplicationLink } from '../actions';

interface LinkCardProps {
  link: {
    companyName: string;
    createdAt: string;
    expiresAt: string;
    id: number;
    label: string;
    lastSeenAt: string | null;
    projectIds: string[];
    role: 'web' | 'mobile' | 'ai' | null;
    slug: string;
    summaryPreset: string;
    sessions: number;
    views: number;
  };
  projectOptions: { id: string; title: string }[];
  writesEnabled: boolean;
}

function formatPositioning(role: 'web' | 'mobile' | 'ai' | null, summaryPreset: string) {
  if (role === 'web' && summaryPreset === 'ops-data') return '운영/데이터 웹';
  if (role === 'web' && summaryPreset === 'web-rn') return '웹/모바일 공유 구조';
  if (role === 'web') return '웹 프론트엔드';
  if (role === 'mobile') return '모바일 프론트엔드';
  if (role === 'ai') return 'AI 활용 프론트엔드';
  return '기본 포트폴리오';
}

function formatProjectTitles(projectIds: string[], projectOptions: { id: string; title: string }[]) {
  return projectIds
    .map((pid, i) => `${i + 1}. ${projectOptions.find((p) => p.id === pid)?.title ?? pid}`)
    .join('\n');
}

export function LinkCard({ link, projectOptions, writesEnabled }: LinkCardProps) {
  const projectLines = link.projectIds.map(
    (pid, i) => `${i + 1}. ${projectOptions.find((p) => p.id === pid)?.title ?? pid}`,
  );

  return (
    <tr>
      <td>
        <a
          href={`/${link.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkSlugCell}
        >
          /{link.slug}
        </a>
      </td>
      <td className={styles.linkCompanyCell}>{link.companyName}</td>
      <td>{link.label}</td>
      <td>
        <span className={styles.linkCardBadge}>
          {formatPositioning(link.role, link.summaryPreset)}
        </span>
      </td>
      <td className={styles.linkProjectCell}>
        {link.projectIds.length > 0
          ? projectLines.map((line, i) => <div key={link.projectIds[i]}>{line}</div>)
          : '-'}
      </td>
      <td className={styles.num}>{link.sessions}</td>
      <td className={styles.num}>{link.views}</td>
      <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--color-sub)' }}>
        {link.lastSeenAt ? formatDateTime(link.lastSeenAt) : '-'}
      </td>
      <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--color-sub)' }}>
        {formatDateTime(link.expiresAt)}
      </td>
      <td className={styles.actionCell}>
        <a
          href={`/print?slug=${link.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.printBtn}
        >
          인쇄
        </a>
      </td>
      <td className={styles.actionCell}>
        <form
          action={deleteApplicationLink}
          onSubmit={(e) => {
            if (!writesEnabled) {
              e.preventDefault();
              return;
            }
            if (!confirm(`/${link.slug} 링크를 삭제할까요?`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="linkId" value={link.id} />
          <button
            type="submit"
            className={styles.dangerBtn}
            disabled={!writesEnabled}
            title={
              writesEnabled
                ? undefined
                : 'develop 환경에서는 production 데이터 보호를 위해 삭제가 비활성화됩니다.'
            }
          >
            삭제
          </button>
        </form>
      </td>
    </tr>
  );
}
