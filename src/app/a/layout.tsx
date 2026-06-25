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
