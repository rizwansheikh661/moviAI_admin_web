'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';

type CommissionType = 'Flat %' | 'Tiered' | 'Per-ride flat' | 'Hybrid' | 'Surge multiplier';

type Plan = {
  id: string;
  name: string;
  type: CommissionType;
  rate: string;
  appliesTo: string;
  tenants: number;
  status: 'Active' | 'Draft' | 'Archived';
};

const PLANS: Plan[] = [
  { id: '1', name: 'Standard 15%', type: 'Flat %', rate: '15%', appliesTo: 'All tenants', tenants: 12, status: 'Active' },
  { id: '2', name: 'Growth Tiered', type: 'Tiered', rate: '12%–18%', appliesTo: 'Growth plan', tenants: 6, status: 'Active' },
  { id: '3', name: 'Trial Discount', type: 'Flat %', rate: '5%', appliesTo: 'Trial', tenants: 4, status: 'Active' },
  { id: '4', name: 'Flat £1 per ride', type: 'Per-ride flat', rate: '£1.00', appliesTo: 'CityRide UK', tenants: 1, status: 'Active' },
  { id: '5', name: 'Hybrid Pro', type: 'Hybrid', rate: '8% + £0.50', appliesTo: 'Enterprise', tenants: 2, status: 'Active' },
  { id: '6', name: 'Surge 1.5x', type: 'Surge multiplier', rate: '×1.5 peak', appliesTo: 'Opt-in', tenants: 3, status: 'Active' },
  { id: '7', name: 'Legacy 20%', type: 'Flat %', rate: '20%', appliesTo: 'Pre-2026 cohort', tenants: 0, status: 'Archived' },
  { id: '8', name: 'Pilot Scheme', type: 'Tiered', rate: '10%–15%', appliesTo: 'Pilot tenants', tenants: 0, status: 'Draft' },
];

const tone = (s: Plan['status']) => (s === 'Active' ? 'success' : s === 'Draft' ? 'info' : 'neutral');

export default function CommissionPlansPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return PLANS;
    return PLANS.filter((p) => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
  }, [query]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader
        title="Commission Plans"
        subtitle="5 plan types · configure how MoviAI takes its cut per tenant"
        actions={
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-1" /> New Plan
          </button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ padding: '1rem 1.25rem' }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <div className="position-relative" style={{ flex: '1 1 240px', maxWidth: 320 }}>
            <i
              className="bi bi-search position-absolute"
              style={{ top: '50%', left: 12, transform: 'translateY(-50%)', color: 'var(--brand-text-muted)', fontSize: '0.85rem' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search plans…"
              className="form-control form-control-sm"
              style={{ paddingLeft: 34 }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Type</th>
                <th>Rate</th>
                <th>Applies to</th>
                <th className="text-end">Tenants</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <td style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>{p.name}</td>
                  <td>{p.type}</td>
                  <td style={{ fontWeight: 600 }}>{p.rate}</td>
                  <td>{p.appliesTo}</td>
                  <td className="text-end">{p.tenants}</td>
                  <td>
                    <StatusBadge tone={tone(p.status)}>{p.status}</StatusBadge>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-1">
                      <button className="btn-icon" title="Edit">
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="btn-icon" title="Duplicate">
                        <i className="bi bi-files" />
                      </button>
                      <button className="btn-icon" title="More">
                        <i className="bi bi-three-dots" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </motion.div>
    </div>
  );
}
