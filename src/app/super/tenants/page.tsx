'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';

type Tenant = {
  id: string;
  name: string;
  slug: string;
  country: string;
  currency: string;
  drivers: number;
  ridesToday: number;
  plan: string;
  status: 'Active' | 'Onboarding' | 'Trial' | 'Suspended';
  createdAt: string;
};

const MOCK: Tenant[] = [
  { id: '1', name: 'CityRide UK', slug: 'cityride-uk', country: 'UK', currency: 'GBP', drivers: 124, ridesToday: 487, plan: 'Growth', status: 'Active', createdAt: '2026-02-10' },
  { id: '2', name: 'EuroCab Berlin', slug: 'eurocab-berlin', country: 'DE', currency: 'EUR', drivers: 89, ridesToday: 312, plan: 'Growth', status: 'Active', createdAt: '2026-02-22' },
  { id: '3', name: 'ParisGo', slug: 'parisgo', country: 'FR', currency: 'EUR', drivers: 56, ridesToday: 188, plan: 'Starter', status: 'Onboarding', createdAt: '2026-04-05' },
  { id: '4', name: 'Madrid Wheels', slug: 'madrid-wheels', country: 'ES', currency: 'EUR', drivers: 41, ridesToday: 142, plan: 'Starter', status: 'Active', createdAt: '2026-03-14' },
  { id: '5', name: 'Rome Cabs', slug: 'rome-cabs', country: 'IT', currency: 'EUR', drivers: 12, ridesToday: 34, plan: 'Trial', status: 'Trial', createdAt: '2026-05-01' },
  { id: '6', name: 'Amsterdam Move', slug: 'amsterdam-move', country: 'NL', currency: 'EUR', drivers: 67, ridesToday: 221, plan: 'Growth', status: 'Active', createdAt: '2026-01-30' },
  { id: '7', name: 'Lisboa Rides', slug: 'lisboa-rides', country: 'PT', currency: 'EUR', drivers: 28, ridesToday: 76, plan: 'Starter', status: 'Active', createdAt: '2026-03-02' },
  { id: '8', name: 'Vienna Drive', slug: 'vienna-drive', country: 'AT', currency: 'EUR', drivers: 19, ridesToday: 48, plan: 'Trial', status: 'Trial', createdAt: '2026-04-28' },
  { id: '9', name: 'Warsaw Wheels', slug: 'warsaw-wheels', country: 'PL', currency: 'PLN', drivers: 33, ridesToday: 91, plan: 'Starter', status: 'Active', createdAt: '2026-02-17' },
  { id: '10', name: 'Prague Pickup', slug: 'prague-pickup', country: 'CZ', currency: 'CZK', drivers: 22, ridesToday: 64, plan: 'Starter', status: 'Active', createdAt: '2026-03-22' },
  { id: '11', name: 'Stockholm Go', slug: 'stockholm-go', country: 'SE', currency: 'SEK', drivers: 15, ridesToday: 39, plan: 'Trial', status: 'Onboarding', createdAt: '2026-05-10' },
  { id: '12', name: 'Helsinki Lift', slug: 'helsinki-lift', country: 'FI', currency: 'EUR', drivers: 9, ridesToday: 18, plan: 'Trial', status: 'Suspended', createdAt: '2026-04-12' },
  { id: '13', name: 'Brussels Cab', slug: 'brussels-cab', country: 'BE', currency: 'EUR', drivers: 38, ridesToday: 110, plan: 'Growth', status: 'Active', createdAt: '2026-02-04' },
  { id: '14', name: 'Dublin Ride', slug: 'dublin-ride', country: 'IE', currency: 'EUR', drivers: 24, ridesToday: 71, plan: 'Starter', status: 'Active', createdAt: '2026-03-18' },
  { id: '15', name: 'Copenhagen Move', slug: 'copenhagen-move', country: 'DK', currency: 'DKK', drivers: 17, ridesToday: 44, plan: 'Trial', status: 'Trial', createdAt: '2026-05-04' },
];

const statusTone = (s: Tenant['status']) =>
  s === 'Active' ? 'success' : s === 'Onboarding' ? 'info' : s === 'Trial' ? 'warning' : 'danger';

export default function TenantsListPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | Tenant['status']>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK.filter((t) => {
      if (status !== 'all' && t.status !== status) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q)
      );
    });
  }, [query, status]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader
        title="Tenants"
        subtitle={`${filtered.length} total · across ${new Set(filtered.map((t) => t.country)).size} countries`}
        actions={
          <Link href="/super/tenants/new" className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-1" /> Add Tenant
          </Link>
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
              placeholder="Search name, slug, country…"
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
            <option value="Active">Active</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Trial">Trial</option>
            <option value="Suspended">Suspended</option>
          </select>
          <div className="ms-auto" style={{ fontSize: '0.78rem', color: 'var(--brand-text-muted)' }}>
            Showing {paged.length} of {filtered.length}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Country</th>
                <th>Currency</th>
                <th>Plan</th>
                <th className="text-end">Drivers</th>
                <th className="text-end">Rides Today</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center" style={{ color: 'var(--brand-text-muted)', padding: '2rem' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '1.5rem', display: 'block', marginBottom: 6 }} />
                    No tenants match your filters
                  </td>
                </tr>
              ) : (
                paged.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--brand-text-muted)' }}>{t.slug}</div>
                    </td>
                    <td>{t.country}</td>
                    <td>{t.currency}</td>
                    <td>{t.plan}</td>
                    <td className="text-end">{t.drivers}</td>
                    <td className="text-end">{t.ridesToday}</td>
                    <td>
                      <StatusBadge tone={statusTone(t.status)}>{t.status}</StatusBadge>
                    </td>
                    <td style={{ color: 'var(--brand-text-muted)' }}>{t.createdAt}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <Link href={`/super/tenants/${t.id}`} className="btn-icon" title="View">
                          <i className="bi bi-eye" />
                        </Link>
                        <button className="btn-icon" title="Edit">
                          <i className="bi bi-pencil" />
                        </button>
                        <button className="btn-icon" title="More">
                          <i className="bi bi-three-dots" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
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
