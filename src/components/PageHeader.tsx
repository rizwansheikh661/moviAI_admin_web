'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
};

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3"
    >
      <div>
        <h5 className="mb-0" style={{ color: 'var(--brand-secondary)', fontWeight: 700 }}>
          {title}
        </h5>
        {subtitle && (
          <small style={{ color: 'var(--brand-text-muted)' }}>{subtitle}</small>
        )}
      </div>
      {actions && <div className="d-flex align-items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
