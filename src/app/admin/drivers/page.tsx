'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import { driversApi } from '@/lib/api/resources';
import type { DriverStatus } from '@/lib/api/types';

const tone = (s: DriverStatus | string) =>
  s === 'active' ? 'success' : s === 'pending_kyc' ? 'warning' : 'danger';

type FilterKey = 'all' | DriverStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending_kyc', label: 'Pending KYC' },
  { key: 'active', label: 'Active' },
  { key: 'suspended', label: 'Suspended' },
];

export default function DriversPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const offset = (page - 1) * pageSize;
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['admin', 'drivers', { query, filter, pageSize, offset }],
    queryFn: () =>
      driversApi.list({
        q: query || undefined,
        status: filter === 'all' ? undefined : filter,
        limit: pageSize,
        offset,
      }),
    placeholderData: keepPreviousData,
  });

  const rows = data?.items ?? [];
  const total = data?.total ?? rows.length;

  return (
    <div>
      <PageHeader
        title="Drivers"
        subtitle={isLoading ? 'Loading…' : `${total} drivers`}
        actions={
          <button className="btn btn-primary btn-sm" disabled>
            <i className="bi bi-person-plus me-1" /> Add Driver
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
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => { setFilter(f.key); setPage(1); }}
                style={{
                  border: '1px solid var(--brand-border)',
                  borderRadius: 999,
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.78rem',
                  fontWeight: active ? 700 : 500,
                  background: active ? 'var(--brand-primary)' : '#fff',
                  color: active ? '#0a1633' : 'var(--brand-text)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {f.label}
              </button>
            );
          })}
          <div className="position-relative ms-auto" style={{ flex: '1 1 220px', maxWidth: 280 }}>
            <i
              className="bi bi-search position-absolute"
              style={{ top: '50%', left: 12, transform: 'translateY(-50%)', color: 'var(--brand-text-muted)', fontSize: '0.85rem' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search name, phone, email…"
              className="form-control form-control-sm"
              style={{ paddingLeft: 34 }}
            />
          </div>
        </div>

        {isError && (
          <div className="alert alert-danger" role="alert" style={{ fontSize: '0.85rem' }}>
            We couldn't load drivers. {(error as Error)?.message}
          </div>
        )}

        <div className="table-responsive" style={{ opacity: isFetching ? 0.65 : 1, transition: 'opacity 0.2s' }}>
          <table className="table table-sm table-hover align-middle">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th className="text-end">Total rides</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">No drivers found</td></tr>
              ) : (
                rows.map((d, i) => (
                  <motion.tr
                    key={d.publicId}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.25 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <Link href={`/admin/drivers/${d.publicId}`} style={{ textDecoration: 'none', color: 'var(--brand-secondary)' }}>
                        <div style={{ fontWeight: 600 }}>{d.fullName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--brand-text-muted)' }}>{d.publicId}</div>
                      </Link>
                    </td>
                    <td>{d.phone}</td>
                    <td style={{ textTransform: 'capitalize' }}>{d.vehicleClass ?? '—'}</td>
                    <td>
                      <StatusBadge tone={tone(d.status)}>{d.status.replace(/_/g, ' ')}</StatusBadge>
                    </td>
                    <td className="text-end">{d.totalRides}</td>
                    <td style={{ color: 'var(--brand-text-muted)' }}>{d.joinedAt?.slice(0, 10)}</td>
                  </motion.tr>
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
    </div>
  );
}
