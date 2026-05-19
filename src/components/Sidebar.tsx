'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from './Logo';

export type NavItem = {
  href: string;
  label: string;
  icon: string; // bootstrap-icons class suffix, e.g. 'speedometer2'
  badge?: string;
};

export const SUPER_NAV: NavItem[] = [
  { href: '/super/dashboard', label: 'Dashboard', icon: 'speedometer2' },
  { href: '/super/tenants', label: 'Tenants', icon: 'building' },
  { href: '/super/tenants/new', label: 'Add Tenant', icon: 'plus-square' },
  { href: '/super/commission', label: 'Commission Plans', icon: 'cash-coin' },
  { href: '/super/billing', label: 'Billing', icon: 'receipt' },
  { href: '/super/settings', label: 'Settings', icon: 'gear' },
];

export const ADMIN_NAV: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'speedometer2' },
  { href: '/admin/drivers', label: 'Drivers', icon: 'person-badge' },
  { href: '/admin/rides', label: 'Rides', icon: 'car-front' },
  { href: '/admin/commission', label: 'Commission', icon: 'cash-coin' },
  { href: '/admin/settings', label: 'Settings', icon: 'gear' },
];

type Props = { items: NavItem[]; roleLabel: string };

export default function Sidebar({ items, roleLabel }: Props) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 260,
        background: 'var(--brand-bg-sidebar)',
        borderRight: '1px solid var(--brand-border)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
      }}
    >
      <div className="px-2 mb-4">
        <Logo size="md" />
        <div
          className="mt-2"
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--brand-text-muted)',
          }}
        >
          {roleLabel}
        </div>
      </div>

      <nav className="d-flex flex-column gap-1 flex-grow-1">
        {items.map((item, i) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.3 }}
            >
              <Link
                href={item.href}
                className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none"
                style={{
                  borderRadius: 10,
                  background: active ? 'var(--brand-primary)' : 'transparent',
                  color: active ? '#0a1633' : 'var(--brand-text)',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.92rem',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--brand-bg-page)';
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <i className={`bi bi-${item.icon}`} style={{ fontSize: '1.1rem' }} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className="ms-auto"
                    style={{
                      fontSize: '0.7rem',
                      background: 'var(--brand-secondary)',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: 999,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div
        className="mt-3 p-3"
        style={{
          background: 'var(--brand-bg-page)',
          borderRadius: 12,
          fontSize: '0.82rem',
          color: 'var(--brand-text-muted)',
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>Need help?</div>
        <div className="mt-1">Read the docs or contact support.</div>
      </div>
    </aside>
  );
}
