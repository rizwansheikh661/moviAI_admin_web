'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import Tabs from '@/components/Tabs';
import Modal from '@/components/Modal';
import { MOCK_RIDERS, MOCK_RIDES, RiderStatus } from '@/lib/mock';

const tone = (s: RiderStatus) => (s === 'active' ? 'success' : 'danger');

const TABS = [
  { key: 'overview', label: 'Overview', icon: 'grid' },
  { key: 'rides', label: 'Rides', icon: 'car-front' },
  { key: 'payments', label: 'Payments', icon: 'credit-card' },
];

const PAYMENTS = [
  { date: '2026-05-19', method: 'Visa •••• 4242', amount: '14.20', status: 'succeeded' },
  { date: '2026-05-15', method: 'Apple Pay', amount: '8.50', status: 'succeeded' },
  { date: '2026-05-12', method: 'Visa •••• 4242', amount: '21.00', status: 'refunded' },
  { date: '2026-05-08', method: 'Visa •••• 4242', amount: '11.75', status: 'succeeded' },
];

export default function RiderDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const rider = MOCK_RIDERS.find((r) => r.publicId === id) ?? MOCK_RIDERS[0];
  const [active, setActive] = useState('overview');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const initials = rider.fullName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');

  return (
    <div>
      <PageHeader title={rider.fullName} subtitle={rider.publicId} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card mb-3"
        style={{ padding: '1.25rem 1.5rem' }}
      >
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--brand-secondary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.3rem',
            }}
          >
            {initials}
          </div>
          <div className="flex-grow-1">
            <div style={{ fontWeight: 700, color: 'var(--brand-secondary)', fontSize: '1.05rem' }}>
              {rider.fullName}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--brand-text-muted)' }}>
              {rider.phone} · {rider.email}
            </div>
            <div className="mt-1">
              <StatusBadge tone={tone(rider.status)}>{rider.status}</StatusBadge>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => alert('Rider suspended. (mock)')}
            >
              Suspend
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setDeleteOpen(true)}>
              GDPR Delete
            </button>
          </div>
        </div>
      </motion.div>

      <Tabs tabs={TABS} activeKey={active} onChange={setActive} />

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {active === 'overview' && (
          <div className="row g-3">
            <div className="col-12 col-md-3">
              <StatCard
                label="Total rides"
                value={String(rider.totalRides)}
                accent="primary"
                icon={<i className="bi bi-car-front" />}
              />
            </div>
            <div className="col-12 col-md-3">
              <StatCard
                label="Total spent"
                value={`€${rider.totalSpent}`}
                accent="secondary"
                icon={<i className="bi bi-cash-coin" />}
              />
            </div>
            <div className="col-12 col-md-3">
              <StatCard
                label="Avg rating"
                value="4.8"
                accent="warning"
                icon={<i className="bi bi-star-fill" />}
              />
            </div>
            <div className="col-12 col-md-3">
              <StatCard
                label="Member since"
                value={rider.joinedAt}
                accent="info"
                icon={<i className="bi bi-calendar-check" />}
              />
            </div>
          </div>
        )}

        {active === 'rides' && (
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Ride</th>
                    <th>Driver</th>
                    <th>Fare</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RIDES.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                        {r.publicId}
                      </td>
                      <td>{r.driverName}</td>
                      <td>€{r.totalFare}</td>
                      <td>
                        <StatusBadge tone="info">
                          {r.status.replace(/_/g, ' ').toLowerCase()}
                        </StatusBadge>
                      </td>
                      <td style={{ color: 'var(--brand-text-muted)' }}>
                        {r.createdAt.slice(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {active === 'payments' && (
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Method</th>
                    <th className="text-end">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENTS.map((p, i) => (
                    <tr key={i}>
                      <td>{p.date}</td>
                      <td>{p.method}</td>
                      <td className="text-end" style={{ fontWeight: 600 }}>
                        €{p.amount}
                      </td>
                      <td>
                        <StatusBadge tone={p.status === 'succeeded' ? 'success' : 'warning'}>
                          {p.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      <Modal
        show={deleteOpen}
        onHide={() => setDeleteOpen(false)}
        title="GDPR delete rider"
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setDeleteOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-danger btn-sm"
              disabled={confirmText !== 'DELETE'}
              onClick={() => {
                alert('PII scrubbed. (mock)');
                setDeleteOpen(false);
              }}
            >
              Delete permanently
            </button>
          </>
        }
      >
        <p style={{ fontSize: '0.88rem' }}>
          This will scrub all PII. Type <strong>DELETE</strong> to confirm.
        </p>
        <input
          className="form-control"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
        />
      </Modal>
    </div>
  );
}
