'use client';

import { useState,useTransition } from 'react';

import * as styles from './login.css';

import { login } from '../actions';

interface AdminLoginProps {
  isLocal: boolean;
  error?: string | null;
}

export function AdminLogin({ isLocal, error }: AdminLoginProps) {
  const [isPending, startTransition] = useTransition();
  const [unauthorized, setUnauthorized] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await login();
      if (res?.unauthorized) {
        setUnauthorized(true);
      }
    });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Admin Area</h2>

        {isLocal ? (
          <>
            <p className={styles.subtitle}>
              로컬 개발 환경입니다. 아래 버튼을 클릭하면 비밀번호 없이 즉시 관리자 대시보드로 진입합니다.
            </p>

            <form onSubmit={handleLogin}>
              {unauthorized && (
                <p className={styles.errorMessage}>인가 요청이 거부되었습니다.</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className={styles.loginButton}
              >
                {isPending ? '진입 중...' : '로컬 개발자 우회 로그인'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className={styles.subtitle} style={{ color: 'var(--color-error, #e00)' }}>
              접근 거부됨
            </p>

            <div className={styles.errorContainer}>
              <p className={styles.errorDescription}>
                {error || '이메일 인증 정보가 유효하지 않습니다.'}
              </p>
              <p className={styles.errorActionHint}>
                Cloudflare Zero Trust Access 정책(Include)에 등록된 올바른 관리자 이메일 계정으로 로그인해 주세요.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
