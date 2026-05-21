'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import Tabs from '@/components/Tabs';
import { commissionApi } from '@/lib/api/resources';
import { ApiError } from '@/lib/api/client';

const TABS = [
  { key: 'config', label: 'Config', icon: 'sliders' },
  { key: 'ledger', label: 'Ledger', icon: 'list-columns' },
  { key: 'summary', label: 'Summary', icon: 'graph-up' },
];

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminCommissionPage() {
  const [active, setActive] = useState('config');
  const qc = useQueryClient();

  // --- Config ---
  const configQuery = useQuery({
    queryKey: ['admin', 'commission', 'config'],
    queryFn: () => commissionApi.getConfig().then((r) => r.data),
  });

  const [pct, setPct] = useState<string>('');
  const [cadence, setCadence] = useState<string>('weekly');
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [hydrated, setHydrated] = useState(false);

  if (configQuery.data && !hydrated) {
    setPct(configQuery.data.commissionPct);
    setCadence(configQuery.data.cadence);
    setDayOfWeek(configQuery.data.dayOfWeek);
    setHydrated(true);
  }

  const saveMutation = useMutation({
    mutationFn: () =>
      commissionApi.updateConfig({
        commissionPct: Number(pct),
        cadence,
        dayOfWeek,
      }),
    onSuccess: () => {
      toast.success('Commission settings saved');
      qc.invalidateQueries({ queryKey: ['admin', 'commission', 'config'] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Save failed'),
  });

  // --- Ledger ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const offset = (page - 1) * pageSize;

  const ledgerQuery = useQuery({
    queryKey: ['admin', 'commission', 'ledger', { pageSize, offset }],
    queryFn: () => commissionApi.ledger({ limit: pageSize, offset }),
    enabled: active === 'ledger',
    placeholderData: keepPreviousData,
  });

  const ledgerRows = ledgerQuery.data?.items ?? [];
  const ledgerTotal = ledgerQuery.data?.total ?? ledgerRows.length;

  // --- Summary ---
  const summaryQuery = useQuery({
    queryKey: ['admin', 'commission', 'summary'],
    queryFn: () => commissionApi.summary().then((r) => r.data),
    enabled: active === 'summary',
  });

  return (
    <div>
      <PageHeader title="Commission" subtitle="Platform commission and ledger" />

      <Tabs tabs={TABS} activeKey={active} onChange={setActive} />

      {active === 'config' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
          style={{ padding: '1.5rem 1.75rem', maxWidth: 560 }}
        >
          {configQuery.isLoading ? (
            <div className="text-muted py-3">Loading config…</div>
          ) : configQuery.isError ? (
            <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
              Failed to load config: {(configQuery.error as Error)?.message}
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600 }}>Commission %</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={pct}
                  onChange={(e) => setPct(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: 200 }}
                />
                <small style={{ color: 'var(--brand-text-muted)' }}>
                  Applied globally to every ride. Live within 60 seconds after save.
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600 }}>Payout cadence</label>
                <select
                  className="form-select"
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value)}
                  style={{ maxWidth: 200 }}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600 }}>Payout day</label>
                <select
                  className="form-select"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(Number(e.target.value))}
                  style={{ maxWidth: 200 }}
                >
                  {DOW_LABELS.map((d, i) => (
                    <option key={i} value={i}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="mt-3">
                <button
                  className="btn btn-primary btn-sm"
                  disabled={saveMutation.isPending || !pct}
                  onClick={() => saveMutation.mutate()}
                >
                  {saveMutation.isPending ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {active === 'ledger' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
          style={{ padding: '1rem 1.25rem' }}
        >
          {ledgerQuery.isError && (
            <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
              Failed to load ledger: {(ledgerQuery.error as Error)?.message}
            </div>
          )}
          <div className="table-responsive" style={{ opacity: ledgerQuery.isFetching ? 0.65 : 1, transition: 'opacity 0.2s' }}>
            <table className="table table-sm table-hover align-middle">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Ref type</th>
                  <th>Dir</th>
                  <th className="text-end">Amount</th>
                  <th className="text-end">Balance after</th>
                  <th>Ride</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {ledgerQuery.isLoading ? (
                  <tr><td colSpan={7} className="text-center text-muted py-4">Loading…</td></tr>
                ) : ledgerRows.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-muted py-4">No ledger entries</td></tr>
                ) : (
                  ledgerRows.map((e, i) => (
                    <tr key={e.id ?? i}>
                      <td style={{ color: 'var(--brand-text-muted)' }}>
                        {e.ts?.replace('T', ' ').slice(0, 16)}
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>
                        {e.refType?.replace(/_/g, ' ')}
                      </td>
                      <td>
                        <i
                          className={`bi bi-arrow-${e.direction === 'credit' ? 'down-left' : 'up-right'}`}
                          style={{ color: e.direction === 'credit' ? '#16a34a' : '#dc2626' }}
                        />{' '}
                        {e.direction}
                      </td>
                      <td
                        className="text-end"
                        style={{
                          color: e.direction === 'credit' ? '#16a34a' : '#dc2626',
                          fontWeight: 600,
                        }}
                      >
                        {e.direction === 'credit' ? '+' : '−'}€{e.amount}
                      </td>
                      <td className="text-end">€{e.balanceAfter}</td>
                      <td>
                        {e.rideId ? (
                          <Link
                            href={`/admin/rides/${e.rideId}`}
                            style={{ textDecoration: 'none', color: 'var(--brand-secondary)', fontWeight: 600 }}
                          >
                            {e.rideId}
                          </Link>
                        ) : (
                          <span style={{ color: 'var(--brand-text-muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--brand-text-muted)' }}>
                        {e.reason}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={ledgerTotal}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </motion.div>
      )}

      {active === 'summary' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
          style={{ padding: '1.5rem 1.75rem' }}
        >
          {summaryQuery.isLoading ? (
            <div className="text-muted py-3">Loading summary…</div>
          ) : summaryQuery.isError ? (
            <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
              Failed to load summary: {(summaryQuery.error as Error)?.message}
            </div>
          ) : summaryQuery.data ? (
            <>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <div style={{ fontSize: '0.78rem', color: 'var(--brand-text-muted)' }}>Total commission</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--brand-secondary)' }}>
                    €{summaryQuery.data.totalCommission}
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div style={{ fontSize: '0.78rem', color: 'var(--brand-text-muted)' }}>Total refunds</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#dc2626' }}>
                    €{summaryQuery.data.totalRefunds}
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div style={{ fontSize: '0.78rem', color: 'var(--brand-text-muted)' }}>Ride count</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--brand-secondary)' }}>
                    {summaryQuery.data.rideCount}
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr><th>Date</th><th className="text-end">Commission</th><th className="text-end">Rides</th></tr>
                  </thead>
                  <tbody>
                    {(summaryQuery.data.byDay ?? []).length === 0 ? (
                      <tr><td colSpan={3} className="text-center text-muted py-3">No data</td></tr>
                    ) : (
                      summaryQuery.data.byDay.map((d) => (
                        <tr key={d.date}>
                          <td>{d.date}</td>
                          <td className="text-end" style={{ fontWeight: 600 }}>€{d.commission}</td>
                          <td className="text-end">{d.rides}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </motion.div>
      )}
    </div>
  );
}
