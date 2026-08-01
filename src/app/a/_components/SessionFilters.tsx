'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import * as styles from './admin.css';
import { FilterTabs } from './FilterTabs';

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
      <FilterTabs
        label="유형"
        options={CLASSIFICATION_OPTIONS}
        selected={classification ?? ''}
        onChange={(v) => updateParam('classification', v)}
      />
      <FilterTabs
        label="기간"
        options={TIME_RANGE_OPTIONS}
        selected={timeRange ?? 'all'}
        onChange={(v) => updateParam('timeRange', v)}
      />
    </div>
  );
}
