// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const createApplicationLink = vi.hoisted(() => vi.fn<(formData: FormData) => void>());
vi.mock('@/lib/server/admin/actions', () => ({ createApplicationLink }));

import { LinkForm } from '@/components/admin/LinkForm';
import * as styles from '@/components/admin/LinkForm.css';

type LinkFormProps = Parameters<typeof LinkForm>[0];

const PROJECT_OPTIONS: LinkFormProps['applicationProjectOptions'] = [
  { id: 'oneline', title: 'Oneline' },
  { id: 'cafe', title: 'Cafe' },
  { id: 'ai-tool', title: 'AI Tool' },
];

const renderForm = (writesEnabled = true): ReturnType<typeof render> =>
  render(<LinkForm applicationProjectOptions={PROJECT_OPTIONS} writesEnabled={writesEnabled} />);

const optionTexts = (select: HTMLElement): string[] =>
  within(select)
    .getAllByRole('option')
    .map((option) => option.textContent ?? '');

afterEach(() => {
  cleanup();
});

describe('LinkForm fields', () => {
  it('renders the creation grid with every labelled field', () => {
    const { container } = renderForm();

    expect(screen.getByLabelText('회사명')).toHaveAttribute('placeholder', '예: Toss');
    expect(screen.getByLabelText('회사명')).toBeRequired();
    expect(screen.getByLabelText('라벨')).toHaveAttribute(
      'placeholder',
      '예: Toss Frontend 2026-06',
    );
    expect(screen.getByLabelText('커스텀 slug')).toHaveAttribute('maxlength', '32');
    expect(screen.getByLabelText('커스텀 slug')).toHaveAttribute(
      'aria-describedby',
      'link-slug-help',
    );
    expect(screen.getByLabelText('유효 기간 (일)')).toHaveValue(90);
    expect(screen.getByLabelText('유효 기간 (일)')).toHaveAttribute('min', '1');
    expect(screen.getByLabelText('유효 기간 (일)')).toHaveAttribute('max', '90');
    expect(container.querySelector(`.${styles.applicationForm}`)).not.toBeNull();
  });

  it('lists the six positioning presets with 웹 프론트엔드 selected by default', () => {
    renderForm();
    const positioning = screen.getByLabelText('포지셔닝');

    expect(optionTexts(positioning)).toEqual([
      '웹 프론트엔드',
      '운영/데이터 웹',
      '웹/모바일 공유 구조',
      '모바일 프론트엔드',
      'AI 활용 프론트엔드',
      '기본 포트폴리오',
    ]);
    expect(positioning).toHaveValue('web');
  });

  it('previews the auto-generated slug and explains the fallback', () => {
    const { container } = renderForm();

    expect(screen.getByText('/r/abcd')).toBeInTheDocument();
    expect(container.querySelector(`#link-slug-help code`)?.textContent).toBe('/r/abcd');
    expect(screen.getByText(/4자리 slug를 자동 생성합니다/)).toBeInTheDocument();
  });

  it('renders the four project ranks with the catalog titles and a no-selection default', () => {
    renderForm();

    expect(screen.getByText('첫 노출 프로젝트 순서')).toBeInTheDocument();
    for (const rank of [1, 2, 3, 4]) {
      expect(screen.getByLabelText(`${rank}순위`)).toBeInTheDocument();
    }
    expect(optionTexts(screen.getByLabelText('1순위'))).toEqual([
      '선택 안 함',
      'Oneline',
      'Cafe',
      'AI Tool',
    ]);
    expect(screen.getByText(/첫 노출 프로젝트와 요약 포지셔닝을 바꿉니다/)).toBeInTheDocument();
  });
});

