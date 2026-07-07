import PrivacyEn from '@/lib/content/privacy/privacy.en.mdx';

export const metadata = {
  title: 'Privacy Policy | Junwon\'s Portfolio',
  description: 'Privacy Policy for Junwon\'s personal portfolio website.',
};

export default function PrivacyPage() {
  return (
    <main className="content" style={{ paddingBottom: 'var(--space-lg)' }}>
      <div style={{ marginTop: 'var(--space-md)' }}>
        <PrivacyEn />
      </div>
    </main>
  );
}
