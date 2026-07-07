import PrivacyKo from '@/lib/content/privacy/privacy.ko.mdx';

export const metadata = {
  title: '개인정보 처리방침 | 박준원 포트폴리오',
  description: '박준원의 개인 포트폴리오 웹사이트 개인정보 처리방침입니다.',
};

export default function PrivacyPage() {
  return (
    <main className="content" style={{ paddingBottom: 'var(--space-lg)' }}>
      <div style={{ marginTop: 'var(--space-md)' }}>
        <PrivacyKo />
      </div>
    </main>
  );
}
