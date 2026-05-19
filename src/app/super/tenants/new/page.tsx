'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';

const COUNTRIES = [
  { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'PT', name: 'Portugal', currency: 'EUR' },
  { code: 'PL', name: 'Poland', currency: 'PLN' },
  { code: 'CZ', name: 'Czechia', currency: 'CZK' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' },
  { code: 'DK', name: 'Denmark', currency: 'DKK' },
];

export default function NewTenantPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    country: 'UK',
    currency: 'GBP',
    timezone: 'Europe/London',
    plan: 'Starter',
    adminEmail: '',
    adminName: '',
    host: '',
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const onCountry = (code: string) => {
    const c = COUNTRIES.find((x) => x.code === code);
    setForm((f) => ({ ...f, country: code, currency: c?.currency || f.currency }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => router.push('/super/tenants'), 700);
  };

  return (
    <div>
      <PageHeader
        title="Onboard New Tenant"
        subtitle="Create a new white-label workspace"
        actions={
          <Link href="/super/tenants" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1" /> Back
          </Link>
        }
      />

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ padding: '1.5rem 1.75rem', maxWidth: 880 }}
      >
        <SectionTitle icon="building" title="Brand & Identity" />
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Tenant name</label>
            <input
              className="form-control"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="CityRide UK"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Slug</label>
            <input
              className="form-control"
              required
              value={form.slug}
              onChange={(e) => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="cityride-uk"
            />
            <small style={{ color: 'var(--brand-text-muted)', fontSize: '0.72rem' }}>
              Used in URLs and subdomain
            </small>
          </div>
          <div className="col-md-12">
            <label className="form-label">API host</label>
            <input
              className="form-control"
              value={form.host}
              onChange={(e) => update('host', e.target.value)}
              placeholder="api.cityride.uk"
            />
          </div>
        </div>

        <SectionTitle icon="globe2" title="Region & Currency" />
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Country</label>
            <select className="form-select" value={form.country} onChange={(e) => onCountry(e.target.value)}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Currency</label>
            <input className="form-control" value={form.currency} onChange={(e) => update('currency', e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Timezone</label>
            <input
              className="form-control"
              value={form.timezone}
              onChange={(e) => update('timezone', e.target.value)}
              placeholder="Europe/London"
            />
          </div>
        </div>

        <SectionTitle icon="cash-coin" title="Commission Plan" />
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Plan tier</label>
            <select className="form-select" value={form.plan} onChange={(e) => update('plan', e.target.value)}>
              <option>Trial</option>
              <option>Starter</option>
              <option>Growth</option>
              <option>Enterprise</option>
            </select>
            <small style={{ color: 'var(--brand-text-muted)', fontSize: '0.72rem' }}>
              Commission rules configurable later under Commission Plans
            </small>
          </div>
        </div>

        <SectionTitle icon="person-badge" title="Tenant Admin" />
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Admin name</label>
            <input
              className="form-control"
              required
              value={form.adminName}
              onChange={(e) => update('adminName', e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Admin email</label>
            <input
              type="email"
              className="form-control"
              required
              value={form.adminEmail}
              onChange={(e) => update('adminEmail', e.target.value)}
              placeholder="admin@cityride.uk"
            />
            <small style={{ color: 'var(--brand-text-muted)', fontSize: '0.72rem' }}>
              Invite email sent on creation
            </small>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: '1px solid var(--brand-border)' }}>
          <Link href="/super/tenants" className="btn btn-outline-secondary btn-sm">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creating…
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-1" /> Create Tenant
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="d-flex align-items-center gap-2 mb-3" style={{ color: 'var(--brand-secondary)' }}>
      <i className={`bi bi-${icon}`} style={{ fontSize: '0.95rem' }} />
      <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </span>
    </div>
  );
}
