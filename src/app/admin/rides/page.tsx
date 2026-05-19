'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';

type Ride = {
  id: string;
  rider: string;
  driver: string;
  pickup: string;
  drop: string;
  fare: string;
  distance: string;
  status: 'Completed' | 'In progress' | 'Cancelled' | 'Scheduled';
  startedAt: string;
};

const RIDES: Ride[] = [
  { id: 'R-10487', rider: 'Sarah J.', driver: 'Tom B.', pickup: 'Camden', drop: 'Soho', fare: '£14.20', distance: '4.2 km', status: 'Completed', startedAt: '10:42' },
  { id: 'R-10486', rider: 'James K.', driver: 'Anita P.', pickup: 'King\'s Cross', drop: 'Holborn', fare: '£8.50', distance: '2.1 km', status: 'In progress', startedAt: '11:08' },
  { id: 'R-10485', rider: 'Olivia M.', driver: 'Tom B.', pickup: 'Westminster', drop: 'Shoreditch', fare: '£21.00', distance: '6.8 km', status: 'Completed', startedAt: '10:14' },
  { id: 'R-10484', rider: 'Ben C.', driver: 'Rahul S.', pickup: 'Notting Hill', drop: 'Paddington', fare: '£11.75', distance: '3.4 km', status: 'Cancelled', startedAt: '09:58' },
  { id: 'R-10483', rider: 'Mia W.', driver: 'Anita P.', pickup: 'Brixton', drop: 'Clapham', fare: '£17.30', distance: '5.1 km', status: 'Completed', startedAt: '09:42' },
  { id: 'R-10482', rider: 'Liam B.', driver: 'Sofia R.', pickup: 'Greenwich', drop: 'Canary Wharf', fare: '£9.80', distance: '2.8 km', status: 'Completed', startedAt: '09:30' },
  { id: 'R-10481', rider: 'Ava T.', driver: 'Marcus L.', pickup: 'Hampstead', drop: 'Camden', fare: '£12.40', distance: '3.6 km', status: 'Completed', startedAt: '09:18' },
  { id: 'R-10480', rider: 'Noah P.', driver: 'Elena G.', pickup: 'Stratford', drop: 'Bethnal Green', fare: '£10.20', distance: '3.0 km', status: 'Completed', startedAt: '09:05' },
  { id: 'R-10479', rider: 'Isla R.', driver: 'Priya K.', pickup: 'Wimbledon', drop: 'Putney', fare: '£8.90', distance: '2.5 km', status: 'In progress', startedAt: '11:12' },
  { id: 'R-10478', rider: 'Ethan H.', driver: 'James W.', pickup: 'Chelsea', drop: 'Kensington', fare: '£7.50', distance: '1.9 km', status: 'Completed', startedAt: '08:42' },
  { id: 'R-10477', rider: 'Lily F.', driver: 'Olivia B.', pickup: 'Islington', drop: 'Angel', fare: '£6.20', distance: '1.5 km', status: 'Cancelled', startedAt: '08:30' },
  { id: 'R-10476', rider: 'Henry D.', driver: 'Ben C.', pickup: 'Bermondsey', drop: 'London Bridge', fare: '£9.10', distance: '2.6 km', status: 'Completed', startedAt: '08:15' },
  { id: 'R-10475', rider: 'Grace N.', driver: 'Mia W.', pickup: 'Vauxhall', drop: 'Pimlico', fare: '£11.30', distance: '3.2 km', status: 'Scheduled', startedAt: '15:00' },
];

const tone = (s: Ride['status']) =>
  s === 'Completed' ? 'success' : s === 'In progress' ? 'info' : s === 'Cancelled' ? 'danger' : 'warning';

export default function RidesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | Ride['status']>('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return RIDES.filter((r) => {
      if (status !== 'all' && r.status !== status) return false;
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.rider.toLowerCase().includes(q) ||
        r.driver.toLowerCase().includes(q) ||
        r.pickup.toLowerCase().includes(q) ||
        r.drop.toLowerCase().includes(q)
      );
    });
  }, [query, status]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader
        title="Rides"
        subtitle={`${filtered.length} rides · today`}
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
          <div className="position-relative" style={{ flex: '1 1 240px', maxWidth: 320 }}>
            <i
              className="bi bi-search position-absolute"
              style={{ top: '50%', left: 12, transform: 'translateY(-50%)', color: 'var(--brand-text-muted)', fontSize: '0.85rem' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search ride, rider, driver, location…"
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
            style={{ width: 160 }}
          >
            <option value="all">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="In progress">In progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Ride</th>
                <th>Rider</th>
                <th>Driver</th>
                <th>Pickup → Drop</th>
                <th className="text-end">Distance</th>
                <th className="text-end">Fare</th>
                <th>Status</th>
                <th>Started</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <td style={{ fontWeight: 600, color: 'var(--brand-secondary)', fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>
                    {r.id}
                  </td>
                  <td>{r.rider}</td>
                  <td>{r.driver}</td>
                  <td style={{ fontSize: '0.78rem' }}>
                    <span>{r.pickup}</span>
                    <i className="bi bi-arrow-right mx-1" style={{ color: 'var(--brand-text-muted)' }} />
                    <span>{r.drop}</span>
                  </td>
                  <td className="text-end">{r.distance}</td>
                  <td className="text-end" style={{ fontWeight: 600 }}>
                    {r.fare}
                  </td>
                  <td>
                    <StatusBadge tone={tone(r.status)}>{r.status}</StatusBadge>
                  </td>
                  <td style={{ color: 'var(--brand-text-muted)' }}>{r.startedAt}</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-1">
                      <button className="btn-icon" title="View">
                        <i className="bi bi-eye" />
                      </button>
                      <button className="btn-icon" title="Map">
                        <i className="bi bi-geo-alt" />
                      </button>
                    </div>
                  </td>
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
