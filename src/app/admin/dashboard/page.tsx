'use client';

import { motion } from 'framer-motion';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { MOCK_RIDES, MOCK_DRIVERS, RideStatus, DriverStatus } from '@/lib/mock';

const rideTone = (s: RideStatus) => {
  if (s === 'COMPLETED') return 'success';
  if (s === 'IN_PROGRESS' || s === 'DRIVER_ASSIGNED') return 'info';
  if (s === 'REQUESTED') return 'warning';
  return 'danger';
};

const driverTone = (s: DriverStatus) =>
  s === 'active' ? 'success' : s === 'pending_kyc' ? 'warning' : 'danger';

export default function AdminDashboardPage() {
  const recentRides = MOCK_RIDES.slice(0, 5);
  const recentDrivers = [...MOCK_DRIVERS]
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .slice(0, 5);

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="GMV today"
            value="€4,820"
            change="+6.2%"
            changePositive
            accent="primary"
            icon={<i className="bi bi-cash-stack" />}
            delay={0.0}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Commission earned"
            value="€964"
            change="+5.8%"
            changePositive
            accent="secondary"
            icon={<i className="bi bi-coin" />}
            delay={0.06}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Active rides"
            value="38"
            change="+12"
            changePositive
            accent="info"
            icon={<i className="bi bi-car-front" />}
            delay={0.12}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Online drivers"
            value="124"
            change="+4"
            changePositive
            accent="warning"
            icon={<i className="bi bi-person-badge" />}
            delay={0.18}
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
            className="card h-100"
            style={{
              padding: '1.25rem 1.5rem',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 12 }}>
              Live map
            </h6>
            <div
              style={{
                flex: 1,
                borderRadius: 12,
                background:
                  'linear-gradient(135deg, rgba(168, 215, 41, 0.18) 0%, rgba(10, 22, 51, 0.10) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <div className="text-center">
                <i
                  className="bi bi-geo-alt"
                  style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}
                />
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
            <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 8 }}>
              Recent rides
            </h6>
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
                  {recentRides.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                        {r.publicId}
                      </td>
                      <td>{r.riderName}</td>
                      <td>€{r.totalFare}</td>
                      <td>
                        <StatusBadge tone={rideTone(r.status)}>
                          {r.status.replace(/_/g, ' ').toLowerCase()}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
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
        <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 8 }}>
          Recent driver signups
        </h6>
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
              {recentDrivers.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                    {d.fullName}
                  </td>
                  <td>{d.phone}</td>
                  <td style={{ textTransform: 'capitalize' }}>{d.vehicleClass}</td>
                  <td>
                    <StatusBadge tone={driverTone(d.status)}>
                      {d.status.replace(/_/g, ' ')}
                    </StatusBadge>
                  </td>
                  <td style={{ color: 'var(--brand-text-muted)' }}>{d.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
