'use client';

import { motion } from 'framer-motion';
import StatCard from '@/components/StatCard';

const RECENT_TENANTS = [
  { name: 'CityRide UK', country: 'UK', currency: 'GBP', drivers: 124, status: 'Active' },
  { name: 'EuroCab Berlin', country: 'DE', currency: 'EUR', drivers: 89, status: 'Active' },
  { name: 'ParisGo', country: 'FR', currency: 'EUR', drivers: 56, status: 'Onboarding' },
  { name: 'Madrid Wheels', country: 'ES', currency: 'EUR', drivers: 41, status: 'Active' },
  { name: 'Rome Cabs', country: 'IT', currency: 'EUR', drivers: 12, status: 'Trial' },
];

const statusStyle = (s: string) => {
  if (s === 'Active') return { bg: 'rgba(168, 215, 41, 0.18)', color: '#5a7a14' };
  if (s === 'Onboarding') return { bg: 'rgba(59, 130, 246, 0.12)', color: '#1d4ed8' };
  return { bg: 'rgba(245, 158, 11, 0.14)', color: '#b45309' };
};

export default function SuperDashboardPage() {
  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Total Tenants"
            value="24"
            change="+3"
            changePositive
            accent="primary"
            icon={<i className="bi bi-building" />}
            delay={0.0}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Active Drivers"
            value="1,284"
            change="+12.4%"
            changePositive
            accent="secondary"
            icon={<i className="bi bi-person-badge" />}
            delay={0.06}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Rides Today"
            value="8,917"
            change="+5.2%"
            changePositive
            accent="info"
            icon={<i className="bi bi-car-front" />}
            delay={0.12}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="GMV (Today)"
            value="€ 142K"
            change="-2.1%"
            changePositive={false}
            accent="warning"
            icon={<i className="bi bi-graph-up-arrow" />}
            delay={0.18}
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="card"
            style={{ padding: '1.25rem 1.5rem' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="mb-0" style={{ color: 'var(--brand-secondary)', fontWeight: 700 }}>
                  Recent Tenants
                </h5>
                <small style={{ color: 'var(--brand-text-muted)' }}>
                  Latest 5 onboarded
                </small>
              </div>
              <button className="btn btn-outline-secondary btn-sm">View all</button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--brand-text-muted)' }}>
                    <th>Tenant</th>
                    <th>Country</th>
                    <th>Currency</th>
                    <th>Drivers</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_TENANTS.map((t, i) => {
                    const ss = statusStyle(t.status);
                    return (
                      <motion.tr
                        key={t.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
                      >
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                            {t.name}
                          </div>
                        </td>
                        <td>{t.country}</td>
                        <td>{t.currency}</td>
                        <td>{t.drivers}</td>
                        <td>
                          <span
                            style={{
                              background: ss.bg,
                              color: ss.color,
                              padding: '4px 10px',
                              borderRadius: 999,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-secondary" style={{ padding: '4px 12px' }}>
                            View
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <div className="col-12 col-xl-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="card h-100"
            style={{ padding: '1.25rem 1.5rem' }}
          >
            <h5 className="mb-1" style={{ color: 'var(--brand-secondary)', fontWeight: 700 }}>
              Quick Actions
            </h5>
            <small style={{ color: 'var(--brand-text-muted)' }} className="mb-3 d-block">
              Most common operations
            </small>

            <div className="d-flex flex-column gap-2">
              {[
                { icon: 'plus-circle', label: 'Onboard new tenant', primary: true },
                { icon: 'cash-coin', label: 'Update commission plans', primary: false },
                { icon: 'receipt', label: 'Generate billing report', primary: false },
                { icon: 'shield-check', label: 'Audit log', primary: false },
              ].map((a, i) => (
                <motion.button
                  key={a.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
                  whileHover={{ x: 4 }}
                  className={`btn ${a.primary ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center justify-content-between`}
                  style={{ borderRadius: 12 }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <i className={`bi bi-${a.icon}`} />
                    {a.label}
                  </span>
                  <i className="bi bi-arrow-right" />
                </motion.button>
              ))}
            </div>

            <div
              className="mt-4 p-3"
              style={{
                background: 'var(--brand-bg-page)',
                borderRadius: 12,
                fontSize: '0.85rem',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                <i className="bi bi-info-circle me-2" />
                System status
              </div>
              <div className="mt-2 d-flex align-items-center gap-2" style={{ color: 'var(--brand-text-muted)' }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--brand-primary)',
                    display: 'inline-block',
                  }}
                />
                All services operational
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
