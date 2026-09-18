// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const reportInteraction = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics/analyticsTransport', () => ({ reportInteraction }));

import CompanyCard from '@/components/portfolio/home/CompanyCard';
import type { WorkExperienceProps } from '@/lib/portfolio/homeTypes';
import { labelsMap } from '@/lib/portfolio/labels';

import * as styles from './CompanyCard.css';

const experience: WorkExperienceProps = {
  id: 'career-a',
  companyName: '회사 에이',
  role: 'Frontend Engineer',
  dateFrom: '2019-01',
  dateTo: '2022-02',
  titleBadge: '정규직',
  highlights: ['**Led** the migration'],
  additional: { label: '회사 소개', link: 'https://example.com/about' },
  project: [
    {
      id: 'project-a',
      title: '프로젝트 에이',
      dateFrom: '2019-01',
      description: '프로젝트 에이 설명',
      detail: [],
    },
  ],
};

afterEach(() => {
  cleanup();
});

describe('CompanyCard closed state', () => {
  it('renders the company header with role, period, badge, highlights, and additional link', () => {
    const { container } = render(
      <CompanyCard exp={experience} isFiltered={false} labels={labelsMap.ko} />,
    );

    const header = screen.getByRole('button', { name: /회사 에이/ });
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(header.getAttribute('aria-controls') ?? '')).not.toBeNull();
    expect(screen.getByText('정규직')).toBeInTheDocument();
    expect(screen.getAllByText('2019. 01').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2022. 02').length).toBe(2);
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Led').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: /회사 소개/ })).toHaveAttribute(
      'href',
      'https://example.com/about',
    );
    expect(screen.getByText(labelsMap.ko.showDetails)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.open}`)).toBeNull();
  });

  it('renders the present badge instead of a title badge for an ongoing role', () => {
    const { container } = render(
      <CompanyCard
        exp={{
          ...experience,
          additional: undefined,
          dateTo: undefined,
          highlights: undefined,
          titleBadge: undefined,
        }}
        isFiltered={false}
        labels={labelsMap.ko}
      />,
    );

    expect(screen.getByText(labelsMap.ko.present)).toBeInTheDocument();
    expect(screen.queryByText('정규직')).not.toBeInTheDocument();
    expect(container.querySelector(`.${styles.highlights}`)).toBeNull();
    expect(screen.queryByRole('link', { name: /회사 소개/ })).not.toBeInTheDocument();
  });

  it('renders an empty highlight list when highlights is an empty array', () => {
    const { container } = render(
      <CompanyCard
        exp={{ ...experience, highlights: [] }}
        isFiltered={false}
        labels={labelsMap.ko}
      />,
    );

    expect(container.querySelector(`.${styles.highlights}`)).toBeNull();
  });
});

describe('CompanyCard toggle', () => {
  it('opens and closes the company card while reporting each interaction', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CompanyCard exp={experience} isFiltered={false} labels={labelsMap.ko} />,
    );

    const header = screen.getByRole('button', { name: /회사 에이/ });

    await user.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(reportInteraction).toHaveBeenCalledWith({
      interactionType: 'accordion_company',
      interactionLabel: '회사 에이',
      action: 'open',
    });
    expect(screen.getByText(labelsMap.ko.hideDetails)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.open}`)).not.toBeNull();

    await user.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(reportInteraction).toHaveBeenLastCalledWith({
      interactionType: 'accordion_company',
      interactionLabel: '회사 에이',
      action: 'close',
    });
    expect(screen.getByText(labelsMap.ko.showDetails)).toBeInTheDocument();
  });
});

describe('CompanyCard filtered state', () => {
  it('forces the card open and ignores clicks without reporting or toggling', async () => {
    const user = userEvent.setup();
    render(<CompanyCard exp={experience} isFiltered labels={labelsMap.ko} />);

    const header = screen.getByRole('button', { name: /회사 에이/ });
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(labelsMap.ko.hideDetails)).toBeInTheDocument();

    await user.click(header);

    expect(reportInteraction).not.toHaveBeenCalled();
    expect(header).toHaveAttribute('aria-expanded', 'true');
  });
});
