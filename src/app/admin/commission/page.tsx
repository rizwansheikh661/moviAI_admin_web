'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import Tabs from '@/components/Tabs';
import { MOCK_LEDGER } from '@/lib/mock';

const TABS = [
  { key: 'config', label: 'Config', icon: 'sliders' },
  { key: 'ledger', label: 'Ledger', icon: 'list-columns' },
  { key: 'summary', label: 'Summary', icon: 'graph-up' },
];

export default function AdminCommissionPage() {
  const [active, setActive] = useState('config');
  const [pct, setPct] = useState('20.00');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paged = useMemo(
    () => MOCK_LEDGER.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize]
  );

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
          style={{ padding: '1.5rem 1.75rem', maxWidth: 520 }}
        >
          <label className="form-label" style={{ fontWeight: 600 }}>
            Commission %
          </label>
          <input
            type="number"
            step="0.01"
            value={pct}
            onChange={(e) => setPct(e.target.value)}
            className="form-control"
            style={{ maxWidth: 200 }}
          />
          <small style={{ color: 'var(--brand-text-muted)', marginTop: 6 }}>
            Applied globally to every ride. Live within 60 seconds after save.
          </small>
          <div className="mt-3">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => alert('Saved. Real wiring next PR.')}
            >
              Save
            </button>
          </div>
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
          <div className="table-responsive">
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
                {paged.map((e) => (
                  <tr key={e.id}>
                    <td style={{ color: 'var(--brand-text-muted)' }}>
                      {e.ts.replace('T', ' ').slice(0, 16)}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {e.refType.replace(/_/g, ' ')}
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
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={MOCK_LEDGER.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </motion.div>
      )}

      {active === 'summary' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
          style={{
            padding: '2rem 1.5rem',
            minHeight: 360,
            background:
              'linear-gradient(135deg, rgba(168, 215, 41, 0.18) 0%, rgba(10, 22, 51, 0.10) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-secondary)',
            fontWeight: 600,
          }}
        >
          <div className="text-center">
            <i
              className="bi bi-graph-up"
              style={{ fontSize: '2.2rem', display: 'block', marginBottom: 10 }}
            />
            Commission trend chart — coming soon
          </div>
        </motion.div>
      )}
    </div>
  );
}
