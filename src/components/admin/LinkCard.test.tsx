// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const deleteApplicationLink = vi.hoisted(() => vi.fn<(formData: FormData) => void>());
vi.mock('@/lib/server/admin/actions', () => ({ deleteApplicationLink }));

import { LinkCard } from '@/components/admin/LinkCard';
import * as styles from '@/components/admin/LinkCard.css';

type LinkCardProps = Parameters<typeof LinkCard>[0];
type LinkCardLink = LinkCardProps['link'];

const PROJECT_OPTIONS: LinkCardProps['projectOptions'] = [
  { id: 'oneline', title: 'Oneline' },
  { id: 'cafe', title: 'Cafe' },
];

const LINK: LinkCardLink = {
  companyName: 'Toss',
  createdAt: '2026-01-01T00:00:00.000Z',
  expiresAt: '2026-03-01T00:00:00.000Z',
  id: 7,
  label: 'Toss Frontend 2026-06',
  lastSeenAt: '2026-01-02T03:04:05.000Z',
  projectIds: ['oneline', 'cafe'],
  role: 'web',
  sessions: 12,
  slug: 'toss-fe',
  summaryPreset: 'web',
  views: 44,
};

const renderCard = (
  overrides: Partial<LinkCardLink> = {},
  writesEnabled = true,
): ReturnType<typeof render> =>
  render(
    <table>
      <tbody>
        <LinkCard
          link={{ ...LINK, ...overrides }}
          projectOptions={PROJECT_OPTIONS}
          writesEnabled={writesEnabled}
        />
      </tbody>
    </table>,
  );

const confirmMock = vi.hoisted(() => vi.fn(() => true));

beforeEach(() => {
  vi.stubGlobal('confirm', confirmMock);
  confirmMock.mockReturnValue(true);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('LinkCard', () => {
  it('links the slug through the /r/ namespace in a new tab safely', () => {
    renderCard();
    const link = screen.getByRole('link', { name: '/r/toss-fe' });

    expect(link).toHaveAttribute('href', '/r/toss-fe');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveClass(styles.linkSlugCell);
  });

  it('renders the company, label, session and view counts in their cells', () => {
    renderCard();
    const cells = screen.getAllByRole('cell').map((cell) => cell.textContent);

    expect(cells[1]).toBe('Toss');
    expect(cells[2]).toBe('Toss Frontend 2026-06');
    expect(cells[5]).toBe('12');
    expect(cells[6]).toBe('44');
  });

  const positioningCases: [LinkCardLink['role'], string, string][] = [
    ['web', 'ops-data', '운영/데이터 웹'],
    ['web', 'web-rn', '웹/모바일 공유 구조'],
    ['web', 'web', '웹 프론트엔드'],
    ['mobile', 'rn', '모바일 프론트엔드'],
    ['ai', 'ai', 'AI 활용 프론트엔드'],
    [null, 'default', '기본 포트폴리오'],
  ];

  it.each(positioningCases)(
    'labels role %s with preset %s as %s',
    (role, summaryPreset, expected) => {
      renderCard({ role, summaryPreset });

      expect(screen.getByText(expected)).toHaveClass(styles.linkCardBadge);
    },
  );

  it('numbers the exposed projects and resolves their titles from the catalog', () => {
    renderCard();
    const items = screen.getAllByRole('listitem').map((item) => item.textContent);

    expect(items).toEqual(['1. Oneline', '2. Cafe']);
  });

  it('falls back to the raw project id when the catalog has no matching title', () => {
    renderCard({ projectIds: ['oneline', 'retired-project'] });
    const items = screen.getAllByRole('listitem').map((item) => item.textContent);

    expect(items).toEqual(['1. Oneline', '2. retired-project']);
  });

  it('renders a dash in the project cell when no projects are exposed', () => {
    renderCard({ projectIds: [] });
    const cells = screen.getAllByRole('cell').map((cell) => cell.textContent);

    expect(cells[4]).toBe('-');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders the last visit as a machine-readable time element', () => {
    renderCard();
    const lastSeen = screen.getByText('2026-01-02 03:04');

    expect(lastSeen.tagName).toBe('TIME');
    expect(lastSeen).toHaveAttribute('datetime', '2026-01-02T03:04:05.000Z');
  });

  it('renders a dash for a link that has never been visited', () => {
    renderCard({ lastSeenAt: null });
    const cells = screen.getAllByRole('cell').map((cell) => cell.textContent);

    expect(cells[7]).toBe('-');
    expect(screen.queryByText('2026-01-02 03:04')).toBeNull();
  });

  it('renders the expiry as a machine-readable time element', () => {
    renderCard();
    const expires = screen.getByText('2026-03-01 00:00');

    expect(expires.tagName).toBe('TIME');
    expect(expires).toHaveAttribute('datetime', '2026-03-01T00:00:00.000Z');
  });

  it('offers the resume and print variants of the link in new tabs', () => {
    renderCard();

    const resume = screen.getByRole('link', { name: '이력서' });
    expect(resume).toHaveAttribute('href', '/resume?slug=toss-fe');
    expect(resume).toHaveAttribute('target', '_blank');
    expect(resume).toHaveAttribute('rel', 'noopener noreferrer');
    expect(resume).toHaveAttribute('title', expect.stringContaining('PDF'));

    const print = screen.getByRole('link', { name: '인쇄' });
    expect(print).toHaveAttribute('href', '/print?slug=toss-fe');
    expect(print).toHaveAttribute('target', '_blank');
  });

  it('submits the link id with the delete form when writes are enabled', () => {
    renderCard();
    const form = screen.getByRole('button', { name: '삭제' }).closest('form');
    const linkIdInput = form?.querySelector<HTMLInputElement>('input[name="linkId"]');

    expect(form).not.toBeNull();
    expect(linkIdInput).toHaveValue('7');
    expect(screen.getByRole('button', { name: '삭제' })).toBeEnabled();
  });

  it('disables the delete button and explains why when writes are disabled', () => {
    renderCard({}, false);
    const button = screen.getByRole('button', { name: '삭제' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('title', expect.stringContaining('develop 환경'));
  });

  it('asks for confirmation before deleting and submits when the visitor accepts', async () => {
    const user = userEvent.setup();
    confirmMock.mockReturnValue(true);
    renderCard();

    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(confirmMock).toHaveBeenCalledWith('/r/toss-fe 링크를 삭제할까요?');
    expect(deleteApplicationLink).toHaveBeenCalledTimes(1);
    const formData = deleteApplicationLink.mock.calls[0][0];
    expect(formData.get('linkId')).toBe('7');
  });

  it('cancels the submission when the visitor dismisses the confirmation', async () => {
    const user = userEvent.setup();
    confirmMock.mockReturnValue(false);
    renderCard();

    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(confirmMock).toHaveBeenCalledWith('/r/toss-fe 링크를 삭제할까요?');
    expect(deleteApplicationLink).not.toHaveBeenCalled();
  });

  it('blocks a programmatic submission when writes are disabled', () => {
    const { container } = renderCard({}, false);
    const form = container.querySelector('form');

    expect(form).not.toBeNull();
    act(() => {
      form?.requestSubmit();
    });

    expect(deleteApplicationLink).not.toHaveBeenCalled();
  });
});
