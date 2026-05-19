'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Props = {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: ReactNode;
  accent?: 'primary' | 'secondary' | 'info' | 'warning';
  delay?: number;
};

const accentBg: Record<NonNullable<Props['accent']>, string> = {
  primary: 'rgba(168, 215, 41, 0.18)',
  secondary: 'rgba(10, 22, 51, 0.08)',
  info: 'rgba(59, 130, 246, 0.14)',
  warning: 'rgba(245, 158, 11, 0.14)',
};
const accentText: Record<NonNullable<Props['accent']>, string> = {
  primary: '#82a81f',
  secondary: '#0a1633',
  info: '#1d4ed8',
  warning: '#b45309',
};
const accentStripe: Record<NonNullable<Props['accent']>, string> = {
  primary: '#a8d729',
  secondary: '#0a1633',
  info: '#3b82f6',
  warning: '#f59e0b',
};

export default function StatCard({
  label,
  value,
  change,
  changePositive = true,
  icon,
  accent = 'primary',
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card h-100"
      style={{
        padding: '1.1rem 1.25rem',
        cursor: 'default',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderTop: `3px solid ${accentStripe[accent]}`,
        boxShadow: '0 1px 3px rgba(10, 22, 51, 0.06), 0 4px 12px rgba(10, 22, 51, 0.04)',
        borderRadius: 14,
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <span style={{ color: 'var(--brand-text-muted)', fontSize: '0.78rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        <span
          style={{
            background: accentBg[accent],
            color: accentText[accent],
            width: 34,
            height: 34,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            fontSize: '0.95rem',
          }}
        >
          {icon}
        </span>
      </div>
      <div
        style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--brand-secondary)',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {change && (
        <div className="mt-2" style={{ fontSize: '0.75rem' }}>
          <span style={{ color: changePositive ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
            <i className={`bi bi-arrow-${changePositive ? 'up' : 'down'}-right me-1`} />
            {change}
          </span>
          <span style={{ color: 'var(--brand-text-muted)' }}> vs last week</span>
        </div>
      )}
    </motion.div>
  );
}
