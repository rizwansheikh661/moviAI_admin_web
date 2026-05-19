'use client';

import { motion } from 'framer-motion';

type Props = { title: string; subtitle?: string };

export default function Topbar({ title, subtitle }: Props) {
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
        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          style={{ borderRadius: 999 }}
        >
          <i className="bi bi-bell" />
          <span className="d-none d-md-inline">Notifications</span>
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
            3
          </span>
        </button>

        <div
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
            <div style={{ fontSize: '0.68rem', color: 'var(--brand-text-muted)' }}>
              Super Admin
            </div>
          </div>
          <i className="bi bi-chevron-down" style={{ color: 'var(--brand-text-muted)' }} />
        </div>
      </div>
    </header>
  );
}
