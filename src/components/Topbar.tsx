'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/api/auth';
import { getUser, AdminUser } from '@/lib/api/auth-storage';

type Props = { subtitle?: string };

const ROUTE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/drivers': 'Drivers',
  '/admin/rides': 'Rides',
  '/admin/commission': 'Commission',
  '/admin/payouts': 'Payouts',
  '/admin/settings': 'Settings',
  '/admin/riders': 'Riders',
  '/admin/coupons': 'Coupons',
  '/admin/audit': 'Audit Log',
};

function resolveTitle(pathname: string | null): string {
  if (!pathname) return 'Admin';
  let best: string | null = null;
  for (const route of Object.keys(ROUTE_TITLES)) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      if (!best || route.length > best.length) best = route;
    }
  }
  return best ? ROUTE_TITLES[best] : 'Admin';
}

function initials(name: string | null | undefined, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'A';
  }
  return email.slice(0, 2).toUpperCase();
}

export default function Topbar({ subtitle }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const title = resolveTitle(pathname);

  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    router.push('/login');
  };

  const displayName = user?.fullName ?? user?.email ?? 'Admin';
  const displayEmail = user?.email ?? '';
  const roleLabel = user?.role === 'superadmin' ? 'Super Admin' : 'Admin';

  return (
    <header
      className="d-flex align-items-center justify-content-between"
      style={{
        padding: '1.25rem 1.75rem',
        background: '#fff',
        borderBottom: '1px solid var(--brand-border)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <motion.div
        key={title}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h4 className="mb-0" style={{ color: 'var(--brand-secondary)', fontWeight: 700, fontSize: '1.15rem' }}>
          {title}
        </h4>
        {subtitle && (
          <div style={{ color: 'var(--brand-text-muted)', fontSize: '0.78rem', marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </motion.div>

      <div className="d-flex align-items-center gap-3">
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setProfileOpen((v) => !v)}
            className="d-flex align-items-center gap-2 px-2 py-1"
            style={{ borderRadius: 999, cursor: 'pointer' }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--brand-secondary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              {initials(user?.fullName ?? null, displayEmail)}
            </div>
            <div className="d-none d-md-block">
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-secondary)' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--brand-text-muted)' }}>{roleLabel}</div>
            </div>
            <i className="bi bi-chevron-down" style={{ color: 'var(--brand-text-muted)' }} />
          </div>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 240,
                  background: '#fff',
                  border: '1px solid var(--brand-border)',
                  borderRadius: 12,
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 20,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--brand-border)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--brand-secondary)', fontSize: '0.88rem' }}>
                    {displayName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--brand-text-muted)' }}>
                    {displayEmail}
                  </div>
                </div>
                <ProfileItem icon="clock-history" label="Activity log" onClick={() => { setProfileOpen(false); router.push('/admin/audit'); }} />
                <ProfileItem icon="sliders" label="Settings" onClick={() => { setProfileOpen(false); router.push('/admin/settings'); }} />
                <div style={{ borderTop: '1px solid var(--brand-border)' }}>
                  <ProfileItem icon="box-arrow-right" label="Logout" danger onClick={handleLogout} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function ProfileItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="d-flex align-items-center gap-2 w-100 text-start"
      style={{
        padding: '0.6rem 1rem',
        background: 'none',
        border: 'none',
        color: danger ? '#ef4444' : 'var(--brand-secondary)',
        fontSize: '0.82rem',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      <i className={`bi bi-${icon}`} style={{ fontSize: '0.95rem' }} />
      {label}
    </button>
  );
}
