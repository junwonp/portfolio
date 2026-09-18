// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const login = vi.hoisted(() => vi.fn<() => Promise<{ unauthorized?: boolean } | undefined>>());
vi.mock('@/lib/server/admin/actions', () => ({ login }));

import { AdminLogin } from '@/components/admin/AdminLogin';
import * as styles from '@/components/admin/AdminLogin.css';

afterEach(() => {
  cleanup();
});

describe('AdminLogin local bypass', () => {
  it('explains the password-less local entry and renders the bypass button', () => {
    render(<AdminLogin isLocal />);

    expect(screen.getByRole('heading', { name: '관리자 로그인' })).toBeInTheDocument();
    expect(
      screen.getByText(
        '로컬 개발 환경입니다. 아래 버튼을 클릭하면 비밀번호 없이 즉시 관리자 대시보드로 진입합니다.',
      ),
    ).toHaveClass(styles.subtitle);
    expect(screen.getByRole('button', { name: '로컬 개발자 우회 로그인' })).toHaveClass(
      styles.submitButton,
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('calls the login action once and keeps the bypass available on success', async () => {
    const user = userEvent.setup();
    login.mockResolvedValue({ unauthorized: false });
    render(<AdminLogin isLocal />);

    await user.click(screen.getByRole('button', { name: '로컬 개발자 우회 로그인' }));

    expect(login).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('button', { name: '로컬 개발자 우회 로그인' })).toBeEnabled();
  });

  it('shows the authorization alert after the action reports unauthorized', async () => {
    const user = userEvent.setup();
    login.mockResolvedValue({ unauthorized: true });
    render(<AdminLogin isLocal />);

    await user.click(screen.getByRole('button', { name: '로컬 개발자 우회 로그인' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('인가 요청이 거부되었습니다.');
    expect(alert).toHaveClass(styles.errorMessage);
  });

  it('disables the button and swaps its label while the login transition is pending', async () => {
    const user = userEvent.setup();
    let resolveLogin: (value: { unauthorized: boolean }) => void = () => {};
    login.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        }),
    );
    render(<AdminLogin isLocal />);

    await user.click(screen.getByRole('button', { name: '로컬 개발자 우회 로그인' }));

    await waitFor(() => expect(screen.getByRole('button', { name: '진입 중...' })).toBeDisabled());

    resolveLogin({ unauthorized: false });

    await waitFor(() =>
      expect(screen.getByRole('button', { name: '로컬 개발자 우회 로그인' })).toBeEnabled(),
    );
  });
});

describe('AdminLogin access denied', () => {
  it('renders the access-denied card with the supplied error and the Zero Trust hint', () => {
    render(<AdminLogin isLocal={false} error="이메일이 허용 목록에 없습니다." />);

    expect(screen.getByText('접근 거부됨')).toHaveClass(styles.subtitle, styles.subtitleError);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('이메일이 허용 목록에 없습니다.');
    expect(alert).toHaveClass(styles.errorDescription);
    expect(alert.parentElement).toHaveClass(styles.errorContainer);
    expect(
      screen.getByText(
        'Cloudflare Zero Trust Access 정책(Include)에 등록된 올바른 관리자 이메일 계정으로 로그인해 주세요.',
      ),
    ).toHaveClass(styles.errorActionHint);
  });

  it('falls back to the default invalid-credentials message when no error is supplied', () => {
    render(<AdminLogin isLocal={false} />);

    expect(screen.getByRole('alert')).toHaveTextContent('이메일 인증 정보가 유효하지 않습니다.');
  });

  it('offers no bypass form on the denied branch', () => {
    render(<AdminLogin isLocal={false} error="접근 거부" />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('form')).toBeNull();
  });
});
