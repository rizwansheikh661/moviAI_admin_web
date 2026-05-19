'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';

type Driver = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: number;
  rides: number;
  status: 'Online' | 'Offline' | 'On trip' | 'Suspended';
  joined: string;
};

const DRIVERS: Driver[] = [
  { id: 'D-001', name: 'Tom Bennett', phone: '+44 7700 900111', vehicle: 'Toyota Prius', plate: 'AB12 CDE', rating: 4.9, rides: 1820, status: 'Online', joined: '2025-08-10' },
  { id: 'D-002', name: 'Anita Patel', phone: '+44 7700 900222', vehicle: 'Hyundai Ioniq', plate: 'XY34 ZAB', rating: 4.8, rides: 1542, status: 'On trip', joined: '2025-09-02' },
  { id: 'D-003', name: 'Rahul Sharma', phone: '+44 7700 900333', vehicle: 'Tesla Model 3', plate: 'EV99 LMN', rating: 4.7, rides: 980, status: 'Offline', joined: '2025-10-14' },
  { id: 'D-004', name: 'Sofia Rossi', phone: '+44 7700 900444', vehicle: 'Skoda Octavia', plate: 'CD55 EFG', rating: 4.9, rides: 2180, status: 'Online', joined: '2025-06-18' },
  { id: 'D-005', name: 'Marcus Lee', phone: '+44 7700 900555', vehicle: 'Kia Niro', plate: 'KN21 HIJ', rating: 4.6, rides: 612, status: 'Offline', joined: '2026-01-12' },
  { id: 'D-006', name: 'Elena Garcia', phone: '+44 7700 900666', vehicle: 'Nissan Leaf', plate: 'EV11 OPQ', rating: 4.8, rides: 1340, status: 'On trip', joined: '2025-11-30' },
  { id: 'D-007', name: 'David Kim', phone: '+44 7700 900777', vehicle: 'Toyota Camry', plate: 'TM88 RST', rating: 4.5, rides: 410, status: 'Suspended', joined: '2026-02-05' },
  { id: 'D-008', name: 'Priya Kaur', phone: '+44 7700 900888', vehicle: 'Honda Civic', plate: 'HC44 UVW', rating: 4.9, rides: 1750, status: 'Online', joined: '2025-07-22' },
  { id: 'D-009', name: 'James Wright', phone: '+44 7700 900999', vehicle: 'BMW i3', plate: 'BM33 XYZ', rating: 4.7, rides: 880, status: 'Offline', joined: '2025-12-10' },
  { id: 'D-010', name: 'Olivia Brown', phone: '+44 7700 901000', vehicle: 'Mercedes E-Class', plate: 'MZ22 ABC', rating: 5.0, rides: 2410, status: 'Online', joined: '2025-04-08' },
  { id: 'D-011', name: 'Ben Carter', phone: '+44 7700 901111', vehicle: 'Audi A4', plate: 'AU77 DEF', rating: 4.6, rides: 720, status: 'Online', joined: '2025-12-28' },
  { id: 'D-012', name: 'Mia Wilson', phone: '+44 7700 901222', vehicle: 'Volkswagen ID.3', plate: 'VW55 GHI', rating: 4.8, rides: 1190, status: 'Offline', joined: '2025-09-15' },
];

const tone = (s: Driver['status']) =>
  s === 'Online' ? 'success' : s === 'On trip' ? 'info' : s === 'Suspended' ? 'danger' : 'neutral';

export default function DriversPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | Driver['status']>('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return DRIVERS.filter((d) => {
      if (status !== 'all' && d.status !== status) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.plate.toLowerCase().includes(q) ||
        d.vehicle.toLowerCase().includes(q)
      );
    });
  }, [query, status]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader
        title="Drivers"
        subtitle={`${filtered.length} drivers · ${DRIVERS.filter((d) => d.status === 'Online').length} online now`}
        actions={
          <button className="btn btn-primary btn-sm">
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
              placeholder="Search name, phone, plate, vehicle…"
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
            <option value="Online">Online</option>
            <option value="On trip">On trip</option>
            <option value="Offline">Offline</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Plate</th>
                <th className="text-end">Rating</th>
                <th className="text-end">Rides</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>{d.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--brand-text-muted)' }}>{d.id}</div>
                  </td>
                  <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>{d.phone}</td>
                  <td>{d.vehicle}</td>
                  <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>{d.plate}</td>
                  <td className="text-end">
                    <span style={{ color: '#f59e0b' }}>★</span> {d.rating}
                  </td>
                  <td className="text-end">{d.rides}</td>
                  <td>
                    <StatusBadge tone={tone(d.status)}>{d.status}</StatusBadge>
                  </td>
                  <td style={{ color: 'var(--brand-text-muted)' }}>{d.joined}</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-1">
                      <button className="btn-icon" title="View">
                        <i className="bi bi-eye" />
                      </button>
                      <button className="btn-icon" title="Message">
                        <i className="bi bi-chat-dots" />
                      </button>
                      <button className="btn-icon" title="More">
                        <i className="bi bi-three-dots" />
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
