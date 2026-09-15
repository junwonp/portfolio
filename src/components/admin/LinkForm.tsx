'use client';

import { useState } from 'react';

import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { createApplicationLink } from '@/lib/server/admin/actions';
import { getApplicationLinkPathname, normalizeApplicationSlug } from '@/lib/utils/applicationSlug';

import * as styles from './LinkForm.css';

interface LinkFormProps {
  applicationProjectOptions: { id: string; title: string }[];
  writesEnabled: boolean;
}

const POSITIONING_OPTIONS = [
  { value: 'web', label: '웹 프론트엔드' },
  { value: 'ops-data', label: '운영/데이터 웹' },
  { value: 'web-rn', label: '웹/모바일 공유 구조' },
  { value: 'mobile', label: '모바일 프론트엔드' },
  { value: 'ai', label: 'AI 활용 프론트엔드' },
  { value: 'default', label: '기본 포트폴리오' },
];

const SELECT_RANKS = [1, 2, 3, 4];
const AUTO_SLUG_PLACEHOLDER = 'abcd';

export function LinkForm({ applicationProjectOptions, writesEnabled }: LinkFormProps) {
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(['', '', '', '']);
  const [positioning, setPositioning] = useState('web');
  const [slug, setSlug] = useState('');

  const previewPathname = getApplicationLinkPathname(
    normalizeApplicationSlug(slug) || AUTO_SLUG_PLACEHOLDER,
  );

  function getSelectableProjectOptions(index: number) {
    const selectedByOtherControls = new Set(
      selectedProjectIds.filter((projectId, selectedIndex) => projectId && selectedIndex !== index),
    );
    return applicationProjectOptions.filter((project) => !selectedByOtherControls.has(project.id));
  }

  function isProjectSelectDisabled(index: number): boolean {
    return index > 0 && !selectedProjectIds[index - 1];
  }

  function updateSelectedProject(index: number, value: string): void {
    const newSelection = selectedProjectIds.map((projectId, selectedIndex) => {
      if (selectedIndex < index) return projectId;
      if (selectedIndex === index) return value;
      return value ? projectId : '';
    });
    setSelectedProjectIds(newSelection);
  }

  return (
    <form className={styles.applicationForm} action={createApplicationLink}>
      <label htmlFor="link-company-name">
        <span>회사명</span>
        <input
          id="link-company-name"
          name="companyName"
          placeholder="예: Toss"
          required
          disabled={!writesEnabled}
        />
      </label>

      <label htmlFor="link-label">
        <span>라벨</span>
        <input
          id="link-label"
          name="label"
          placeholder="예: Toss Frontend 2026-06"
          disabled={!writesEnabled}
        />
      </label>

      <div className={styles.slugField}>
        <label htmlFor="link-slug">
          <span>커스텀 slug</span>
          <input
            id="link-slug"
            name="slug"
            placeholder="비워두면 4자리 자동 생성"
            maxLength={32}
            disabled={!writesEnabled}
            aria-describedby="link-slug-help"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
        </label>
        <p id="link-slug-help" className={styles.fieldHelp}>
          링크는 <code>{previewPathname}</code> 형식으로 생성됩니다. 비워두면 4자리 slug를 자동
          생성합니다.
        </p>
      </div>

      <label htmlFor="link-positioning">
        <span>포지셔닝</span>
        <Select
          id="link-positioning"
          name="positioning"
          disabled={!writesEnabled}
          value={positioning}
          onChange={setPositioning}
          options={POSITIONING_OPTIONS}
        />
      </label>

      <label htmlFor="link-ttl-days">
        <span>유효 기간 (일)</span>
        <input
          id="link-ttl-days"
          name="ttlDays"
          type="number"
          min="1"
          max="90"
          defaultValue="90"
          disabled={!writesEnabled}
        />
      </label>

      <fieldset className={styles.projectOrderField}>
        <legend>첫 노출 프로젝트 순서</legend>
        <p className={styles.fieldHelp}>
          기본 홈의 대표 프로젝트는 그대로 두고, 이 단축 링크로 접속한 방문자에게만 첫 노출
          프로젝트와 요약 포지셔닝을 바꿉니다.
        </p>
        <div className={styles.projectOrderGrid}>
          {SELECT_RANKS.map((rank, i) => {
            const projectOptions = [
              { value: '', label: '선택 안 함' },
              ...getSelectableProjectOptions(i).map((p) => ({
                value: p.id,
                label: p.title,
              })),
            ];
            return (
              <label key={rank} htmlFor={`link-project-${rank}`}>
                <span>{rank}순위</span>
                <Select
                  id={`link-project-${rank}`}
                  name="projectIds"
                  disabled={!writesEnabled || isProjectSelectDisabled(i)}
                  value={selectedProjectIds[i]}
                  onChange={(val) => updateSelectedProject(i, val)}
                  options={projectOptions}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <Button variant="primary" size="md" shape="rounded" type="submit" disabled={!writesEnabled}>
        링크 생성
      </Button>
    </form>
  );
}
