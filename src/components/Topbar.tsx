'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_NOTIFICATIONS, MockNotification, NotificationKind } from '@/lib/mock';

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

const NOTIF_ICON: Record<NotificationKind, string> = {
  kyc: 'person-badge',
  ride: 'car-front',
  payout: 'cash-coin',
  complaint: 'exclamation-triangle',
  coupon: 'ticket-perforated',
};

const NOTIF_COLOR: Record<NotificationKind, string> = {
  kyc: '#f59e0b',
  ride: '#3b82f6',
  payout: '#10b981',
  complaint: '#ef4444',
  coupon: '#8b5cf6',
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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function Topbar({ subtitle }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const title = resolveTitle(pathname);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState<MockNotification[]>(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter((n) => n.unread).length;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  const openNotif = (n: MockNotification) => {
    setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
    setNotifOpen(false);
    router.push(n.href);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    router.push('/login');
  };

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
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            style={{ borderRadius: 999 }}
          >
            <i className="bi bi-bell" />
            <span className="d-none d-md-inline">Notifications</span>
            {unreadCount > 0 && (
              <span
                style={{
                  background: 'var(--brand-primary)',
                  color: '#0a1633',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 999,
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 360,
                  background: '#fff',
                  border: '1px solid var(--brand-border)',
                  borderRadius: 12,
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 20,
                  overflow: 'hidden',
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--brand-border)',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--brand-secondary)', fontSize: '0.9rem' }}>
                    Notifications
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--brand-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                  {notifs.length === 0 ? (
                    <div
                      style={{
                        padding: '2rem 1rem',
                        textAlign: 'center',
                        color: 'var(--brand-text-muted)',
                        fontSize: '0.85rem',
                      }}
                    >
                      No notifications
                    </div>
                  ) : (
                    notifs.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => openNotif(n)}
                        className="d-flex gap-2 w-100 text-start"
                        style={{
                          padding: '0.75rem 1rem',
                          background: n.unread ? 'rgba(168, 215, 41, 0.06)' : '#fff',
                          border: 'none',
                          borderBottom: '1px solid var(--brand-border)',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: `${NOTIF_COLOR[n.kind]}1a`,
                            color: NOTIF_COLOR[n.kind],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: '0.9rem',
                          }}
                        >
                          <i className={`bi bi-${NOTIF_ICON[n.kind]}`} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: n.unread ? 700 : 500,
                              color: 'var(--brand-secondary)',
                              fontSize: '0.82rem',
                            }}
                          >
                            {n.title}
                          </div>
                          <div
                            style={{
                              color: 'var(--brand-text-muted)',
                              fontSize: '0.74rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {n.body}
                          </div>
                          <div style={{ color: 'var(--brand-text-muted)', fontSize: '0.7rem', marginTop: 2 }}>
                            {timeAgo(n.ts)}
                          </div>
                        </div>
                        {n.unread && (
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: 'var(--brand-primary)',
                              alignSelf: 'center',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </button>
                    ))
                  )}
                </div>
                <Link
                  href="/admin/audit"
                  onClick={() => setNotifOpen(false)}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.7rem 1rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--brand-secondary)',
                    textDecoration: 'none',
                    borderTop: '1px solid var(--brand-border)',
                    background: '#fafbfc',
                  }}
                >
                  View all activity
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
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
              RS
            </div>
            <div className="d-none d-md-block">
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-secondary)' }}>
                Rizwan Sheikh
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--brand-text-muted)' }}>Admin</div>
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
                    Rizwan Sheikh
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--brand-text-muted)' }}>
                    rizwan@moviai.app
                  </div>
                </div>
                <ProfileItem icon="person-circle" label="My profile" onClick={() => { setProfileOpen(false); router.push('/admin/settings'); }} />
                <ProfileItem icon="clock-history" label="Activity log" onClick={() => { setProfileOpen(false); router.push('/admin/audit'); }} />
                <ProfileItem icon="sliders" label="Preferences" onClick={() => { setProfileOpen(false); router.push('/admin/settings'); }} />
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
