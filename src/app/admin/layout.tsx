import Sidebar, { ADMIN_NAV } from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar items={ADMIN_NAV} roleLabel="Tenant Admin" />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title="Dashboard" subtitle="CityRide UK · demo tenant" />
        <div style={{ padding: '1.75rem', flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}
