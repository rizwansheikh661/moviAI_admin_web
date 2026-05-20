'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import { MOCK_AUDIT, MockAudit } from '@/lib/mock';

const ENTITIES = ['all', 'ride', 'user', 'driver', 'payment', 'coupon', 'platform_config'];

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actor, setActor] = useState('');
  const [action, setAction] = useState('');
  const [entity, setEntity] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [diffRow, setDiffRow] = useState<MockAudit | null>(null);

  const filtered = useMemo(() => {
    return MOCK_AUDIT.filter((a) => {
      if (actor && !a.actorEmail.toLowerCase().includes(actor.toLowerCase())) return false;
      if (action && !a.action.toLowerCase().includes(action.toLowerCase())) return false;
      if (entity !== 'all' && a.entity !== entity) return false;
      const d = a.ts.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [actor, action, entity, from, to]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Read-only platform event history" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ padding: '1rem 1.25rem' }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <input
            className="form-control form-control-sm"
            placeholder="Actor email"
            value={actor}
            onChange={(e) => {
              setActor(e.target.value);
              setPage(1);
            }}
            style={{ width: 200 }}
          />
          <input
            className="form-control form-control-sm"
            placeholder="Action"
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
            style={{ width: 200 }}
          />
          <select
            className="form-select form-select-sm"
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value);
              setPage(1);
            }}
            style={{ width: 180 }}
          >
            {ENTITIES.map((e) => (
              <option key={e} value={e}>
                {e === 'all' ? 'All entities' : e}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="form-control form-control-sm"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            style={{ width: 150 }}
          />
          <input
            type="date"
            className="form-control form-control-sm"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            style={{ width: 150 }}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th className="text-end">Diff</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--brand-text-muted)', fontSize: '0.82rem' }}>
                    {a.ts.replace('T', ' ').slice(0, 16)}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{a.actorEmail}</td>
                  <td>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>
                      {a.action}
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{a.entity}</td>
                  <td>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>
                      {a.entityId}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setDiffRow(a)}
                    >
                      View diff
                    </button>
                  </td>
                </tr>
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

      <Modal
        show={!!diffRow}
        onHide={() => setDiffRow(null)}
        title={diffRow ? `${diffRow.action} — ${diffRow.entityId}` : ''}
        size="lg"
      >
        {diffRow && (
          <div className="row g-3">
            <div className="col-md-6">
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-text-muted)', marginBottom: 4 }}>
                BEFORE
              </div>
              <pre
                style={{
                  background: 'var(--brand-bg-page)',
                  border: '1px solid var(--brand-border)',
                  borderRadius: 8,
                  padding: '0.75rem',
                  fontSize: '0.78rem',
                  margin: 0,
                  maxHeight: 320,
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(diffRow.before, null, 2)}
              </pre>
            </div>
            <div className="col-md-6">
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-text-muted)', marginBottom: 4 }}>
                AFTER
              </div>
              <pre
                style={{
                  background: 'var(--brand-bg-page)',
                  border: '1px solid var(--brand-border)',
                  borderRadius: 8,
                  padding: '0.75rem',
                  fontSize: '0.78rem',
                  margin: 0,
                  maxHeight: 320,
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(diffRow.after, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
