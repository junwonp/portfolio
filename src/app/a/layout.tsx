import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 대시보드 | 박준원',
  description: '포트폴리오 방문자 분석, 세션 추적, 지원 링크 관리 대시보드입니다.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrapper is-admin">
      <div className="content-wrapper">
        <main id="main-content" className="content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
