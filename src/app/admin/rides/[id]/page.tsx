'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { ridesApi } from '@/lib/api/resources';
import type { RideStatus } from '@/lib/api/types';
import { ApiError } from '@/lib/api/client';

const tone = (s: RideStatus | string) => {
  const v = String(s).toLowerCase();
  if (v === 'completed') return 'success';
  if (v === 'in_progress' || v === 'driver_assigned' || v === 'driver_arrived') return 'info';
  if (v === 'requested') return 'warning';
  return 'danger';
};

const TERMINAL: ReadonlyArray<string> = ['completed', 'cancelled', 'no_show'];

export default function RideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? '');
  const qc = useQueryClient();

  const { data: ride, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'ride', id],
    queryFn: () => ridesApi.get(id).then((r) => r.data),
    enabled: Boolean(id),
  });

  const [refundOpen, setRefundOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const cancelMutation = useMutation({
    mutationFn: () => ridesApi.cancel(id, cancelReason || undefined),
    onSuccess: () => {
      toast.success('Ride cancelled');
      setCancelOpen(false);
      setCancelReason('');
      qc.invalidateQueries({ queryKey: ['admin', 'ride', id] });
      qc.invalidateQueries({ queryKey: ['admin', 'rides'] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Cancel failed'),
  });

  const refundMutation = useMutation({
    mutationFn: () => ridesApi.refund(id, refundAmount || undefined, refundReason || undefined),
    onSuccess: () => {
      toast.success(`Refund issued${refundAmount ? ` (€${refundAmount})` : ''}`);
      setRefundOpen(false);
      setRefundAmount('');
      setRefundReason('');
      qc.invalidateQueries({ queryKey: ['admin', 'ride', id] });
      qc.invalidateQueries({ queryKey: ['admin', 'rides'] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Refund failed'),
  });

  if (isLoading) {
    return <div className="text-center text-muted py-5">Loading ride…</div>;
  }

  if (isError || !ride) {
    return (
      <div className="alert alert-danger" role="alert">
        Failed to load ride: {(error as Error)?.message ?? 'Not found'}
        <button className="btn btn-sm btn-link" onClick={() => router.push('/admin/rides')}>
          Back to rides
        </button>
      </div>
    );
  }

  const status = String(ride.status).toLowerCase();
  const cancelDisabled = TERMINAL.includes(status);
  const refundDisabled = status !== 'completed';

  return (
    <div>
      <PageHeader
        title={ride.publicId}
        subtitle={
          <span className="d-inline-flex align-items-center gap-2">
            <StatusBadge tone={tone(ride.status)}>
              {String(ride.status).replace(/_/g, ' ').toLowerCase()}
            </StatusBadge>
            <span style={{ color: 'var(--brand-text-muted)' }}>
              {ride.createdAt?.replace('T', ' ').slice(0, 16)}
            </span>
          </span>
        }
        actions={
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-danger btn-sm"
              disabled={cancelDisabled}
              onClick={() => setCancelOpen(true)}
            >
              Cancel ride
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={refundDisabled}
              onClick={() => {
                setRefundAmount(ride.totalFare ?? '');
                setRefundOpen(true);
              }}
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
              {(ride.events ?? []).length === 0 ? (
                <li style={{ color: 'var(--brand-text-muted)', fontSize: '0.85rem' }}>No events recorded</li>
              ) : (
                ride.events.map((t, i) => (
                  <li
                    key={`${t.type}-${i}`}
                    className="d-flex align-items-start gap-3"
                    style={{ position: 'relative', paddingBottom: i === ride.events.length - 1 ? 0 : 16 }}
                  >
                    <div
                      style={{
                        width: 12, height: 12, borderRadius: '50%',
                        background: 'var(--brand-primary)', marginTop: 4, flexShrink: 0,
                      }}
                    />
                    <div className="flex-grow-1">
                      <div style={{ fontWeight: 600, color: 'var(--brand-secondary)', fontSize: '0.85rem' }}>
                        {t.type.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--brand-text-muted)' }}>
                        {t.at?.replace('T', ' ').slice(0, 16)}
                      </div>
                    </div>
                  </li>
                ))
              )}
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
            <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 12 }}>Route</h6>
            <div
              style={{
                borderRadius: 12, minHeight: 200,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(168, 215, 41, 0.16) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--brand-secondary)', fontWeight: 600,
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
              <div className="mt-2">
                <strong style={{ color: 'var(--brand-secondary)' }}>Rider:</strong>{' '}
                <span style={{ color: 'var(--brand-text-muted)' }}>{ride.riderName}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--brand-secondary)' }}>Driver:</strong>{' '}
                <span style={{ color: 'var(--brand-text-muted)' }}>{ride.driverName ?? '—'}</span>
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
        <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 12 }}>Fare breakdown</h6>
        <div className="row g-2">
          <BreakdownRow label="Base" value={ride.fareBreakdown?.baseFare ?? '0.00'} />
          <BreakdownRow label="Distance" value={ride.fareBreakdown?.distance ?? '0.00'} />
          <BreakdownRow label="Time" value={ride.fareBreakdown?.duration ?? '0.00'} />
          <BreakdownRow label="Surge" value={ride.fareBreakdown?.surge ?? '0.00'} />
          <BreakdownRow label="Tip" value={ride.fareBreakdown?.tip ?? '0.00'} />
          <BreakdownRow label="Discount" value={ride.fareBreakdown?.discount ?? '0.00'} />
          <BreakdownRow label="Total" value={ride.fareBreakdown?.total ?? ride.totalFare} bold />
          <BreakdownRow label="Driver payout" value={ride.driverPayout} />
          <BreakdownRow label="Commission" value={ride.commissionAmount} />
        </div>
      </motion.div>

      <Modal
        show={cancelOpen}
        onHide={() => setCancelOpen(false)}
        title="Cancel ride"
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setCancelOpen(false)}>
              Keep ride
            </button>
            <button
              className="btn btn-danger btn-sm"
              disabled={cancelMutation.isPending}
              onClick={() => cancelMutation.mutate()}
            >
              {cancelMutation.isPending ? 'Cancelling…' : 'Confirm cancel'}
            </button>
          </>
        }
      >
        <div>
          <label className="form-label">Reason (optional)</label>
          <textarea
            className="form-control"
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Why are you cancelling this ride?"
          />
        </div>
      </Modal>

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
              disabled={refundMutation.isPending}
              onClick={() => refundMutation.mutate()}
            >
              {refundMutation.isPending ? 'Refunding…' : 'Confirm refund'}
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label">Amount (EUR — leave empty for full)</label>
          <input
            type="number"
            step="0.01"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            className="form-control"
            placeholder={ride.totalFare}
          />
        </div>
        <div>
          <label className="form-label">Reason</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Note for ledger…"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />
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
