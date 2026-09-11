'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import ButtonGroup from '@/components/ui/ButtonGroup';

import * as styles from './SessionFilters.css';

interface SessionFiltersProps {
  classification?: 'bot' | 'suspected' | 'human';
  timeRange?: '7d' | '30d' | 'all';
}

const CLASSIFICATION_OPTIONS: { value: '' | 'bot' | 'suspected' | 'human'; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'human', label: '사람' },
  { value: 'suspected', label: '봇 의심' },
  { value: 'bot', label: '봇' },
];

const TIME_RANGE_OPTIONS: { value: '7d' | '30d' | 'all'; label: string }[] = [
  { value: '7d', label: '7일' },
  { value: '30d', label: '30일' },
  { value: 'all', label: '전체' },
];

export function SessionFilters({ classification, timeRange }: SessionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('tab', 'analytics');
    router.push(`/a?${params.toString()}`, { scroll: false });
  }

  return (
    <div className={styles.sessionFilters}>
      <fieldset className={styles.filterGroup}>
        <legend className={styles.filterLabel}>유형</legend>
        <ButtonGroup
          options={CLASSIFICATION_OPTIONS}
          value={classification ?? ''}
          onChange={(v) => updateParam('classification', v)}
          size="sm"
          ariaLabel="세션 유형 필터"
        />
      </fieldset>
      <fieldset className={styles.filterGroup}>
        <legend className={styles.filterLabel}>기간</legend>
        <ButtonGroup
          options={TIME_RANGE_OPTIONS}
          value={timeRange ?? 'all'}
          onChange={(v) => updateParam('timeRange', v)}
          size="sm"
          ariaLabel="세션 기간 필터"
        />
      </fieldset>
    </div>
  );
}
