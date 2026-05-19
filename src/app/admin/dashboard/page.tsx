'use client';

import { motion } from 'framer-motion';
import StatCard from '@/components/StatCard';

const RECENT_RIDES = [
  { id: 'R-10481', rider: 'Sarah J.', driver: 'Tom B.', fare: '£14.20', status: 'Completed' },
  { id: 'R-10480', rider: 'James K.', driver: 'Anita P.', fare: '£8.50', status: 'In progress' },
  { id: 'R-10479', rider: 'Olivia M.', driver: 'Tom B.', fare: '£21.00', status: 'Completed' },
  { id: 'R-10478', rider: 'Ben C.', driver: 'Rahul S.', fare: '£11.75', status: 'Cancelled' },
  { id: 'R-10477', rider: 'Mia W.', driver: 'Anita P.', fare: '£17.30', status: 'Completed' },
];

const rideStatusStyle = (s: string) => {
  if (s === 'Completed') return { bg: 'rgba(168, 215, 41, 0.18)', color: '#5a7a14' };
  if (s === 'In progress') return { bg: 'rgba(59, 130, 246, 0.12)', color: '#1d4ed8' };
  return { bg: 'rgba(239, 68, 68, 0.12)', color: '#b91c1c' };
};

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Active Drivers"
            value="124"
            change="+4"
            changePositive
            accent="primary"
            icon={<i className="bi bi-person-badge" />}
            delay={0.0}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Rides Today"
            value="487"
            change="+8.3%"
            changePositive
            accent="secondary"
            icon={<i className="bi bi-car-front" />}
            delay={0.06}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Revenue Today"
            value="£ 3,840"
            change="+2.1%"
            changePositive
            accent="info"
            icon={<i className="bi bi-cash-stack" />}
            delay={0.12}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Avg Rating"
            value="4.8"
            change="+0.1"
            changePositive
            accent="warning"
            icon={<i className="bi bi-star-fill" />}
            delay={0.18}
          />
        </div>
      </div>

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
              Recent Rides
            </h5>
            <small style={{ color: 'var(--brand-text-muted)' }}>Latest 5 trips</small>
          </div>
          <button className="btn btn-outline-secondary btn-sm">View all rides</button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Ride ID</th>
                <th>Rider</th>
                <th>Driver</th>
                <th>Fare</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {RECENT_RIDES.map((r, i) => {
                const ss = rideStatusStyle(r.status);
                return (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 + i * 0.05, duration: 0.3 }}
                  >
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--brand-secondary)' }}>
                        {r.id}
                      </span>
                    </td>
                    <td>{r.rider}</td>
                    <td>{r.driver}</td>
                    <td style={{ fontWeight: 600 }}>{r.fare}</td>
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
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon" title="Ride details">
                        <i className="bi bi-eye" />
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
  );
}
