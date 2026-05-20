'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import Tabs from '@/components/Tabs';
import Modal from '@/components/Modal';
import { MOCK_PAYOUTS, MockPayout, PayoutStatus } from '@/lib/mock';

const TABS = [
  { key: 'pending', label: 'Pending', icon: 'hourglass-split' },
  { key: 'paid', label: 'Paid', icon: 'check2-circle' },
  { key: 'failed', label: 'Failed', icon: 'x-octagon' },
];

const tone = (s: PayoutStatus) =>
  s === 'paid' ? 'success' : s === 'processing' ? 'info' : s === 'pending' ? 'warning' : 'danger';

type TabKey = 'pending' | 'paid' | 'failed';

export default function PayoutsPage() {
  const [active, setActive] = useState<TabKey>('pending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalRow, setModalRow] = useState<MockPayout | null>(null);
  const [bankRef, setBankRef] = useState('');
  const [note, setNote] = useState('');

  const list = useMemo(() => {
    if (active === 'pending') {
      return MOCK_PAYOUTS.filter((p) => p.status === 'pending' || p.status === 'processing');
    }
    return MOCK_PAYOUTS.filter((p) => p.status === active);
  }, [active]);

  const paged = list.slice((page - 1) * pageSize, page * pageSize);

  const onTabChange = (k: string) => {
    setActive(k as TabKey);
    setPage(1);
  };

  return (
    <div>
      <PageHeader title="Payouts" subtitle="Driver payouts and SEPA batch cycles" />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card mb-3"
        style={{
          padding: '1rem 1.25rem',
          background:
            'linear-gradient(135deg, rgba(168, 215, 41, 0.14) 0%, rgba(59, 130, 246, 0.10) 100%)',
        }}
      >
        <div style={{ fontSize: '0.85rem', color: 'var(--brand-secondary)' }}>
          <i className="bi bi-bank me-2" />
          <strong>Next SEPA cycle:</strong> Monday 06:00 UTC ·{' '}
          <strong>Last run:</strong> 2026-05-19 06:01 · 23 paid · 1 failed
        </div>
      </motion.div>

      <Tabs tabs={TABS} activeKey={active} onChange={onTabChange} />

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="card"
        style={{ padding: '1rem 1.25rem' }}
      >
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Period</th>
                <th className="text-end">Gross</th>
                <th className="text-end">Deductions</th>
                <th className="text-end">Net</th>
                <th>Status</th>
                <th>Paid at</th>
                <th>Bank ref</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                    {p.driverName}
                  </td>
                  <td style={{ color: 'var(--brand-text-muted)', fontSize: '0.82rem' }}>
                    {p.periodStart} → {p.periodEnd}
                  </td>
                  <td className="text-end">€{p.grossAmount}</td>
                  <td className="text-end">€{p.deductions}</td>
                  <td className="text-end" style={{ fontWeight: 700 }}>
                    €{p.netAmount}
                  </td>
                  <td>
                    <StatusBadge tone={tone(p.status)}>{p.status}</StatusBadge>
                  </td>
                  <td style={{ color: 'var(--brand-text-muted)', fontSize: '0.82rem' }}>
                    {p.paidAt ? p.paidAt.replace('T', ' ').slice(0, 16) : '—'}
                  </td>
                  <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>
                    {p.bankRef ?? '—'}
                  </td>
                  <td className="text-end">
                    {p.status === 'pending' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setModalRow(p);
                          setBankRef('');
                          setNote('');
                        }}
                      >
                        Mark as paid
                      </button>
                    )}
                    {p.status === 'failed' && (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => alert('Retry queued. (mock)')}
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center" style={{ color: 'var(--brand-text-muted)', padding: '1.5rem 0' }}>
                    No payouts in this state.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={list.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </motion.div>

      <Modal
        show={!!modalRow}
        onHide={() => setModalRow(null)}
        title={modalRow ? `Mark payout for ${modalRow.driverName} as paid` : ''}
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setModalRow(null)}>
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                alert(`Marked as paid. Bank ref: ${bankRef}. (mock)`);
                setModalRow(null);
              }}
            >
              Confirm
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label">Bank reference</label>
          <input
            className="form-control"
            value={bankRef}
            onChange={(e) => setBankRef(e.target.value)}
            placeholder="SEPA-202605xxxx"
          />
        </div>
        <div>
          <label className="form-label">Note</label>
          <textarea
            className="form-control"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note for ledger…"
          />
        </div>
      </Modal>
    </div>
  );
}
