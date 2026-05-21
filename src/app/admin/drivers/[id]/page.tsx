'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import Tabs from '@/components/Tabs';
import Modal from '@/components/Modal';
import { driversApi } from '@/lib/api/resources';
import type { DriverStatus, DriverDocument } from '@/lib/api/types';
import { ApiError } from '@/lib/api/client';

const tone = (s: DriverStatus | string) =>
  s === 'active' ? 'success' : s === 'pending_kyc' ? 'warning' : 'danger';

const docTone = (s: string) =>
  s === 'approved' ? 'success' : s === 'rejected' ? 'danger' : 'warning';

const TABS = [
  { key: 'profile', label: 'Profile', icon: 'person' },
  { key: 'vehicle', label: 'Vehicle', icon: 'car-front-fill' },
  { key: 'documents', label: 'Documents', icon: 'file-earmark-text' },
  { key: 'earnings', label: 'Earnings', icon: 'cash-coin' },
  { key: 'bank', label: 'Bank account', icon: 'bank' },
];

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? '');
  const qc = useQueryClient();

  const { data: driver, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'driver', id],
    queryFn: () => driversApi.get(id).then((r) => r.data),
    enabled: Boolean(id),
  });

  const [active, setActive] = useState('profile');
  const [kycRejectOpen, setKycRejectOpen] = useState(false);
  const [kycRejectReason, setKycRejectReason] = useState('');
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'driver', id] });
    qc.invalidateQueries({ queryKey: ['admin', 'drivers'] });
  };

  const approveMutation = useMutation({
    mutationFn: () => driversApi.kycApprove(id),
    onSuccess: () => { toast.success('KYC approved'); invalidate(); },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Approve failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: () => driversApi.kycReject(id, kycRejectReason),
    onSuccess: () => {
      toast.success('KYC rejected');
      setKycRejectOpen(false);
      setKycRejectReason('');
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Reject failed'),
  });

  const suspendMutation = useMutation({
    mutationFn: () => driversApi.suspend(id, suspendReason || undefined),
    onSuccess: () => {
      toast.success('Driver suspended');
      setSuspendOpen(false);
      setSuspendReason('');
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Suspend failed'),
  });

  const unsuspendMutation = useMutation({
    mutationFn: () => driversApi.unsuspend(id),
    onSuccess: () => { toast.success('Driver reactivated'); invalidate(); },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Unsuspend failed'),
  });

  if (isLoading) return <div className="text-center text-muted py-5">Loading driver…</div>;
  if (isError || !driver) {
    return (
      <div className="alert alert-danger" role="alert">
        Failed to load driver: {(error as Error)?.message ?? 'Not found'}
        <button className="btn btn-sm btn-link" onClick={() => router.push('/admin/drivers')}>Back</button>
      </div>
    );
  }

  const initials = driver.fullName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const docs = driver.documents ?? [];
  const isSuspended = driver.status === 'suspended';
  const isPending = driver.status === 'pending_kyc';

  return (
    <div>
      <PageHeader title={driver.fullName} subtitle={driver.publicId} />

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
              {driver.fullName}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--brand-text-muted)' }}>
              {driver.phone} · {driver.email}
            </div>
            <div className="mt-1 d-flex gap-2 align-items-center">
              <StatusBadge tone={tone(driver.status)}>
                {driver.status.replace(/_/g, ' ')}
              </StatusBadge>
              <span style={{ fontSize: '0.72rem', color: 'var(--brand-text-muted)', textTransform: 'capitalize' }}>
                {driver.vehicleClass ?? ''}
              </span>
            </div>
            {driver.rejectedReason && (
              <div className="mt-1" style={{ fontSize: '0.78rem', color: '#ef4444' }}>
                Reason: {driver.rejectedReason}
              </div>
            )}
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {isPending && (
              <>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={approveMutation.isPending}
                  onClick={() => approveMutation.mutate()}
                >
                  <i className="bi bi-check2 me-1" /> {approveMutation.isPending ? 'Approving…' : 'Approve KYC'}
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setKycRejectOpen(true)}
                >
                  <i className="bi bi-x-circle me-1" /> Reject KYC
                </button>
              </>
            )}
            {!isSuspended && !isPending && (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => setSuspendOpen(true)}
              >
                <i className="bi bi-pause-circle me-1" /> Suspend
              </button>
            )}
            {isSuspended && (
              <button
                className="btn btn-primary btn-sm"
                disabled={unsuspendMutation.isPending}
                onClick={() => unsuspendMutation.mutate()}
              >
                <i className="bi bi-play-circle me-1" /> {unsuspendMutation.isPending ? 'Reactivating…' : 'Reactivate'}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs tabs={TABS} activeKey={active} onChange={setActive} />

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="card"
        style={{ padding: '1.25rem 1.5rem' }}
      >
        {active === 'profile' && (
          <div className="row g-3" style={{ maxWidth: 640 }}>
            <Field label="Full name" value={driver.fullName} />
            <Field label="Public ID" value={driver.publicId} mono />
            <Field label="Phone" value={driver.phone} />
            <Field label="Email" value={driver.email} />
            <Field label="Vehicle class" value={driver.vehicleClass ?? '—'} />
            <Field label="Joined at" value={driver.joinedAt?.slice(0, 10) ?? '—'} />
          </div>
        )}

        {active === 'vehicle' && (
          driver.vehicle ? (
            <div>
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid var(--brand-border)' }}>
                <div
                  style={{
                    width: 72, height: 72, borderRadius: 12,
                    background: 'var(--brand-bg-page)', border: '1px solid var(--brand-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--brand-secondary)', fontSize: '2rem',
                  }}
                >
                  <i className="bi bi-car-front-fill" />
                </div>
                <div className="flex-grow-1">
                  <div style={{ fontWeight: 700, color: 'var(--brand-secondary)', fontSize: '1.05rem' }}>
                    {driver.vehicle.make} {driver.vehicle.model} · {driver.vehicle.year}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--brand-text-muted)' }}>
                    {driver.vehicle.color} · {driver.vehicle.plate}
                  </div>
                </div>
              </div>
              <div className="row g-3" style={{ maxWidth: 720 }}>
                <Field label="Make" value={driver.vehicle.make} />
                <Field label="Model" value={driver.vehicle.model} />
                <Field label="Year" value={String(driver.vehicle.year)} />
                <Field label="Color" value={driver.vehicle.color} />
                <Field label="Plate number" value={driver.vehicle.plate} mono />
                <Field label="Vehicle class" value={driver.vehicle.vehicleClass} />
              </div>
            </div>
          ) : (
            <div className="text-center text-muted py-4">No vehicle registered for this driver yet.</div>
          )
        )}

        {active === 'documents' && (
          docs.length === 0 ? (
            <div className="text-center text-muted py-4">No documents uploaded.</div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {docs.map((doc: DriverDocument) => (
                <div
                  key={doc.publicId}
                  className="d-flex align-items-center justify-content-between p-3"
                  style={{
                    background: 'var(--brand-bg-page)',
                    border: '1px solid var(--brand-border)',
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                      {doc.kind}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--brand-text-muted)' }}>
                      Uploaded {doc.uploadedAt?.slice(0, 10)}
                    </div>
                    {doc.rejectedReason && (
                      <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                        Rejected: {doc.rejectedReason}
                      </div>
                    )}
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    {doc.url && (
                      <a
                        className="btn btn-outline-secondary btn-sm"
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="bi bi-eye me-1" /> View
                      </a>
                    )}
                    <StatusBadge tone={docTone(doc.status)}>{doc.status}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {active === 'earnings' && (
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <StatCard
                label="Total commission"
                value={`€${driver.earnings?.totalCommission ?? '0.00'}`}
                accent="primary"
                icon={<i className="bi bi-coin" />}
              />
            </div>
            <div className="col-12 col-md-4">
              <StatCard
                label="Total payout"
                value={`€${driver.earnings?.totalPayout ?? '0.00'}`}
                accent="info"
                icon={<i className="bi bi-bank" />}
              />
            </div>
            <div className="col-12 col-md-4">
              <StatCard
                label="Pending payout"
                value={`€${driver.earnings?.pendingPayout ?? '0.00'}`}
                accent="warning"
                icon={<i className="bi bi-hourglass" />}
              />
            </div>
            <div className="col-12">
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                Ride count: {driver.earnings?.rideCount ?? 0}
              </div>
            </div>
          </div>
        )}

        {active === 'bank' && (
          driver.bankAccount ? (
            <div className="row g-3" style={{ maxWidth: 480 }}>
              <Field label="Account holder" value={driver.bankAccount.holderName} />
              <Field label="IBAN" value={driver.bankAccount.iban} mono />
              <Field label="Default" value={driver.bankAccount.isDefault ? 'Yes' : 'No'} />
            </div>
          ) : (
            <div className="text-center text-muted py-4">No bank account on file.</div>
          )
        )}
      </motion.div>

      <Modal
        show={kycRejectOpen}
        onHide={() => setKycRejectOpen(false)}
        title="Reject KYC"
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setKycRejectOpen(false)}>Cancel</button>
            <button
              className="btn btn-danger btn-sm"
              disabled={rejectMutation.isPending || !kycRejectReason.trim()}
              onClick={() => rejectMutation.mutate()}
            >
              {rejectMutation.isPending ? 'Rejecting…' : 'Reject KYC'}
            </button>
          </>
        }
      >
        <div>
          <label className="form-label">Reason (required)</label>
          <textarea
            className="form-control"
            rows={3}
            value={kycRejectReason}
            onChange={(e) => setKycRejectReason(e.target.value)}
            placeholder="Why are you rejecting this driver's KYC?"
          />
        </div>
      </Modal>

      <Modal
        show={suspendOpen}
        onHide={() => setSuspendOpen(false)}
        title="Suspend driver"
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setSuspendOpen(false)}>Cancel</button>
            <button
              className="btn btn-danger btn-sm"
              disabled={suspendMutation.isPending}
              onClick={() => suspendMutation.mutate()}
            >
              {suspendMutation.isPending ? 'Suspending…' : 'Suspend driver'}
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
            placeholder="e.g. complaints, fraud risk"
          />
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="col-md-6">
      <label className="form-label" style={{ fontSize: '0.78rem' }}>{label}</label>
      <input
        className="form-control"
        value={value}
        readOnly
        style={{ fontFamily: mono ? 'ui-monospace, monospace' : undefined, fontSize: '0.85rem' }}
      />
    </div>
  );
}
