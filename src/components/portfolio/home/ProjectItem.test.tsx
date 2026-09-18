// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const reportInteraction = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics/analyticsTransport', () => ({ reportInteraction }));

import ProjectItem from '@/components/portfolio/home/ProjectItem';
import type { ProjectItem as ProjectItemType } from '@/lib/portfolio/homeTypes';
import { labelsMap } from '@/lib/portfolio/labels';

const project: ProjectItemType = {
  id: 'aira',
  title: '아이라',
  dateFrom: '2022-03',
  description: 'Built Aira end to end.',
  detail: ['**[Role]** Led the launch'],
  detailLink: '/projects/aira',
  skills: ['Expo'],
};

afterEach(() => {
  cleanup();
});

describe('ProjectItem compact mode', () => {
  it('forces the row open with a static heading and a non-interactive cursor', () => {
    const { container } = render(
      <ProjectItem
        companyName="Compact Co"
        detailsMode="compact"
        isFiltered={false}
        labels={labelsMap.ko}
        project={project}
      />,
    );

    expect(container.querySelector('[data-project-surface="resume"]')).not.toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container.querySelector('h4')?.textContent).toBe('아이라');
    expect(container.querySelector('[style]')).toHaveStyle({ cursor: 'default' });
    expect(container.querySelector('[inert]')).toBeNull();
  });

  it('hides the summary rows when a compact project links to its detail page', () => {
    const { container } = render(
      <ProjectItem
        companyName="Compact Link Co"
        detailsMode="compact"
        isFiltered={false}
        labels={labelsMap.ko}
        project={project}
      />,
    );

    expect(container.querySelector('dt')).toBeNull();
    expect(screen.getByRole('link', { name: /프로젝트 자세히 보기/ })).toHaveAttribute(
      'href',
      '/projects/aira',
    );
  });

  it('keeps the summary rows for a compact project without a detail page', () => {
    const { container } = render(
      <ProjectItem
        companyName="Compact Summary Co"
        detailsMode="compact"
        isFiltered={false}
        labels={labelsMap.ko}
        project={{ ...project, detailLink: undefined }}
      />,
    );

    expect(container.querySelector('dt')).toHaveTextContent('Role');
    expect(container.querySelector('dd')).toHaveTextContent('Led the launch');
  });
});

describe('ProjectItem full mode', () => {
  it('starts collapsed, opens and closes on click, and reports each toggle', async () => {
    const user = userEvent.setup();
    render(
      <ProjectItem
        companyName="Full Co"
        isFiltered={false}
        labels={labelsMap.ko}
        project={project}
      />,
    );

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(toggle.getAttribute('aria-controls') ?? '')).not.toBeNull();

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(reportInteraction).toHaveBeenCalledWith({
      interactionType: 'accordion_project',
      interactionLabel: 'Full Co::아이라',
      action: 'open',
    });

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(reportInteraction).toHaveBeenLastCalledWith({
      interactionType: 'accordion_project',
      interactionLabel: 'Full Co::아이라',
      action: 'close',
    });
  });

  it('reveals the summary rows only while the row is expanded', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ProjectItem
        companyName="Full Details Co"
        isFiltered={false}
        labels={labelsMap.ko}
        project={project}
      />,
    );

    expect(container.querySelector('dt')).toBeNull();

    await user.click(screen.getByRole('button'));

    expect(container.querySelector('dt')).toHaveTextContent('Role');
  });
});

describe('ProjectItem filtered mode', () => {
  it('starts expanded and ignores clicks without reporting or toggling', async () => {
    const user = userEvent.setup();
    render(
      <ProjectItem companyName="Filtered Co" isFiltered labels={labelsMap.ko} project={project} />,
    );

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.click(toggle);

    expect(reportInteraction).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
