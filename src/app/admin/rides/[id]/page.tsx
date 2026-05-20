'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { MOCK_RIDES, RideStatus } from '@/lib/mock';

const tone = (s: RideStatus) => {
  if (s === 'COMPLETED') return 'success';
  if (s === 'IN_PROGRESS' || s === 'DRIVER_ASSIGNED') return 'info';
  if (s === 'REQUESTED') return 'warning';
  return 'danger';
};

const TIMELINE = [
  { label: 'REQUESTED', time: '10:00' },
  { label: 'DRIVER_ASSIGNED', time: '10:01' },
  { label: 'DRIVER_AT_PICKUP', time: '10:05' },
  { label: 'IN_PROGRESS', time: '10:07' },
  { label: 'COMPLETED', time: '10:32' },
];

export default function RideDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const ride = MOCK_RIDES.find((r) => r.publicId === id) ?? MOCK_RIDES[0];
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(ride.totalFare);

  const cancelDisabled =
    ride.status === 'IN_PROGRESS' ||
    ride.status === 'COMPLETED' ||
    ride.status === 'CANCELLED_BY_RIDER' ||
    ride.status === 'CANCELLED_BY_DRIVER';

  return (
    <div>
      <PageHeader
        title={ride.publicId}
        subtitle={
          <span className="d-inline-flex align-items-center gap-2">
            <StatusBadge tone={tone(ride.status)}>
              {ride.status.replace(/_/g, ' ').toLowerCase()}
            </StatusBadge>
            <span style={{ color: 'var(--brand-text-muted)' }}>
              {ride.createdAt.replace('T', ' ').slice(0, 16)}
            </span>
          </span>
        }
        actions={
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-danger btn-sm"
              disabled={cancelDisabled}
              onClick={() => alert('Ride cancelled. (mock)')}
            >
              Cancel ride
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setRefundOpen(true)}
            >
              Refund
            </button>
          </div>
        }
      />

      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="card h-100"
            style={{ padding: '1.25rem 1.5rem' }}
          >
            <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700 }}>Timeline</h6>
            <ol className="list-unstyled mt-2 mb-0">
              {TIMELINE.map((t, i) => (
                <li
                  key={t.label}
                  className="d-flex align-items-start gap-3"
                  style={{ position: 'relative', paddingBottom: i === TIMELINE.length - 1 ? 0 : 16 }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: 'var(--brand-primary)',
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  />
                  <div className="flex-grow-1">
                    <div style={{ fontWeight: 600, color: 'var(--brand-secondary)', fontSize: '0.85rem' }}>
                      {t.label.replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--brand-text-muted)' }}>
                      {t.time}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>

        <div className="col-12 col-xl-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="card h-100"
            style={{ padding: '1.25rem 1.5rem', minHeight: 320 }}
          >
            <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 12 }}>
              Route map
            </h6>
            <div
              style={{
                flex: 1,
                borderRadius: 12,
                minHeight: 240,
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(168, 215, 41, 0.16) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-secondary)',
                fontWeight: 600,
              }}
            >
              <div className="text-center">
                <i className="bi bi-map" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }} />
                Route map — coming soon
              </div>
            </div>
            <div className="mt-3" style={{ fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: 'var(--brand-secondary)' }}>Pickup:</strong>{' '}
                <span style={{ color: 'var(--brand-text-muted)' }}>{ride.pickupAddress}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--brand-secondary)' }}>Dropoff:</strong>{' '}
                <span style={{ color: 'var(--brand-text-muted)' }}>{ride.dropoffAddress}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="card"
        style={{ padding: '1.25rem 1.5rem' }}
      >
        <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 12 }}>
          Fare breakdown
        </h6>
        <div className="row g-2">
          <BreakdownRow label="Base" value="3.00" />
          <BreakdownRow label="Distance" value="7.40" />
          <BreakdownRow label="Time" value="2.20" />
          <BreakdownRow label="Tax" value="1.60" />
          <BreakdownRow label="Tip" value="0.00" />
          <BreakdownRow label="Coupon" value="0.00" />
          <BreakdownRow label="Total" value={ride.totalFare} bold />
          <BreakdownRow label="Driver payout" value={ride.driverPayout} />
          <BreakdownRow label="Commission" value={ride.commissionAmount} />
        </div>
      </motion.div>

      <Modal
        show={refundOpen}
        onHide={() => setRefundOpen(false)}
        title="Refund ride"
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setRefundOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                alert(`Refund of €${refundAmount} issued. (mock)`);
                setRefundOpen(false);
              }}
            >
              Confirm refund
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label">Amount (EUR)</label>
          <input
            type="number"
            step="0.01"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            className="form-control"
          />
        </div>
        <div>
          <label className="form-label">Reason</label>
          <textarea className="form-control" rows={3} placeholder="Note for ledger…" />
        </div>
      </Modal>
    </div>
  );
}

function BreakdownRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="col-12 col-md-6">
      <div
        className="d-flex justify-content-between align-items-center px-3 py-2"
        style={{
          background: bold ? 'var(--brand-bg-page)' : 'transparent',
          border: '1px solid var(--brand-border)',
          borderRadius: 8,
        }}
      >
        <span style={{ color: 'var(--brand-text-muted)', fontSize: '0.82rem' }}>{label}</span>
        <span
          style={{
            color: 'var(--brand-secondary)',
            fontWeight: bold ? 800 : 600,
            fontSize: bold ? '1rem' : '0.9rem',
          }}
        >
          €{value}
        </span>
      </div>
    </div>
  );
}
