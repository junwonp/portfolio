// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Select from '@/components/ui/Select';
import * as styles from '@/components/ui/Select.css';

const OPTIONS = [
  { value: 'web', label: '웹 프론트엔드' },
  { value: 'mobile', label: '모바일 프론트엔드' },
] as const;

const optionValues = (): (string | null)[] =>
  screen.getAllByRole('option').map((option) => option.getAttribute('value'));

afterEach(() => {
  cleanup();
});

describe('Select options', () => {
  it('prepends a placeholder option while the value matches no option', () => {
    render(<Select options={OPTIONS} />);

    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: '선택해주세요' })).toHaveValue('');
    expect(optionValues()).toEqual(['', 'web', 'mobile']);
  });

  it('accepts a custom placeholder', () => {
    render(<Select options={OPTIONS} placeholder="프로젝트 선택" />);

    expect(screen.getByRole('option', { name: '프로젝트 선택' })).toBeInTheDocument();
  });

  it('drops the placeholder once the value matches an option', () => {
    render(<Select options={OPTIONS} value="web" />);

    expect(screen.queryByRole('option', { name: '선택해주세요' })).toBeNull();
    expect(optionValues()).toEqual(['web', 'mobile']);
  });

  it('renders only the placeholder when there are no options', () => {
    render(<Select options={[]} />);

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: '선택해주세요' })).toBeInTheDocument();
  });

  it('shows each option with its label and value', () => {
    render(<Select options={OPTIONS} />);

    expect(screen.getByRole('option', { name: '웹 프론트엔드' })).toHaveValue('web');
    expect(screen.getByRole('option', { name: '모바일 프론트엔드' })).toHaveValue('mobile');
  });
});

describe('Select attributes', () => {
  it('forwards id, name, aria-label and the disabled state to the select', () => {
    render(
      <Select
        aria-label="프로젝트"
        disabled
        id="project-select"
        name="project"
        options={OPTIONS}
      />,
    );
    const select = screen.getByRole('combobox', { name: '프로젝트' });

    expect(select).toHaveAttribute('id', 'project-select');
    expect(select).toHaveAttribute('name', 'project');
    expect(select).toBeDisabled();
    expect(select).toHaveClass(styles.selectControl);
  });

  it('renders the container class and a decorative chevron icon', () => {
    const { container } = render(<Select options={OPTIONS} />);

    expect(container.querySelector(`.${styles.customSelectContainer}`)).not.toBeNull();
    expect(container.querySelector(`.${styles.triggerIcon}`)).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(container.querySelector('svg')).toHaveAttribute('width', '16');
  });
});

describe('Select change handling', () => {
  it('reports the chosen value through onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select onChange={onChange} options={OPTIONS} />);

    await user.selectOptions(screen.getByRole('combobox'), 'mobile');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('mobile');
  });

  it('stays on the controlled value after the selection event', async () => {
    const user = userEvent.setup();
    render(<Select onChange={() => undefined} options={OPTIONS} value="web" />);
    const select = screen.getByRole('combobox');

    await user.selectOptions(select, 'mobile');

    expect(select).toHaveValue('web');
  });

  it('reports an explicit empty-value option when the user clears the selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select
        onChange={onChange}
        options={[
          { value: '', label: '전체' },
          { value: 'web', label: '웹 프론트엔드' },
        ]}
        value="web"
      />,
    );

    await user.selectOptions(screen.getByRole('combobox'), '');

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('does not require an onChange handler to respond to a selection', async () => {
    const user = userEvent.setup();
    render(<Select options={OPTIONS} />);

    await expect(user.selectOptions(screen.getByRole('combobox'), 'web')).resolves.toBeUndefined();
  });
});