describe('LinkForm project rank chaining', () => {
  it('keeps only the first rank enabled until the previous rank is chosen', () => {
    renderForm();

    expect(screen.getByLabelText('1순위')).toBeEnabled();
    expect(screen.getByLabelText('2순위')).toBeDisabled();
    expect(screen.getByLabelText('3순위')).toBeDisabled();
    expect(screen.getByLabelText('4순위')).toBeDisabled();
  });

  it('enables the next rank and hides the already chosen project from its options', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText('1순위'), 'oneline');

    const secondRank = screen.getByLabelText('2순위');
    expect(secondRank).toBeEnabled();
    expect(secondRank).toHaveValue('');
    expect(optionTexts(secondRank)).toEqual(['선택 안 함', 'Cafe', 'AI Tool']);
    expect(screen.getByLabelText('3순위')).toBeDisabled();
  });

  it('excludes both chosen projects from the third rank', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText('1순위'), 'oneline');
    await user.selectOptions(screen.getByLabelText('2순위'), 'cafe');

    expect(screen.getByLabelText('3순위')).toBeEnabled();
    expect(optionTexts(screen.getByLabelText('3순위'))).toEqual(['선택 안 함', 'AI Tool']);
    expect(screen.getByLabelText('4순위')).toBeDisabled();
  });

  it('clears and re-disables every later rank when an earlier rank is reset', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText('1순위'), 'oneline');
    await user.selectOptions(screen.getByLabelText('2순위'), 'cafe');
    await user.selectOptions(screen.getByLabelText('3순위'), 'ai-tool');

    expect(screen.getByLabelText('4순위')).toBeEnabled();

    await user.selectOptions(screen.getByLabelText('1순위'), '');

    expect(screen.getByLabelText('2순위')).toHaveValue('');
    expect(screen.getByLabelText('2순위')).toBeDisabled();
    expect(screen.getByLabelText('3순위')).toBeDisabled();
    expect(screen.getByLabelText('4순위')).toBeDisabled();
    expect(optionTexts(screen.getByLabelText('2순위'))).toEqual([
      '선택 안 함',
      'Oneline',
      'Cafe',
      'AI Tool',
    ]);
  });

  it('keeps the following rank selectable when a middle rank changes value', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText('1순위'), 'oneline');
    await user.selectOptions(screen.getByLabelText('2순위'), 'cafe');
    await user.selectOptions(screen.getByLabelText('2순위'), 'ai-tool');

    expect(screen.getByLabelText('1순위')).toHaveValue('oneline');
    expect(screen.getByLabelText('2순위')).toHaveValue('ai-tool');
    expect(screen.getByLabelText('3순위')).toBeEnabled();
    expect(screen.getByLabelText('3순위')).toHaveValue('');
    expect(screen.getByLabelText('4순위')).toBeDisabled();
  });

  it('clears the ranks after a middle rank when the middle rank is reset', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText('1순위'), 'oneline');
    await user.selectOptions(screen.getByLabelText('2순위'), 'cafe');
    await user.selectOptions(screen.getByLabelText('3순위'), 'ai-tool');

    expect(screen.getByLabelText('3순위')).toHaveValue('ai-tool');

    await user.selectOptions(screen.getByLabelText('2순위'), '');

    expect(screen.getByLabelText('1순위')).toHaveValue('oneline');
    expect(screen.getByLabelText('3순위')).toHaveValue('');
    expect(screen.getByLabelText('3순위')).toBeDisabled();
    expect(screen.getByLabelText('4순위')).toBeDisabled();
  });
});

describe('LinkForm slug preview and submission', () => {
  it('previews the normalized slug as the visitor types', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('커스텀 slug'), 'Toss FE!!');

    expect(screen.getByText('/r/tossfe')).toBeInTheDocument();
  });

  it('falls back to the auto-slug placeholder when the custom slug is cleared', async () => {
    const user = userEvent.setup();
    renderForm();
    const slugInput = screen.getByLabelText('커스텀 slug');

    await user.type(slugInput, 'toss');
    expect(screen.getByText('/r/toss')).toBeInTheDocument();

    await user.clear(slugInput);

    expect(screen.getByText('/r/abcd')).toBeInTheDocument();
  });

  it('tracks the chosen positioning preset', async () => {
    const user = userEvent.setup();
    renderForm();
    const positioning = screen.getByLabelText('포지셔닝');

    await user.selectOptions(positioning, 'ops-data');

    expect(positioning).toHaveValue('ops-data');
  });

  it('submits every field to the create action as form data', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('회사명'), 'Toss');
    await user.type(screen.getByLabelText('라벨'), 'Toss Frontend');
    await user.type(screen.getByLabelText('커스텀 slug'), 'toss-fe');
    await user.selectOptions(screen.getByLabelText('포지셔닝'), 'ops-data');
    await user.selectOptions(screen.getByLabelText('1순위'), 'oneline');
    await user.click(screen.getByRole('button', { name: '링크 생성' }));

    expect(createApplicationLink).toHaveBeenCalledTimes(1);
    const formData = createApplicationLink.mock.calls[0][0];
    expect(formData.get('companyName')).toBe('Toss');
    expect(formData.get('label')).toBe('Toss Frontend');
    expect(formData.get('slug')).toBe('toss-fe');
    expect(formData.get('positioning')).toBe('ops-data');
    expect(formData.get('ttlDays')).toBe('90');
    expect(screen.getByLabelText('3순위')).toBeDisabled();
    expect(formData.getAll('projectIds')).toEqual(['oneline', '']);
  });

  it('disables every control and the submit button when writes are disabled', () => {
    renderForm(false);

    expect(screen.getByLabelText('회사명')).toBeDisabled();
    expect(screen.getByLabelText('라벨')).toBeDisabled();
    expect(screen.getByLabelText('커스텀 slug')).toBeDisabled();
    expect(screen.getByLabelText('유효 기간 (일)')).toBeDisabled();
    expect(screen.getByLabelText('포지셔닝')).toBeDisabled();
    for (const rank of [1, 2, 3, 4]) {
      expect(screen.getByLabelText(`${rank}순위`)).toBeDisabled();
    }
    expect(screen.getByRole('button', { name: '링크 생성' })).toBeDisabled();
  });
});
