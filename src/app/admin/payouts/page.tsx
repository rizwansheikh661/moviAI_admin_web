'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import Tabs from '@/components/Tabs';
import Modal from '@/components/Modal';
import { payoutsApi } from '@/lib/api/resources';
import { ApiError } from '@/lib/api/client';
import type { Payout, PayoutStatus } from '@/lib/api/types';

const TABS = [
  { key: 'pending', label: 'Pending', icon: 'hourglass-split' },
  { key: 'paid', label: 'Paid', icon: 'check2-circle' },
  { key: 'failed', label: 'Failed', icon: 'x-octagon' },
];

const tone = (s: PayoutStatus | string) =>
  s === 'paid' ? 'success' : s === 'processing' ? 'info' : s === 'pending' ? 'warning' : 'danger';

type TabKey = 'pending' | 'paid' | 'failed';

export default function PayoutsPage() {
  const [active, setActive] = useState<TabKey>('pending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalRow, setModalRow] = useState<Payout | null>(null);
  const [bankRef, setBankRef] = useState('');
  const [note, setNote] = useState('');
  const qc = useQueryClient();

  const offset = (page - 1) * pageSize;
  // pending tab covers pending + processing — backend supports comma-separated status if needed;
  // here we default to "pending" status filter and let the backend group.
  const statusFilter = active;

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['admin', 'payouts', { statusFilter, pageSize, offset }],
    queryFn: () => payoutsApi.list({ status: statusFilter, limit: pageSize, offset }),
    placeholderData: keepPreviousData,
  });

  const rows = data?.items ?? [];
  const total = data?.total ?? rows.length;

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'payouts'] });

  const markPaidMutation = useMutation({
    mutationFn: () => {
      if (!modalRow) throw new Error('no row');
      const id = modalRow.publicId ?? String(modalRow.id);
      return payoutsApi.markPaid(id, { bankRef: bankRef || undefined, note: note || undefined });
    },
    onSuccess: () => {
      toast.success('Payout marked as paid. The driver has been notified.');
      setModalRow(null);
      setBankRef('');
      setNote('');
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't mark this payout as paid. Please try again."),
  });

  const retryMutation = useMutation({
    mutationFn: (id: string) => payoutsApi.retry(id),
    onSuccess: () => { toast.success('Payout queued for retry. We\u2019ll try again on the next sweep.'); invalidate(); },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't queue the retry. Please try again."),
  });

  const sweepMutation = useMutation({
    mutationFn: () => payoutsApi.runSweep(),
    onSuccess: () => { toast.success('Payout sweep started. Pending payouts will be processed shortly.'); invalidate(); },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't start the sweep. Please try again."),
  });

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
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div style={{ fontSize: '0.85rem', color: 'var(--brand-secondary)' }}>
            <i className="bi bi-bank me-2" />
            SEPA payouts run on the configured cadence. Trigger a manual sweep below.
          </div>
          <button
            className="btn btn-primary btn-sm"
            disabled={sweepMutation.isPending}
            onClick={() => sweepMutation.mutate()}
          >
            <i className="bi bi-play-circle me-1" /> {sweepMutation.isPending ? 'Running…' : 'Run payout sweep'}
          </button>
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
        {isError && (
          <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
            We couldn't load payouts. {(error as Error)?.message}
          </div>
        )}
        <div className="table-responsive" style={{ opacity: isFetching ? 0.65 : 1, transition: 'opacity 0.2s' }}>
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
              {isLoading ? (
                <tr><td colSpan={9} className="text-center text-muted py-4">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center" style={{ color: 'var(--brand-text-muted)', padding: '1.5rem 0' }}>
                    No payouts in this state.
                  </td>
                </tr>
              ) : (
                rows.map((p) => {
                  const pid = p.publicId ?? String(p.id);
                  return (
                    <tr key={pid}>
                      <td style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>{p.driverName}</td>
                      <td style={{ color: 'var(--brand-text-muted)', fontSize: '0.82rem' }}>
                        {p.periodStart} → {p.periodEnd}
                      </td>
                      <td className="text-end">€{p.grossAmount}</td>
                      <td className="text-end">€{p.deductions}</td>
                      <td className="text-end" style={{ fontWeight: 700 }}>€{p.netAmount}</td>
                      <td><StatusBadge tone={tone(p.status)}>{p.status}</StatusBadge></td>
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
                            onClick={() => { setModalRow(p); setBankRef(''); setNote(''); }}
                          >
                            Mark as paid
                          </button>
                        )}
                        {p.status === 'failed' && (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={retryMutation.isPending}
                            onClick={() => retryMutation.mutate(pid)}
                          >
                            {retryMutation.isPending ? 'Retrying…' : 'Retry'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </motion.div>

      <Modal
        show={!!modalRow}
        onHide={() => setModalRow(null)}
        title={modalRow ? `Mark payout for ${modalRow.driverName} as paid` : ''}
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setModalRow(null)}>Cancel</button>
            <button
              className="btn btn-primary btn-sm"
              disabled={markPaidMutation.isPending}
              onClick={() => markPaidMutation.mutate()}
            >
              {markPaidMutation.isPending ? 'Saving…' : 'Confirm'}
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
