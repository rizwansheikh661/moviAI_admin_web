import { apiFetch, apiList } from './client';
import type {
  Driver, DriverDetail, Rider, RiderDetail, Ride, RideDetail,
  Payout, Coupon, CouponAnalytics, AuditEntry, LedgerEntry,
  CommissionConfig, CommissionSummary, PlatformSettings, DashboardMetrics,
} from './types';

// ---------- Dashboard ----------
export const dashboardApi = {
  metrics: () => apiFetch<DashboardMetrics>('/admin/dashboard/metrics'),
};

// ---------- Rides ----------
export type RideListParams = {
  q?: string;
  status?: string;
  rideClass?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};
export const ridesApi = {
  list: (params: RideListParams = {}) =>
    apiList<Ride>('/admin/rides', {
      query: {
        q: params.q,
        status: params.status,
        ride_class: params.rideClass,
        from: params.from,
        to: params.to,
        limit: params.limit,
        offset: params.offset,
      },
    }),
  get: (publicId: string) => apiFetch<RideDetail>(`/admin/rides/${publicId}`),
  cancel: (publicId: string, reason?: string) =>
    apiFetch(`/admin/rides/${publicId}/cancel`, {
      method: 'POST',
      body: { reason: reason ?? 'Cancelled by admin' },
    }),
  refund: (publicId: string, amount?: string, reason?: string) =>
    apiFetch(`/admin/rides/${publicId}/refund`, {
      method: 'POST',
      body: { amount, reason: reason ?? 'Admin refund' },
    }),
};

// ---------- Riders ----------
export type RiderListParams = { q?: string; status?: string; limit?: number; offset?: number };
export const ridersApi = {
  list: (params: RiderListParams = {}) =>
    apiList<Rider>('/admin/riders', { query: params as Record<string, string | number | undefined> }),
  get: (publicId: string) => apiFetch<RiderDetail>(`/admin/riders/${publicId}`),
  suspend: (publicId: string, reason?: string) =>
    apiFetch(`/admin/riders/${publicId}/suspend`, { method: 'POST', body: { reason } }),
  unsuspend: (publicId: string) =>
    apiFetch(`/admin/riders/${publicId}/unsuspend`, { method: 'POST' }),
  remove: (publicId: string) =>
    apiFetch(`/admin/riders/${publicId}`, { method: 'DELETE' }),
};

// ---------- Drivers ----------
export type DriverListParams = { q?: string; status?: string; limit?: number; offset?: number };
export const driversApi = {
  list: (params: DriverListParams = {}) =>
    apiList<Driver>('/admin/drivers', { query: params as Record<string, string | number | undefined> }),
  get: (publicId: string) => apiFetch<DriverDetail>(`/admin/drivers/${publicId}`),
  suspend: (publicId: string, reason?: string) =>
    apiFetch(`/admin/drivers/${publicId}/suspend`, { method: 'POST', body: { reason } }),
  unsuspend: (publicId: string) =>
    apiFetch(`/admin/drivers/${publicId}/unsuspend`, { method: 'POST' }),
  kycApprove: (publicId: string) =>
    apiFetch(`/admin/drivers/${publicId}/kyc/approve`, { method: 'POST' }),
  kycReject: (publicId: string, reason: string) =>
    apiFetch(`/admin/drivers/${publicId}/kyc/reject`, {
      method: 'POST',
      body: { reason },
    }),
};

// ---------- Commission ----------
export type LedgerParams = { from?: string; to?: string; limit?: number; offset?: number };
export const commissionApi = {
  getConfig: () => apiFetch<CommissionConfig>('/admin/commission/config'),
  updateConfig: (body: { commissionPct?: number; cadence?: string; dayOfWeek?: number }) =>
    apiFetch<CommissionConfig>('/admin/commission/config', {
      method: 'PATCH',
      body: {
        commission_pct: body.commissionPct,
        cadence: body.cadence,
        day_of_week: body.dayOfWeek,
      },
    }),
  ledger: (params: LedgerParams = {}) =>
    apiList<LedgerEntry>('/admin/commission/ledger', { query: params as Record<string, string | number | undefined> }),
  summary: (params: { from?: string; to?: string } = {}) =>
    apiFetch<CommissionSummary>('/admin/commission/summary', { query: params }),
};

// ---------- Payouts ----------
export type PayoutListParams = { status?: string; limit?: number; offset?: number };
export const payoutsApi = {
  list: (params: PayoutListParams = {}) =>
    apiList<Payout>('/admin/payouts', { query: params as Record<string, string | number | undefined> }),
  markPaid: (id: string, body: { bankRef?: string; note?: string }) =>
    apiFetch(`/admin/payouts/${id}/mark-paid`, {
      method: 'POST',
      body: { bank_ref: body.bankRef, note: body.note },
    }),
  markFailed: (id: string, body: { reason?: string }) =>
    apiFetch(`/admin/payouts/${id}/mark-failed`, {
      method: 'POST',
      body: { reason: body.reason },
    }),
  retry: (id: string) => apiFetch(`/admin/payouts/${id}/retry`, { method: 'POST' }),
  runSweep: () => apiFetch('/admin/payouts/run', { method: 'POST' }),
};

// ---------- Coupons ----------
export type CouponListParams = { status?: string; limit?: number; offset?: number };
export type CouponCreateBody = {
  code: string;
  description?: string;
  type: 'percent' | 'flat';
  value: number;
  minFareAmount?: number;
  maxDiscount?: number;
  rideClass?: string | null;
  maxRedemptions?: number | null;
  perUserLimit?: number | null;
  startsAt?: string | null;
  expiresAt?: string | null;
};
export const couponsApi = {
  list: (params: CouponListParams = {}) =>
    apiList<Coupon>('/admin/coupons', { query: params as Record<string, string | number | undefined> }),
  create: (body: CouponCreateBody) =>
    apiFetch<Coupon>('/admin/coupons', {
      method: 'POST',
      body: {
        code: body.code,
        description: body.description,
        type: body.type,
        value: body.value,
        min_fare_amount: body.minFareAmount,
        max_discount: body.maxDiscount,
        ride_class: body.rideClass,
        max_redemptions: body.maxRedemptions,
        per_user_limit: body.perUserLimit,
        starts_at: body.startsAt,
        expires_at: body.expiresAt,
      },
    }),
  expire: (id: string) =>
    apiFetch<Coupon>(`/admin/coupons/${id}/expire`, { method: 'POST' }),
  remove: (id: string) =>
    apiFetch(`/admin/coupons/${id}`, { method: 'DELETE' }),
  analytics: (id: string) => apiFetch<CouponAnalytics>(`/admin/coupons/${id}/analytics`),
};

// ---------- Audit ----------
export type AuditListParams = {
  actorEmail?: string;
  action?: string;
  entity?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};
export const auditApi = {
  list: (params: AuditListParams = {}) =>
    apiList<AuditEntry>('/admin/audit-log', {
      query: {
        actor_email: params.actorEmail,
        action: params.action,
        entity: params.entity,
        from: params.from,
        to: params.to,
        limit: params.limit,
        offset: params.offset,
      },
    }),
};

// ---------- Settings ----------
export const settingsApi = {
  get: () => apiFetch<PlatformSettings>('/admin/settings'),
  update: (body: Partial<PlatformSettings>) =>
    apiFetch<PlatformSettings>('/admin/settings', {
      method: 'PATCH',
      body: {
        general: body.general,
        fare_defaults: body.fareDefaults,
        matching: body.matching,
        feature_flags: body.featureFlags,
        legal: body.legal,
      },
    }),
};
