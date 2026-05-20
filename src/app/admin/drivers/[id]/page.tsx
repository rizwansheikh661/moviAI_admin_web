'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import Tabs from '@/components/Tabs';
import { MOCK_DRIVERS, MOCK_RIDES, DriverStatus } from '@/lib/mock';

const tone = (s: DriverStatus) =>
  s === 'active' ? 'success' : s === 'pending_kyc' ? 'warning' : 'danger';

const TABS = [
  { key: 'profile', label: 'Profile', icon: 'person' },
  { key: 'vehicle', label: 'Vehicle', icon: 'car-front-fill' },
  { key: 'documents', label: 'Documents', icon: 'file-earmark-text' },
  { key: 'rides', label: 'Rides', icon: 'car-front' },
  { key: 'earnings', label: 'Earnings', icon: 'cash-coin' },
  { key: 'bank', label: 'Bank account', icon: 'bank' },
];

const VEHICLE = {
  make: 'Toyota',
  model: 'Prius',
  year: '2022',
  color: 'Silver',
  plate: 'B-MV 4821',
  vin: 'JTDKB20U703456789',
  seats: '4',
  insuranceProvider: 'Allianz',
  insuranceExpiry: '2026-11-30',
  registrationExpiry: '2027-03-14',
  inspectionStatus: 'passed',
};

const DOCS = [
  { name: "Driver's licence", status: 'pending' },
  { name: 'Insurance certificate', status: 'pending' },
  { name: 'Vehicle photo', status: 'approved' },
];

export default function DriverDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const driver = MOCK_DRIVERS.find((d) => d.publicId === id) ?? MOCK_DRIVERS[0];
  const [active, setActive] = useState('profile');

  const initials = driver.fullName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');

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
              {driver.fullName}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--brand-text-muted)' }}>
              {driver.phone} · {driver.email}
            </div>
            <div className="mt-1 d-flex gap-2 align-items-center">
              <StatusBadge tone={tone(driver.status)}>
                {driver.status.replace(/_/g, ' ')}
              </StatusBadge>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--brand-text-muted)',
                  textTransform: 'capitalize',
                }}
              >
                {driver.vehicleClass}
              </span>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => alert('KYC approved. (mock)')}
            >
              <i className="bi bi-check2 me-1" /> Approve KYC
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => alert('Driver suspended. (mock)')}
            >
              <i className="bi bi-pause-circle me-1" /> Suspend
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
        className="card"
        style={{ padding: '1.25rem 1.5rem' }}
      >
        {active === 'profile' && (
          <div className="row g-3" style={{ maxWidth: 640 }}>
            <Field label="Full name" value={driver.fullName} />
            <Field label="Public ID" value={driver.publicId} mono />
            <Field label="Phone" value={driver.phone} />
            <Field label="Email" value={driver.email} />
            <Field label="Vehicle class" value={driver.vehicleClass} />
            <Field label="Joined at" value={driver.joinedAt} />
          </div>
        )}

        {active === 'vehicle' && (
          <div>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid var(--brand-border)' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 12,
                  background: 'var(--brand-bg-page)',
                  border: '1px solid var(--brand-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-secondary)',
                  fontSize: '2rem',
                }}
              >
                <i className="bi bi-car-front-fill" />
              </div>
              <div className="flex-grow-1">
                <div style={{ fontWeight: 700, color: 'var(--brand-secondary)', fontSize: '1.05rem' }}>
                  {VEHICLE.make} {VEHICLE.model} · {VEHICLE.year}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--brand-text-muted)' }}>
                  {VEHICLE.color} · {VEHICLE.plate} · {VEHICLE.seats} seats
                </div>
                <div className="mt-1 d-flex gap-2 align-items-center">
                  <StatusBadge tone="success">Inspection {VEHICLE.inspectionStatus}</StatusBadge>
                  <span style={{ fontSize: '0.72rem', color: 'var(--brand-text-muted)', textTransform: 'capitalize' }}>
                    Class: {driver.vehicleClass}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => alert('Vehicle edit form. (mock)')}
              >
                <i className="bi bi-pencil me-1" /> Edit
              </button>
            </div>
            <div className="row g-3" style={{ maxWidth: 720 }}>
              <Field label="Make" value={VEHICLE.make} />
              <Field label="Model" value={VEHICLE.model} />
              <Field label="Year" value={VEHICLE.year} />
              <Field label="Color" value={VEHICLE.color} />
              <Field label="Plate number" value={VEHICLE.plate} mono />
              <Field label="VIN" value={VEHICLE.vin} mono />
              <Field label="Seats" value={VEHICLE.seats} />
              <Field label="Insurance provider" value={VEHICLE.insuranceProvider} />
              <Field label="Insurance expiry" value={VEHICLE.insuranceExpiry} />
              <Field label="Registration expiry" value={VEHICLE.registrationExpiry} />
            </div>
          </div>
        )}

        {active === 'documents' && (
          <div className="d-flex flex-column gap-2">
            {DOCS.map((doc) => (
              <div
                key={doc.name}
                className="d-flex align-items-center justify-content-between p-3"
                style={{
                  background: 'var(--brand-bg-page)',
                  border: '1px solid var(--brand-border)',
                  borderRadius: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--brand-text-muted)' }}>
                    Uploaded 2026-05-15
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => alert(`Approved ${doc.name}. (mock)`)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => alert(`Rejected ${doc.name}. (mock)`)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {active === 'rides' && (
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Ride</th>
                  <th>Rider</th>
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
                    <td>{r.riderName}</td>
                    <td>€{r.totalFare}</td>
                    <td>
                      <StatusBadge tone="info">{r.status.replace(/_/g, ' ').toLowerCase()}</StatusBadge>
                    </td>
                    <td style={{ color: 'var(--brand-text-muted)' }}>{r.createdAt.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {active === 'earnings' && (
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <StatCard label="This week" value="€482.30" accent="primary" icon={<i className="bi bi-calendar3" />} />
            </div>
            <div className="col-12 col-md-4">
              <StatCard label="This month" value="€1,840.20" accent="info" icon={<i className="bi bi-calendar-month" />} />
            </div>
            <div className="col-12 col-md-4">
              <StatCard label="Lifetime" value="€14,820.40" accent="secondary" icon={<i className="bi bi-trophy" />} />
            </div>
          </div>
        )}

        {active === 'bank' && (
          <div className="row g-3" style={{ maxWidth: 480 }}>
            <Field label="Account holder" value={driver.fullName} />
            <Field label="IBAN (masked)" value="DE89 **** **** **** **** 1234" mono />
            <Field label="Bank name" value="Deutsche Bank" />
            <Field label="Last verified" value="2026-04-12" />
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="col-md-6">
      <label className="form-label" style={{ fontSize: '0.78rem' }}>
        {label}
      </label>
      <input
        className="form-control"
        defaultValue={value}
        readOnly
        style={{
          fontFamily: mono ? 'ui-monospace, monospace' : undefined,
          fontSize: '0.85rem',
        }}
      />
    </div>
  );
}
