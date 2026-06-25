'use client';

import { useState } from 'react';

import Select from '@/lib/components/Select';

import { createApplicationLink } from './actions';
import styles from './admin.module.css';

interface LinkFormProps {
  applicationProjectOptions: { id: string; title: string }[];
}

export function LinkForm({ applicationProjectOptions }: LinkFormProps) {
  const positioningOptions = [
    { value: 'web', label: '웹 프론트엔드' },
    { value: 'ops-data', label: '운영/데이터 웹' },
    { value: 'web-rn', label: '웹/모바일 공유 구조' },
    { value: 'mobile', label: '모바일 프론트엔드' },
    { value: 'ai', label: 'AI 활용 프론트엔드' },
    { value: 'default', label: '기본 포트폴리오' },
  ];

  const selectRanks = [1, 2, 3, 4];
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(['', '', '', '']);
  const [positioning, setPositioning] = useState('web');

  function getSelectableProjectOptions(index: number) {
    const selectedByOtherControls = new Set(
      selectedProjectIds.filter((projectId, selectedIndex) => projectId && selectedIndex !== index)
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
      <label>
        <span>회사명</span>
        <input name="companyName" placeholder="예: Toss" required />
      </label>

      <label>
        <span>라벨</span>
        <input name="label" placeholder="예: Toss Frontend 2026-06" />
      </label>

      <label>
        <span>커스텀 slug</span>
        <input name="slug" placeholder="비워두면 4자리 자동 생성" maxLength={32} />
      </label>

      <label>
        <span>포지셔닝</span>
        <Select
          name="positioning"
          value={positioning}
          onChange={setPositioning}
          options={positioningOptions}
        />
      </label>

      <label>
        <span>유효 기간 (일)</span>
        <input name="ttlDays" type="number" min="1" max="90" defaultValue="60" />
      </label>

      <div className={styles.projectOrderField}>
        <span>첫 노출 프로젝트 순서</span>
        <div className={styles.projectOrderGrid}>
          {selectRanks.map((rank, i) => {
            const projectOptions = [
              { value: '', label: '선택 안 함' },
              ...getSelectableProjectOptions(i).map((p) => ({
                value: p.id,
                label: p.title,
              })),
            ];
            return (
              <label key={rank}>
                <span>{rank}순위</span>
                <Select
                  name="projectIds"
                  disabled={isProjectSelectDisabled(i)}
                  value={selectedProjectIds[i]}
                  onChange={(val) => updateSelectedProject(i, val)}
                  options={projectOptions}
                />
              </label>
            );
          })}
        </div>
      </div>

      <button type="submit" className={styles.primaryBtn}>링크 생성</button>
    </form>
  );
}
