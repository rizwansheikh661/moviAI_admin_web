/**
 * Shared types for the admin API surface.
 *
 * Field names stay camelCase (the page components were authored against
 * Mock* shapes) — `camelize()` in the fetch wrapper handles the snake → camel
 * translation from the backend response.
 */

// ---------- Enums (mirror backend) ----------
export type VehicleClass = 'taxi' | 'premium' | 'xl';
export type DriverStatus = 'active' | 'pending_kyc' | 'suspended';
export type RiderStatus = 'active' | 'suspended';
export type RideStatus =
  | 'requested'
  | 'driver_assigned'
  | 'driver_arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  // legacy upper-case enums kept so old UI code still matches:
  | 'REQUESTED'
  | 'DRIVER_ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED_BY_RIDER'
  | 'CANCELLED_BY_DRIVER';
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';
export type CouponType = 'percent' | 'flat';
export type CouponStatus = 'active' | 'paused' | 'expired';

// ---------- Dashboard ----------
export type DashboardMetrics = {
  gmvToday: string;
  gmvDelta: string;
  commissionEarned: string;
  commissionDelta: string;
  activeRides: number;
  onlineDrivers: number;
  recentRides: Ride[];
  topDrivers: Driver[];
};

// ---------- Driver ----------
export type Driver = {
  id?: string;
  publicId: string;
  fullName: string;
  phone: string;
  email: string;
  vehicleClass: VehicleClass | null;
  status: DriverStatus;
  totalRides: number;
  joinedAt: string;
  rejectedReason?: string | null;
};

export type DriverDocument = {
  publicId: string;
  kind: string;
  status: 'pending' | 'approved' | 'rejected';
  url: string | null;
  rejectedReason?: string | null;
  uploadedAt: string;
};

export type DriverDetail = Driver & {
  vehicle?: {
    publicId: string;
    make: string;
    model: string;
    year: number;
    plate: string;
    color: string;
    vehicleClass: VehicleClass;
  } | null;
  documents: DriverDocument[];
  earnings: {
    totalCommission: string;
    totalPayout: string;
    pendingPayout: string;
    rideCount: number;
  };
  bankAccount?: {
    publicId: string;
    holderName: string;
    iban: string;
    isDefault: boolean;
  } | null;
};

// ---------- Rider ----------
export type Rider = {
  id?: string;
  publicId: string;
  fullName: string;
  phone: string;
  email: string;
  totalRides: number;
  totalSpent: string;
  status: RiderStatus;
  joinedAt: string;
};

export type RiderDetail = Rider & {
  recentRides: Ride[];
};

// ---------- Ride ----------
export type Ride = {
  id?: string;
  publicId: string;
  riderName: string;
  driverName: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  status: RideStatus;
  rideClass: VehicleClass;
  totalFare: string;
  commissionAmount: string;
  driverPayout: string;
  createdAt: string;
};

export type RideEvent = {
  type: string;
  at: string;
  meta?: Record<string, unknown>;
};

export type RideDetail = Ride & {
  rider: { publicId: string; fullName: string } | null;
  driver: { publicId: string; fullName: string } | null;
  fareBreakdown: {
    baseFare: string;
    distance: string;
    duration: string;
    surge: string;
    tip: string;
    discount: string;
    total: string;
  };
  events: RideEvent[];
  paymentPublicId?: string | null;
};

// ---------- Commission ----------
export type CommissionConfig = {
  commissionPct: string;
  cadence: 'weekly' | 'biweekly';
  dayOfWeek: number;
};

export type LedgerEntry = {
  id?: string;
  ts: string;
  refType: 'payment_capture' | 'refund' | 'adjustment' | string;
  direction: 'credit' | 'debit';
  amount: string;
  currency: string;
  balanceAfter: string;
  rideId: string | null;
  reason: string;
};

export type CommissionSummary = {
  totalCommission: string;
  totalRefunds: string;
  rideCount: number;
  byDay: Array<{ date: string; commission: string; rides: number }>;
};

// ---------- Payouts ----------
export type Payout = {
  id?: string;
  publicId?: string;
  driverName: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: string;
  deductions: string;
  netAmount: string;
  status: PayoutStatus;
  paidAt: string | null;
  bankRef: string | null;
};

// ---------- Coupons ----------
export type Coupon = {
  id?: string;
  publicId?: string;
  code: string;
  type: CouponType;
  value: string;
  rideClass: VehicleClass | null;
  minFare: string;
  expiresAt: string;
  redemptions: number;
  status: CouponStatus;
};

export type CouponAnalytics = {
  couponPublicId: string;
  code: string;
  redemptions: number;
  totalDiscount: string;
  topRiders: Array<{
    publicId: string | null;
    fullName: string | null;
    email: string | null;
    redemptions: number;
    totalDiscount: string;
  }>;
};

// ---------- Audit ----------
export type AuditEntry = {
  id?: string;
  ts: string;
  actorEmail: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
};

// ---------- Settings ----------
export type PlatformSettings = {
  general?: Record<string, unknown>;
  fareDefaults?: Record<string, unknown>;
  matching?: Record<string, unknown>;
  featureFlags?: Record<string, unknown>;
  legal?: Record<string, unknown>;
  commissionPct?: string;
  cadence?: string;
  dayOfWeek?: number;
};
