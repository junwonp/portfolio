'use client';

import Button from '@/components/ui/Button';
import { deleteApplicationLink } from '@/lib/server/admin/actions';
import { formatDateTime } from '@/lib/utils/date';

import * as shared from './adminShared.css';
import * as styles from './LinkCard.css';

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
        {link.projectIds.length > 0 ? (
          <ul className={styles.linkProjectList}>
            {projectLines.map((line, i) => (
              <li key={link.projectIds[i]}>{line}</li>
            ))}
          </ul>
        ) : (
          '-'
        )}
      </td>
      <td className={shared.num}>{link.sessions}</td>
      <td className={shared.num}>{link.views}</td>
      <td className={styles.linkDateCell}>
        {link.lastSeenAt ? (
          <time dateTime={link.lastSeenAt}>{formatDateTime(link.lastSeenAt)}</time>
        ) : (
          '-'
        )}
      </td>
      <td className={styles.linkDateCell}>
        <time dateTime={link.expiresAt}>{formatDateTime(link.expiresAt)}</time>
      </td>
      <td className={styles.actionCell}>
        <Button
          as="a"
          variant="outline"
          size="sm"
          shape="rounded"
          href={`/resume?slug=${link.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          title="이 단축 링크가 포함된 이력서 버전을 열어 PDF로 저장할 수 있습니다."
        >
          이력서
        </Button>
      </td>
      <td className={styles.actionCell}>
        <Button
          as="a"
          variant="outline"
          size="sm"
          shape="rounded"
          href={`/print?slug=${link.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          인쇄
        </Button>
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
          <Button
            variant="danger"
            size="sm"
            shape="rounded"
            type="submit"
            disabled={!writesEnabled}
            title={
              writesEnabled
                ? undefined
                : 'develop 환경에서는 production 데이터 보호를 위해 삭제가 비활성화됩니다.'
            }
          >
            삭제
          </Button>
        </form>
      </td>
    </tr>
  );
}
