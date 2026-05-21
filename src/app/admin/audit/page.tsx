'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import { auditApi } from '@/lib/api/resources';
import type { AuditEntry } from '@/lib/api/types';

const ENTITIES = ['all', 'ride', 'user', 'driver', 'payment', 'coupon', 'platform_config'];

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actor, setActor] = useState('');
  const [action, setAction] = useState('');
  const [entity, setEntity] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [diffRow, setDiffRow] = useState<AuditEntry | null>(null);

  const offset = (page - 1) * pageSize;
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['admin', 'audit', { actor, action, entity, from, to, pageSize, offset }],
    queryFn: () =>
      auditApi.list({
        actorEmail: actor || undefined,
        action: action || undefined,
        entity: entity === 'all' ? undefined : entity,
        from: from || undefined,
        to: to || undefined,
        limit: pageSize,
        offset,
      }),
    placeholderData: keepPreviousData,
  });

  const rows = data?.items ?? [];
  const total = data?.total ?? rows.length;

  const resetPage = () => setPage(1);

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
            onChange={(e) => { setActor(e.target.value); resetPage(); }}
            style={{ width: 200 }}
          />
          <input
            className="form-control form-control-sm"
            placeholder="Action"
            value={action}
            onChange={(e) => { setAction(e.target.value); resetPage(); }}
            style={{ width: 200 }}
          />
          <select
            className="form-select form-select-sm"
            value={entity}
            onChange={(e) => { setEntity(e.target.value); resetPage(); }}
            style={{ width: 180 }}
          >
            {ENTITIES.map((e) => (
              <option key={e} value={e}>{e === 'all' ? 'All entities' : e}</option>
            ))}
          </select>
          <input
            type="date"
            className="form-control form-control-sm"
            value={from}
            onChange={(e) => { setFrom(e.target.value); resetPage(); }}
            style={{ width: 150 }}
          />
          <input
            type="date"
            className="form-control form-control-sm"
            value={to}
            onChange={(e) => { setTo(e.target.value); resetPage(); }}
            style={{ width: 150 }}
          />
        </div>

        {isError && (
          <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
            Failed to load audit log: {(error as Error)?.message}
          </div>
        )}

        <div className="table-responsive" style={{ opacity: isFetching ? 0.65 : 1, transition: 'opacity 0.2s' }}>
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
              {isLoading ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">No entries match these filters</td></tr>
              ) : (
                rows.map((a, i) => (
                  <tr key={a.id ?? i}>
                    <td style={{ color: 'var(--brand-text-muted)', fontSize: '0.82rem' }}>
                      {a.ts?.replace('T', ' ').slice(0, 16)}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{a.actorEmail ?? '—'}</td>
                    <td>
                      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>
                        {a.action}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{a.entity}</td>
                    <td>
                      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>
                        {a.entityId ?? '—'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => setDiffRow(a)}>
                        View diff
                      </button>
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
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </motion.div>

      <Modal
        show={!!diffRow}
        onHide={() => setDiffRow(null)}
        title={diffRow ? `${diffRow.action} — ${diffRow.entityId ?? ''}` : ''}
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
                {JSON.stringify(diffRow.before ?? {}, null, 2)}
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
                {JSON.stringify(diffRow.after ?? {}, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
