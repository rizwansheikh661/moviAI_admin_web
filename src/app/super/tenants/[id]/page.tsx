'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';

const TABS = ['Overview', 'Settings', 'Commission', 'Billing', 'Audit'] as const;
type Tab = (typeof TABS)[number];

export default function TenantDetailPage() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('Overview');

  const tenant = {
    id: params.id,
    name: 'CityRide UK',
    slug: 'cityride-uk',
    host: 'api.cityride.uk',
    country: 'UK',
    currency: 'GBP',
    timezone: 'Europe/London',
    plan: 'Growth',
    status: 'Active' as const,
    createdAt: '2026-02-10',
    drivers: 124,
    ridesToday: 487,
    revenue: '£ 3,840',
    rating: 4.8,
  };

  return (
    <div>
      <PageHeader
        title={tenant.name}
        subtitle={
          <span className="d-inline-flex align-items-center gap-2">
            <span>{tenant.slug}</span>
            <span style={{ color: 'var(--brand-border-strong)' }}>·</span>
            <span>{tenant.host}</span>
            <StatusBadge tone="success">{tenant.status}</StatusBadge>
          </span>
        }
        actions={
          <>
            <Link href="/super/tenants" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-left me-1" /> Back
            </Link>
            <button className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-pencil me-1" /> Edit
            </button>
            <button className="btn btn-primary btn-sm">
              <i className="bi bi-box-arrow-up-right me-1" /> Impersonate
            </button>
          </>
        }
      />

      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard label="Drivers" value={tenant.drivers} accent="primary" icon={<i className="bi bi-person-badge" />} delay={0} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard label="Rides Today" value={tenant.ridesToday} accent="info" icon={<i className="bi bi-car-front" />} delay={0.05} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard label="Revenue Today" value={tenant.revenue} accent="secondary" icon={<i className="bi bi-cash-stack" />} delay={0.1} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard label="Avg Rating" value={tenant.rating} accent="warning" icon={<i className="bi bi-star-fill" />} delay={0.15} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="card"
        style={{ padding: '0 0 1rem 0' }}
      >
        <div
          className="d-flex gap-1 px-3 pt-2"
          style={{ borderBottom: '1px solid var(--brand-border)' }}
        >
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--brand-secondary)' : 'var(--brand-text-muted)',
                  borderBottom: active ? '2px solid var(--brand-primary)' : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'all 0.15s ease',
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {tab === 'Overview' && (
            <div className="row g-3">
              <DetailRow label="Tenant ID" value={tenant.id} mono />
              <DetailRow label="Slug" value={tenant.slug} mono />
              <DetailRow label="API Host" value={tenant.host} mono />
              <DetailRow label="Country" value={tenant.country} />
              <DetailRow label="Currency" value={tenant.currency} />
              <DetailRow label="Timezone" value={tenant.timezone} />
              <DetailRow label="Plan" value={tenant.plan} />
              <DetailRow label="Created" value={tenant.createdAt} />
            </div>
          )}
          {tab !== 'Overview' && (
            <div className="text-center" style={{ color: 'var(--brand-text-muted)', padding: '2rem 0' }}>
              <i className="bi bi-tools" style={{ fontSize: '1.5rem', display: 'block', marginBottom: 8 }} />
              <div style={{ fontSize: '0.85rem' }}>{tab} panel coming in Phase 2</div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div className="col-md-6">
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-text-muted)', marginBottom: 4 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--brand-secondary)',
          fontFamily: mono ? 'ui-monospace, SFMono-Regular, monospace' : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}
