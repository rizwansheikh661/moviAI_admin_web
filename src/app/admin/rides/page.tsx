'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import { ridesApi } from '@/lib/api/resources';
import type { RideStatus, VehicleClass } from '@/lib/api/types';

const tone = (s: RideStatus | string) => {
  const v = String(s).toLowerCase();
  if (v === 'completed') return 'success';
  if (v === 'in_progress' || v === 'driver_assigned' || v === 'driver_arrived') return 'info';
  if (v === 'requested') return 'warning';
  return 'danger';
};

const STATUS_OPTIONS = [
  'requested',
  'driver_assigned',
  'driver_arrived',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
];

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export default function RidesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | string>('all');
  const [rideClass, setRideClass] = useState<'all' | VehicleClass>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const offset = (page - 1) * pageSize;
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['admin', 'rides', { query, status, rideClass, from, to, pageSize, offset }],
    queryFn: () =>
      ridesApi.list({
        q: query || undefined,
        status: status === 'all' ? undefined : status,
        rideClass: rideClass === 'all' ? undefined : rideClass,
        from: from || undefined,
        to: to || undefined,
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
        title="Rides"
        subtitle={isLoading ? 'Loading…' : `${total} rides`}
        actions={
          <button className="btn btn-outline-secondary btn-sm" disabled>
            <i className="bi bi-file-earmark-arrow-down me-1" /> Export
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
          <div className="position-relative" style={{ flex: '1 1 220px', maxWidth: 280 }}>
            <i
              className="bi bi-search position-absolute"
              style={{ top: '50%', left: 12, transform: 'translateY(-50%)', color: 'var(--brand-text-muted)', fontSize: '0.85rem' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search ride, rider, driver, address…"
              className="form-control form-control-sm"
              style={{ paddingLeft: 34 }}
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="form-select form-select-sm"
            style={{ width: 180 }}
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select
            value={rideClass}
            onChange={(e) => { setRideClass(e.target.value as typeof rideClass); setPage(1); }}
            className="form-select form-select-sm"
            style={{ width: 140 }}
          >
            <option value="all">All classes</option>
            <option value="taxi">Taxi</option>
            <option value="premium">Premium</option>
            <option value="xl">XL</option>
          </select>
          <input
            type="date"
            value={from}
            onChange={(e) => { setFrom(e.target.value); setPage(1); }}
            className="form-control form-control-sm"
            style={{ width: 150 }}
          />
          <input
            type="date"
            value={to}
            onChange={(e) => { setTo(e.target.value); setPage(1); }}
            className="form-control form-control-sm"
            style={{ width: 150 }}
          />
        </div>

        {isError && (
          <div className="alert alert-danger" role="alert" style={{ fontSize: '0.85rem' }}>
            We couldn't load rides. {(error as Error)?.message}
          </div>
        )}

        <div className="table-responsive" style={{ opacity: isFetching ? 0.65 : 1, transition: 'opacity 0.2s' }}>
          <table className="table table-sm table-hover align-middle">
            <thead>
              <tr>
                <th>Ride</th>
                <th>Rider</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Status</th>
                <th className="text-end">Fare</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center text-muted py-4">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted py-4">No rides match these filters</td></tr>
              ) : (
                rows.map((r, i) => (
                  <motion.tr
                    key={r.publicId}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.25 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <Link
                        href={`/admin/rides/${r.publicId}`}
                        style={{ textDecoration: 'none', color: 'var(--brand-secondary)', fontWeight: 600 }}
                      >
                        {r.publicId}
                      </Link>
                    </td>
                    <td>{r.riderName}</td>
                    <td>{r.driverName ?? '—'}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <span>{truncate(r.pickupAddress, 24)}</span>
                      <i className="bi bi-arrow-right mx-1" style={{ color: 'var(--brand-text-muted)' }} />
                      <span>{truncate(r.dropoffAddress, 24)}</span>
                    </td>
                    <td>
                      <StatusBadge tone={tone(r.status)}>
                        {String(r.status).replace(/_/g, ' ').toLowerCase()}
                      </StatusBadge>
                    </td>
                    <td className="text-end" style={{ fontWeight: 600 }}>€{r.totalFare}</td>
                    <td style={{ color: 'var(--brand-text-muted)' }}>{r.createdAt?.slice(0, 16).replace('T', ' ')}</td>
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
