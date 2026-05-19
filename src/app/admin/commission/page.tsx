'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';

export default function AdminCommissionPage() {
  return (
    <div>
      <PageHeader
        title="Commission"
        subtitle="Your active commission plan with MoviAI"
        actions={
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-question-circle me-1" /> Request change
          </button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card mb-3"
        style={{ padding: '1.5rem 1.75rem' }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-text-muted)' }}>
              Current plan
            </div>
            <h4 className="mb-1" style={{ color: 'var(--brand-secondary)', fontWeight: 800, fontSize: '1.3rem' }}>
              Growth Tiered
            </h4>
            <small style={{ color: 'var(--brand-text-muted)' }}>Active since 2026-02-10</small>
          </div>
          <StatusBadge tone="success">Active</StatusBadge>
        </div>

        <div className="row g-3">
          <Metric label="Base rate" value="15%" />
          <Metric label="Tiered above £10k/mo" value="12%" />
          <Metric label="Tiered above £30k/mo" value="10%" />
          <Metric label="Min per ride" value="£0.50" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="card"
        style={{ padding: '1.5rem 1.75rem' }}
      >
        <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700 }}>How it works</h6>
        <p style={{ fontSize: '0.85rem', color: 'var(--brand-text-muted)', lineHeight: 1.6 }}>
          MoviAI deducts the commission from each completed ride. The rate adjusts automatically based on your monthly
          GMV — the more rides your tenants complete, the lower the commission percentage. Invoices are issued on the
          1st of each month for the previous period.
        </p>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-file-earmark-text me-1" /> View contract
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-receipt me-1" /> Past invoices
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-6 col-md-3">
      <div
        className="p-3"
        style={{ background: 'var(--brand-bg-soft)', borderRadius: 10, border: '1px solid var(--brand-border)' }}
      >
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-text-muted)' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-secondary)', marginTop: 4 }}>{value}</div>
      </div>
    </div>
  );
}
