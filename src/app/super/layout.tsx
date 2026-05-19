import Sidebar, { SUPER_NAV } from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function SuperLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar items={SUPER_NAV} roleLabel="Super Admin" />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title="Super Admin" subtitle="Cross-tenant control plane" />
        <div style={{ padding: '1.75rem', flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}
