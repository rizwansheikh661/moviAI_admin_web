'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import { MOCK_RIDES, RideStatus, VehicleClass } from '@/lib/mock';

const tone = (s: RideStatus) => {
  if (s === 'COMPLETED') return 'success';
  if (s === 'IN_PROGRESS' || s === 'DRIVER_ASSIGNED') return 'info';
  if (s === 'REQUESTED') return 'warning';
  return 'danger';
};

const STATUS_OPTIONS: RideStatus[] = [
  'REQUESTED',
  'DRIVER_ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED_BY_RIDER',
  'CANCELLED_BY_DRIVER',
];

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export default function RidesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | RideStatus>('all');
  const [rideClass, setRideClass] = useState<'all' | VehicleClass>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_RIDES.filter((r) => {
      if (status !== 'all' && r.status !== status) return false;
      if (rideClass !== 'all' && r.rideClass !== rideClass) return false;
      const d = r.createdAt.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (!q) return true;
      return (
        r.publicId.toLowerCase().includes(q) ||
        r.riderName.toLowerCase().includes(q) ||
        r.driverName.toLowerCase().includes(q) ||
        r.pickupAddress.toLowerCase().includes(q) ||
        r.dropoffAddress.toLowerCase().includes(q)
      );
    });
  }, [query, status, rideClass, from, to]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader
        title="Rides"
        subtitle={`${filtered.length} rides`}
        actions={
          <button className="btn btn-outline-secondary btn-sm">
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
              placeholder="Search ride, rider, driver, address…"
              className="form-control form-control-sm"
              style={{ paddingLeft: 34 }}
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as typeof status);
              setPage(1);
            }}
            className="form-select form-select-sm"
            style={{ width: 180 }}
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ').toLowerCase()}
              </option>
            ))}
          </select>
          <select
            value={rideClass}
            onChange={(e) => {
              setRideClass(e.target.value as typeof rideClass);
              setPage(1);
            }}
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
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="form-control form-control-sm"
            style={{ width: 150 }}
          />
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="form-control form-control-sm"
            style={{ width: 150 }}
          />
        </div>

        <div className="table-responsive">
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
              {paged.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
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
                  <td>{r.driverName}</td>
                  <td style={{ fontSize: '0.82rem' }}>
                    <span>{truncate(r.pickupAddress, 24)}</span>
                    <i className="bi bi-arrow-right mx-1" style={{ color: 'var(--brand-text-muted)' }} />
                    <span>{truncate(r.dropoffAddress, 24)}</span>
                  </td>
                  <td>
                    <StatusBadge tone={tone(r.status)}>
                      {r.status.replace(/_/g, ' ').toLowerCase()}
                    </StatusBadge>
                  </td>
                  <td className="text-end" style={{ fontWeight: 600 }}>
                    €{r.totalFare}
                  </td>
                  <td style={{ color: 'var(--brand-text-muted)' }}>{r.createdAt.slice(0, 16).replace('T', ' ')}</td>
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
