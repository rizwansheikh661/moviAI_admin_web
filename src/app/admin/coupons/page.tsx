'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { MOCK_COUPONS, CouponStatus } from '@/lib/mock';

const tone = (s: CouponStatus) => (s === 'active' ? 'success' : 'neutral');

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percent',
    value: '',
    rideClass: 'all',
    minFare: '',
    expiresAt: '',
  });

  const paged = useMemo(
    () => MOCK_COUPONS.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize]
  );

  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle={`${MOCK_COUPONS.length} coupons`}
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)}>
            <i className="bi bi-plus-lg me-1" /> New coupon
          </button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ padding: '1rem 1.25rem' }}
      >
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th className="text-end">Value</th>
                <th>Ride class</th>
                <th className="text-end">Min fare</th>
                <th>Expires at</th>
                <th className="text-end">Redemptions</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span
                      style={{
                        fontFamily: 'ui-monospace, monospace',
                        fontWeight: 700,
                        color: 'var(--brand-secondary)',
                      }}
                    >
                      {c.code}
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{c.type}</td>
                  <td className="text-end" style={{ fontWeight: 600 }}>
                    {c.type === 'percent' ? `${c.value}%` : `€${c.value}`}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {c.rideClass ?? <span style={{ color: 'var(--brand-text-muted)' }}>all</span>}
                  </td>
                  <td className="text-end">€{c.minFare}</td>
                  <td style={{ color: 'var(--brand-text-muted)' }}>{c.expiresAt}</td>
                  <td className="text-end">{c.redemptions}</td>
                  <td>
                    <StatusBadge tone={tone(c.status)}>{c.status}</StatusBadge>
                  </td>
                  <td className="text-end">
                    {c.status === 'active' && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => alert(`Coupon ${c.code} expired. (mock)`)}
                      >
                        Expire now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={MOCK_COUPONS.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </motion.div>

      <Modal
        show={createOpen}
        onHide={() => setCreateOpen(false)}
        title="New coupon"
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                alert(`Coupon ${form.code} created. (mock)`);
                setCreateOpen(false);
              }}
            >
              Create
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Code</label>
            <input
              className="form-control"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="SUMMER20"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (€)</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Value</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Ride class</label>
            <select
              className="form-select"
              value={form.rideClass}
              onChange={(e) => setForm({ ...form, rideClass: e.target.value })}
            >
              <option value="all">All</option>
              <option value="taxi">Taxi</option>
              <option value="premium">Premium</option>
              <option value="xl">XL</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Min fare (€)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={form.minFare}
              onChange={(e) => setForm({ ...form, minFare: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Expires at</label>
            <input
              type="date"
              className="form-control"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
