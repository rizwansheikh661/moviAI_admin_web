'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { couponsApi, type CouponCreateBody } from '@/lib/api/resources';
import { ApiError } from '@/lib/api/client';
import type { Coupon, CouponStatus, CouponAnalytics } from '@/lib/api/types';

const tone = (s: CouponStatus | string) => (s === 'active' ? 'success' : 'neutral');

type FormState = {
  code: string;
  type: 'percent' | 'flat';
  value: string;
  rideClass: string;
  minFare: string;
  expiresAt: string;
};

const DEFAULT_FORM: FormState = {
  code: '',
  type: 'percent',
  value: '',
  rideClass: 'all',
  minFare: '',
  expiresAt: '',
};

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [analyticsCoupon, setAnalyticsCoupon] = useState<Coupon | null>(null);
  const qc = useQueryClient();

  const offset = (page - 1) * pageSize;
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['admin', 'coupons', { pageSize, offset }],
    queryFn: () => couponsApi.list({ limit: pageSize, offset }),
    placeholderData: keepPreviousData,
  });
  const rows = data?.items ?? [];
  const total = data?.total ?? rows.length;

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });

  const createMutation = useMutation({
    mutationFn: (body: CouponCreateBody) => couponsApi.create(body),
    onSuccess: () => {
      toast.success('Coupon created');
      setCreateOpen(false);
      setForm(DEFAULT_FORM);
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Create failed'),
  });

  const expireMutation = useMutation({
    mutationFn: (id: string) => couponsApi.expire(id),
    onSuccess: () => { toast.success('Coupon expired'); invalidate(); },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Expire failed'),
  });

  const analyticsQuery = useQuery({
    queryKey: ['admin', 'coupons', 'analytics', analyticsCoupon?.publicId ?? analyticsCoupon?.id],
    queryFn: () =>
      couponsApi
        .analytics(String(analyticsCoupon?.publicId ?? analyticsCoupon?.id))
        .then((r) => r.data as CouponAnalytics),
    enabled: !!analyticsCoupon,
  });

  const submitCreate = () => {
    if (!form.code.trim() || !form.value) {
      toast.error('Code and value are required');
      return;
    }
    createMutation.mutate({
      code: form.code.trim(),
      type: form.type,
      value: Number(form.value),
      minFareAmount: form.minFare ? Number(form.minFare) : undefined,
      rideClass: form.rideClass === 'all' ? null : form.rideClass,
      expiresAt: form.expiresAt || null,
    });
  };

  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle={`${total} coupons`}
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
        {isError && (
          <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
            Failed to load coupons: {(error as Error)?.message}
          </div>
        )}
        <div className="table-responsive" style={{ opacity: isFetching ? 0.65 : 1, transition: 'opacity 0.2s' }}>
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
              {isLoading ? (
                <tr><td colSpan={9} className="text-center text-muted py-4">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-muted py-4">No coupons</td></tr>
              ) : (
                rows.map((c) => {
                  const cid = c.publicId ?? String(c.id);
                  return (
                    <tr key={cid}>
                      <td>
                        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: 'var(--brand-secondary)' }}>
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
                      <td style={{ color: 'var(--brand-text-muted)' }}>{c.expiresAt?.slice(0, 10)}</td>
                      <td className="text-end">{c.redemptions}</td>
                      <td><StatusBadge tone={tone(c.status)}>{c.status}</StatusBadge></td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => setAnalyticsCoupon(c)}
                        >
                          <i className="bi bi-graph-up" />
                        </button>
                        {c.status === 'active' && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            disabled={expireMutation.isPending}
                            onClick={() => expireMutation.mutate(cid)}
                          >
                            Expire now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </motion.div>

      <Modal
        show={createOpen}
        onHide={() => setCreateOpen(false)}
        title="New coupon"
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button
              className="btn btn-primary btn-sm"
              disabled={createMutation.isPending}
              onClick={submitCreate}
            >
              {createMutation.isPending ? 'Creating…' : 'Create'}
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
              onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'flat' })}
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

      <Modal
        show={!!analyticsCoupon}
        onHide={() => setAnalyticsCoupon(null)}
        title={analyticsCoupon ? `Analytics — ${analyticsCoupon.code}` : ''}
        footer={
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setAnalyticsCoupon(null)}>Close</button>
        }
      >
        {analyticsQuery.isLoading ? (
          <div className="text-muted">Loading analytics…</div>
        ) : analyticsQuery.isError ? (
          <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
            Failed to load: {(analyticsQuery.error as Error)?.message}
          </div>
        ) : analyticsQuery.data ? (
          <div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <div style={{ fontSize: '0.78rem', color: 'var(--brand-text-muted)' }}>Redemptions</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{analyticsQuery.data.redemptions}</div>
              </div>
              <div className="col-6">
                <div style={{ fontSize: '0.78rem', color: 'var(--brand-text-muted)' }}>Total discount</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>€{analyticsQuery.data.totalDiscount}</div>
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 8 }}>Top riders</div>
            <table className="table table-sm">
              <thead><tr><th>Rider</th><th className="text-end">Redemptions</th><th className="text-end">Discount</th></tr></thead>
              <tbody>
                {(analyticsQuery.data.topRiders ?? []).length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-muted">No redemptions yet</td></tr>
                ) : (
                  analyticsQuery.data.topRiders.map((r, i) => (
                    <tr key={r.publicId ?? i}>
                      <td>{r.fullName ?? '—'}<div style={{ fontSize: '0.72rem', color: 'var(--brand-text-muted)' }}>{r.email}</div></td>
                      <td className="text-end">{r.redemptions}</td>
                      <td className="text-end">€{r.totalDiscount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
