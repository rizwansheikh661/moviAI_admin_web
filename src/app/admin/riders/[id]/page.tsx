'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import Tabs from '@/components/Tabs';
import Modal from '@/components/Modal';
import { ridersApi } from '@/lib/api/resources';
import { ApiError } from '@/lib/api/client';
import type { RiderStatus } from '@/lib/api/types';

const tone = (s: RiderStatus | string) => (s === 'active' ? 'success' : 'danger');

const TABS = [
  { key: 'overview', label: 'Overview', icon: 'grid' },
  { key: 'rides', label: 'Rides', icon: 'car-front' },
];

export default function RiderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? '');
  const qc = useQueryClient();

  const [active, setActive] = useState('overview');
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const { data: rider, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'rider', id],
    queryFn: () => ridersApi.get(id).then((r) => r.data),
    enabled: Boolean(id),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'rider', id] });
    qc.invalidateQueries({ queryKey: ['admin', 'riders'] });
  };

  const suspendMutation = useMutation({
    mutationFn: () => ridersApi.suspend(id, suspendReason || undefined),
    onSuccess: () => {
      toast.success('Rider suspended');
      setSuspendOpen(false);
      setSuspendReason('');
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Suspend failed'),
  });

  const unsuspendMutation = useMutation({
    mutationFn: () => ridersApi.unsuspend(id),
    onSuccess: () => { toast.success('Rider reactivated'); invalidate(); },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Unsuspend failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => ridersApi.remove(id),
    onSuccess: () => {
      toast.success('Rider data scrubbed');
      setDeleteOpen(false);
      qc.invalidateQueries({ queryKey: ['admin', 'riders'] });
      router.push('/admin/riders');
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Delete failed'),
  });

  if (isLoading) return <div className="text-center text-muted py-5">Loading rider…</div>;
  if (isError || !rider) {
    return (
      <div className="alert alert-danger" role="alert">
        Failed to load rider: {(error as Error)?.message ?? 'Not found'}
        <button className="btn btn-sm btn-link" onClick={() => router.push('/admin/riders')}>Back</button>
      </div>
    );
  }

  const initials = rider.fullName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const isSuspended = rider.status === 'suspended';
  const recentRides = rider.recentRides ?? [];

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
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--brand-secondary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1.3rem',
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
            {isSuspended ? (
              <button
                className="btn btn-primary btn-sm"
                disabled={unsuspendMutation.isPending}
                onClick={() => unsuspendMutation.mutate()}
              >
                <i className="bi bi-play-circle me-1" /> {unsuspendMutation.isPending ? 'Reactivating…' : 'Reactivate'}
              </button>
            ) : (
              <button className="btn btn-outline-danger btn-sm" onClick={() => setSuspendOpen(true)}>
                <i className="bi bi-pause-circle me-1" /> Suspend
              </button>
            )}
            <button className="btn btn-danger btn-sm" onClick={() => setDeleteOpen(true)}>
              <i className="bi bi-trash me-1" /> GDPR Delete
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
            <div className="col-12 col-md-4">
              <StatCard
                label="Total rides"
                value={String(rider.totalRides)}
                accent="primary"
                icon={<i className="bi bi-car-front" />}
              />
            </div>
            <div className="col-12 col-md-4">
              <StatCard
                label="Total spent"
                value={`€${rider.totalSpent}`}
                accent="secondary"
                icon={<i className="bi bi-cash-coin" />}
              />
            </div>
            <div className="col-12 col-md-4">
              <StatCard
                label="Member since"
                value={rider.joinedAt?.slice(0, 10) ?? '—'}
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
                  {recentRides.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-4">No rides yet</td></tr>
                  ) : (
                    recentRides.map((r) => (
                      <tr key={r.publicId}>
                        <td style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                          <Link href={`/admin/rides/${r.publicId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {r.publicId}
                          </Link>
                        </td>
                        <td>{r.driverName ?? '—'}</td>
                        <td>€{r.totalFare}</td>
                        <td>
                          <StatusBadge tone="info">
                            {String(r.status).replace(/_/g, ' ').toLowerCase()}
                          </StatusBadge>
                        </td>
                        <td style={{ color: 'var(--brand-text-muted)' }}>
                          {r.createdAt?.slice(0, 10)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      <Modal
        show={suspendOpen}
        onHide={() => setSuspendOpen(false)}
        title="Suspend rider"
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setSuspendOpen(false)}>Cancel</button>
            <button
              className="btn btn-danger btn-sm"
              disabled={suspendMutation.isPending}
              onClick={() => suspendMutation.mutate()}
            >
              {suspendMutation.isPending ? 'Suspending…' : 'Suspend rider'}
            </button>
          </>
        }
      >
        <div>
          <label className="form-label">Reason (optional)</label>
          <textarea
            className="form-control"
            rows={3}
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="e.g. abuse, chargebacks"
          />
        </div>
      </Modal>

      <Modal
        show={deleteOpen}
        onHide={() => { setDeleteOpen(false); setConfirmText(''); }}
        title="GDPR delete rider"
        footer={
          <>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => { setDeleteOpen(false); setConfirmText(''); }}
            >Cancel</button>
            <button
              className="btn btn-danger btn-sm"
              disabled={confirmText !== 'DELETE' || deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete permanently'}
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
