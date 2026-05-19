'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';

type Invoice = {
  id: string;
  tenant: string;
  period: string;
  amount: string;
  commission: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  issuedAt: string;
};

const INVOICES: Invoice[] = [
  { id: 'INV-2026-0421', tenant: 'CityRide UK', period: 'Apr 2026', amount: '£ 12,480', commission: '£ 1,872', status: 'Paid', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0422', tenant: 'EuroCab Berlin', period: 'Apr 2026', amount: '€ 8,910', commission: '€ 1,337', status: 'Paid', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0423', tenant: 'ParisGo', period: 'Apr 2026', amount: '€ 4,220', commission: '€ 422', status: 'Pending', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0424', tenant: 'Madrid Wheels', period: 'Apr 2026', amount: '€ 3,180', commission: '€ 477', status: 'Paid', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0425', tenant: 'Rome Cabs', period: 'Apr 2026', amount: '€ 920', commission: '€ 46', status: 'Overdue', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0426', tenant: 'Amsterdam Move', period: 'Apr 2026', amount: '€ 5,640', commission: '€ 846', status: 'Paid', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0427', tenant: 'Lisboa Rides', period: 'Apr 2026', amount: '€ 1,980', commission: '€ 198', status: 'Pending', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0428', tenant: 'Vienna Drive', period: 'Apr 2026', amount: '€ 880', commission: '€ 44', status: 'Pending', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0429', tenant: 'Warsaw Wheels', period: 'Apr 2026', amount: 'zł 6,210', commission: 'zł 621', status: 'Paid', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0430', tenant: 'Prague Pickup', period: 'Apr 2026', amount: 'Kč 38,400', commission: 'Kč 3,840', status: 'Paid', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0431', tenant: 'Brussels Cab', period: 'Apr 2026', amount: '€ 3,420', commission: '€ 513', status: 'Paid', issuedAt: '2026-05-01' },
  { id: 'INV-2026-0432', tenant: 'Dublin Ride', period: 'Apr 2026', amount: '€ 2,180', commission: '€ 218', status: 'Pending', issuedAt: '2026-05-01' },
];

const tone = (s: Invoice['status']) => (s === 'Paid' ? 'success' : s === 'Pending' ? 'info' : 'danger');

export default function BillingPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<'all' | Invoice['status']>('all');

  const filtered = useMemo(
    () => (status === 'all' ? INVOICES : INVOICES.filter((i) => i.status === status)),
    [status]
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader
        title="Billing"
        subtitle="Tenant invoices · MoviAI commission collection"
        actions={
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-file-earmark-arrow-down me-1" /> Export CSV
          </button>
        }
      />

      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard label="MRR" value="€ 18.4K" change="+6.2%" changePositive accent="primary" icon={<i className="bi bi-graph-up" />} delay={0} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard label="Outstanding" value="€ 4.2K" accent="warning" icon={<i className="bi bi-hourglass-split" />} delay={0.06} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard label="Overdue" value="€ 0.9K" accent="info" icon={<i className="bi bi-exclamation-circle" />} delay={0.12} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard label="Paid (30d)" value="€ 41.3K" change="+8.1%" changePositive accent="secondary" icon={<i className="bi bi-check2-circle" />} delay={0.18} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ padding: '1rem 1.25rem' }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as typeof status);
              setPage(1);
            }}
            className="form-select form-select-sm"
            style={{ width: 160 }}
          >
            <option value="all">All invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Tenant</th>
                <th>Period</th>
                <th className="text-end">GMV</th>
                <th className="text-end">Commission</th>
                <th>Status</th>
                <th>Issued</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <td style={{ fontWeight: 600, color: 'var(--brand-secondary)', fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>
                    {inv.id}
                  </td>
                  <td>{inv.tenant}</td>
                  <td>{inv.period}</td>
                  <td className="text-end">{inv.amount}</td>
                  <td className="text-end" style={{ fontWeight: 600 }}>
                    {inv.commission}
                  </td>
                  <td>
                    <StatusBadge tone={tone(inv.status)}>{inv.status}</StatusBadge>
                  </td>
                  <td style={{ color: 'var(--brand-text-muted)' }}>{inv.issuedAt}</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-1">
                      <button className="btn-icon" title="View">
                        <i className="bi bi-eye" />
                      </button>
                      <button className="btn-icon" title="Download">
                        <i className="bi bi-download" />
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
