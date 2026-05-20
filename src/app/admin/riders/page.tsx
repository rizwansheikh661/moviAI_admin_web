'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import { MOCK_RIDERS, RiderStatus } from '@/lib/mock';

const tone = (s: RiderStatus) => (s === 'active' ? 'success' : 'danger');

type FilterKey = 'all' | RiderStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'suspended', label: 'Suspended' },
];

export default function RidersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_RIDERS.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.fullName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.publicId.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader title="Riders" subtitle={`${filtered.length} riders`} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ padding: '1rem 1.25rem' }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          {FILTERS.map((f) => {
            const active = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setFilter(f.key);
                  setPage(1);
                }}
                style={{
                  border: '1px solid var(--brand-border)',
                  borderRadius: 999,
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.78rem',
                  fontWeight: active ? 700 : 500,
                  background: active ? 'var(--brand-primary)' : '#fff',
                  color: active ? '#0a1633' : 'var(--brand-text)',
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            );
          })}
          <div className="position-relative ms-auto" style={{ flex: '1 1 220px', maxWidth: 280 }}>
            <i
              className="bi bi-search position-absolute"
              style={{
                top: '50%',
                left: 12,
                transform: 'translateY(-50%)',
                color: 'var(--brand-text-muted)',
                fontSize: '0.85rem',
              }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search rider…"
              className="form-control form-control-sm"
              style={{ paddingLeft: 34 }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle">
            <thead>
              <tr>
                <th>Rider</th>
                <th>Phone</th>
                <th>Email</th>
                <th className="text-end">Total rides</th>
                <th className="text-end">Total spent</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr key={r.id} style={{ cursor: 'pointer' }}>
                  <td>
                    <Link
                      href={`/admin/riders/${r.publicId}`}
                      style={{ textDecoration: 'none', color: 'var(--brand-secondary)' }}
                    >
                      <div style={{ fontWeight: 600 }}>{r.fullName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--brand-text-muted)' }}>
                        {r.publicId}
                      </div>
                    </Link>
                  </td>
                  <td>{r.phone}</td>
                  <td style={{ fontSize: '0.85rem' }}>{r.email}</td>
                  <td className="text-end">{r.totalRides}</td>
                  <td className="text-end" style={{ fontWeight: 600 }}>
                    €{r.totalSpent}
                  </td>
                  <td>
                    <StatusBadge tone={tone(r.status)}>{r.status}</StatusBadge>
                  </td>
                  <td style={{ color: 'var(--brand-text-muted)' }}>{r.joinedAt}</td>
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
    </div>
  );
}
