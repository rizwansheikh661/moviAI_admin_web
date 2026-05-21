'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { dashboardApi } from '@/lib/api/resources';
import type { Driver, Ride, RideStatus, DriverStatus } from '@/lib/api/types';

const rideTone = (s: RideStatus | string) => {
  const v = String(s).toLowerCase();
  if (v === 'completed') return 'success';
  if (v === 'in_progress' || v === 'driver_assigned' || v === 'driver_arrived') return 'info';
  if (v === 'requested') return 'warning';
  return 'danger';
};

const driverTone = (s: DriverStatus | string) =>
  s === 'active' ? 'success' : s === 'pending_kyc' ? 'warning' : 'danger';

const fmtMoney = (raw: string | undefined) => {
  if (!raw) return '€0';
  const n = Number(raw);
  if (Number.isNaN(n)) return `€${raw}`;
  return `€${n.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
};

const fmtDelta = (raw: string | undefined) => {
  if (!raw) return undefined;
  const n = Number(raw);
  if (Number.isNaN(n)) return raw;
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
};

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => dashboardApi.metrics().then((r) => r.data),
  });

  const recentRides: Ride[] = data?.recentRides ?? [];
  const recentDrivers: Driver[] = data?.topDrivers ?? [];

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="GMV today"
            value={isLoading ? '…' : fmtMoney(data?.gmvToday)}
            change={fmtDelta(data?.gmvDelta)}
            changePositive={Number(data?.gmvDelta ?? 0) >= 0}
            accent="primary"
            icon={<i className="bi bi-cash-stack" />}
            delay={0.0}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Commission earned"
            value={isLoading ? '…' : fmtMoney(data?.commissionEarned)}
            change={fmtDelta(data?.commissionDelta)}
            changePositive={Number(data?.commissionDelta ?? 0) >= 0}
            accent="secondary"
            icon={<i className="bi bi-coin" />}
            delay={0.06}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Active rides"
            value={isLoading ? '…' : String(data?.activeRides ?? 0)}
            accent="info"
            icon={<i className="bi bi-car-front" />}
            delay={0.12}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Online drivers"
            value={isLoading ? '…' : String(data?.onlineDrivers ?? 0)}
            accent="warning"
            icon={<i className="bi bi-person-badge" />}
            delay={0.18}
          />
        </div>
      </div>

      {isError && (
        <div className="alert alert-danger" role="alert" style={{ fontSize: '0.85rem' }}>
          We couldn't load the dashboard. {(error as Error)?.message}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
            className="card h-100"
            style={{ padding: '1.25rem 1.5rem', minHeight: 320, display: 'flex', flexDirection: 'column' }}
          >
            <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 12 }}>Live map</h6>
            <div
              style={{
                flex: 1,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(168, 215, 41, 0.18) 0%, rgba(10, 22, 51, 0.10) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <div className="text-center">
                <i className="bi bi-geo-alt" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }} />
                Live driver map — coming soon
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-12 col-xl-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4 }}
            className="card h-100"
            style={{ padding: '1.1rem 1.25rem' }}
          >
            <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 8 }}>Recent rides</h6>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Ride</th>
                    <th>Rider</th>
                    <th>Fare</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">Loading…</td>
                    </tr>
                  ) : recentRides.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">No recent rides</td>
                    </tr>
                  ) : (
                    recentRides.map((r) => (
                      <tr key={r.publicId}>
                        <td style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>{r.publicId}</td>
                        <td>{r.riderName}</td>
                        <td>€{r.totalFare}</td>
                        <td>
                          <StatusBadge tone={rideTone(r.status)}>
                            {String(r.status).replace(/_/g, ' ').toLowerCase()}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.4 }}
        className="card"
        style={{ padding: '1.1rem 1.25rem' }}
      >
        <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 8 }}>Top drivers</h6>
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Phone</th>
                <th>Vehicle class</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center text-muted py-3">Loading…</td></tr>
              ) : recentDrivers.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-3">No drivers yet</td></tr>
              ) : (
                recentDrivers.map((d) => (
                  <tr key={d.publicId}>
                    <td style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>{d.fullName}</td>
                    <td>{d.phone}</td>
                    <td style={{ textTransform: 'capitalize' }}>{d.vehicleClass ?? '—'}</td>
                    <td>
                      <StatusBadge tone={driverTone(d.status)}>{d.status.replace(/_/g, ' ')}</StatusBadge>
                    </td>
                    <td style={{ color: 'var(--brand-text-muted)' }}>{d.joinedAt?.slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
