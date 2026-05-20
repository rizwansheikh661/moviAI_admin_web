// Mock data for Phase 1. Replace with /api/v1/* calls in Phase 2.

export type VehicleClass = 'taxi' | 'premium' | 'xl';
export type DriverStatus = 'active' | 'pending_kyc' | 'suspended';

export type MockDriver = {
  id: string;
  publicId: string;
  fullName: string;
  phone: string;
  email: string;
  vehicleClass: VehicleClass;
  status: DriverStatus;
  totalRides: number;
  joinedAt: string;
};

export const MOCK_DRIVERS: MockDriver[] = [
  { id: '1', publicId: 'drv_001', fullName: 'Lukas Müller', phone: '+49 151 23456701', email: 'lukas.muller@example.de', vehicleClass: 'taxi', status: 'active', totalRides: 1820, joinedAt: '2026-03-12' },
  { id: '2', publicId: 'drv_002', fullName: 'Sofia Rossi', phone: '+39 333 4567802', email: 'sofia.rossi@example.it', vehicleClass: 'premium', status: 'active', totalRides: 2180, joinedAt: '2026-02-18' },
  { id: '3', publicId: 'drv_003', fullName: 'Mateusz Kowalski', phone: '+48 605 567803', email: 'mateusz.kowalski@example.pl', vehicleClass: 'taxi', status: 'pending_kyc', totalRides: 0, joinedAt: '2026-05-15' },
  { id: '4', publicId: 'drv_004', fullName: 'Marie Laurent', phone: '+33 6 12 34 56 04', email: 'marie.laurent@example.fr', vehicleClass: 'xl', status: 'active', totalRides: 980, joinedAt: '2026-04-04' },
  { id: '5', publicId: 'drv_005', fullName: 'Carlos García', phone: '+34 612 345 605', email: 'carlos.garcia@example.es', vehicleClass: 'taxi', status: 'active', totalRides: 1340, joinedAt: '2026-03-30' },
  { id: '6', publicId: 'drv_006', fullName: 'Anna Nowak', phone: '+48 605 567806', email: 'anna.nowak@example.pl', vehicleClass: 'premium', status: 'suspended', totalRides: 410, joinedAt: '2026-02-08' },
  { id: '7', publicId: 'drv_007', fullName: 'Jonas Berger', phone: '+49 151 23456707', email: 'jonas.berger@example.de', vehicleClass: 'taxi', status: 'active', totalRides: 1750, joinedAt: '2026-03-22' },
  { id: '8', publicId: 'drv_008', fullName: 'Elena Popescu', phone: '+40 712 345 608', email: 'elena.popescu@example.ro', vehicleClass: 'xl', status: 'active', totalRides: 880, joinedAt: '2026-04-10' },
  { id: '9', publicId: 'drv_009', fullName: 'Pieter de Vries', phone: '+31 6 1234 5609', email: 'pieter.devries@example.nl', vehicleClass: 'premium', status: 'pending_kyc', totalRides: 0, joinedAt: '2026-05-12' },
  { id: '10', publicId: 'drv_010', fullName: 'Júlia Santos', phone: '+351 912 345 610', email: 'julia.santos@example.pt', vehicleClass: 'taxi', status: 'active', totalRides: 2410, joinedAt: '2026-02-28' },
  { id: '11', publicId: 'drv_011', fullName: 'Henrik Andersen', phone: '+45 20 12 34 11', email: 'henrik.andersen@example.dk', vehicleClass: 'taxi', status: 'active', totalRides: 720, joinedAt: '2026-04-22' },
  { id: '12', publicId: 'drv_012', fullName: 'Beatrice Conti', phone: '+39 333 4567812', email: 'beatrice.conti@example.it', vehicleClass: 'premium', status: 'active', totalRides: 1190, joinedAt: '2026-03-08' },
];

export type RideStatus =
  | 'REQUESTED'
  | 'DRIVER_ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED_BY_RIDER'
  | 'CANCELLED_BY_DRIVER';

export type MockRide = {
  id: string;
  publicId: string;
  riderName: string;
  driverName: string;
  pickupAddress: string;
  dropoffAddress: string;
  status: RideStatus;
  rideClass: VehicleClass;
  totalFare: string;
  commissionAmount: string;
  driverPayout: string;
  createdAt: string;
};

export const MOCK_RIDES: MockRide[] = [
  { id: '1', publicId: 'ride_10487', riderName: 'Hannah Schmidt', driverName: 'Lukas Müller', pickupAddress: 'Alexanderplatz, Berlin', dropoffAddress: 'Brandenburger Tor, Berlin', status: 'COMPLETED', rideClass: 'taxi', totalFare: '14.20', commissionAmount: '2.84', driverPayout: '11.36', createdAt: '2026-05-19T10:42:00Z' },
  { id: '2', publicId: 'ride_10486', riderName: 'Marco Bianchi', driverName: 'Sofia Rossi', pickupAddress: 'Piazza Duomo, Milano', dropoffAddress: 'Stazione Centrale, Milano', status: 'IN_PROGRESS', rideClass: 'premium', totalFare: '28.50', commissionAmount: '5.70', driverPayout: '22.80', createdAt: '2026-05-19T11:08:00Z' },
  { id: '3', publicId: 'ride_10485', riderName: 'Sophie Dubois', driverName: 'Marie Laurent', pickupAddress: 'Champs-Élysées, Paris', dropoffAddress: 'Le Marais, Paris', status: 'COMPLETED', rideClass: 'xl', totalFare: '32.00', commissionAmount: '6.40', driverPayout: '25.60', createdAt: '2026-05-19T10:14:00Z' },
  { id: '4', publicId: 'ride_10484', riderName: 'Tomás Fernández', driverName: 'Carlos García', pickupAddress: 'Plaza Mayor, Madrid', dropoffAddress: 'Atocha, Madrid', status: 'CANCELLED_BY_RIDER', rideClass: 'taxi', totalFare: '0.00', commissionAmount: '0.00', driverPayout: '0.00', createdAt: '2026-05-19T09:58:00Z' },
  { id: '5', publicId: 'ride_10483', riderName: 'Ola Lewandowska', driverName: 'Mateusz Kowalski', pickupAddress: 'Stare Miasto, Warszawa', dropoffAddress: 'Centrum, Warszawa', status: 'COMPLETED', rideClass: 'taxi', totalFare: '17.30', commissionAmount: '3.46', driverPayout: '13.84', createdAt: '2026-05-19T09:42:00Z' },
  { id: '6', publicId: 'ride_10482', riderName: 'Niklas Weber', driverName: 'Jonas Berger', pickupAddress: 'Marienplatz, München', dropoffAddress: 'Hauptbahnhof, München', status: 'COMPLETED', rideClass: 'taxi', totalFare: '9.80', commissionAmount: '1.96', driverPayout: '7.84', createdAt: '2026-05-18T09:30:00Z' },
  { id: '7', publicId: 'ride_10481', riderName: 'Ana Costa', driverName: 'Júlia Santos', pickupAddress: 'Baixa, Lisboa', dropoffAddress: 'Belém, Lisboa', status: 'COMPLETED', rideClass: 'taxi', totalFare: '12.40', commissionAmount: '2.48', driverPayout: '9.92', createdAt: '2026-05-18T09:18:00Z' },
  { id: '8', publicId: 'ride_10480', riderName: 'Radu Ionescu', driverName: 'Elena Popescu', pickupAddress: 'Centrul Vechi, București', dropoffAddress: 'Gara de Nord, București', status: 'COMPLETED', rideClass: 'xl', totalFare: '20.20', commissionAmount: '4.04', driverPayout: '16.16', createdAt: '2026-05-18T09:05:00Z' },
  { id: '9', publicId: 'ride_10479', riderName: 'Giulia Romano', driverName: 'Beatrice Conti', pickupAddress: 'Trastevere, Roma', dropoffAddress: 'Termini, Roma', status: 'IN_PROGRESS', rideClass: 'premium', totalFare: '18.90', commissionAmount: '3.78', driverPayout: '15.12', createdAt: '2026-05-19T11:12:00Z' },
  { id: '10', publicId: 'ride_10478', riderName: 'Linus Kjeldsen', driverName: 'Henrik Andersen', pickupAddress: 'Nørrebro, København', dropoffAddress: 'Indre By, København', status: 'COMPLETED', rideClass: 'taxi', totalFare: '17.50', commissionAmount: '3.50', driverPayout: '14.00', createdAt: '2026-05-18T08:42:00Z' },
  { id: '11', publicId: 'ride_10477', riderName: 'Eva Janssen', driverName: 'Pieter de Vries', pickupAddress: 'Centrum, Amsterdam', dropoffAddress: 'Jordaan, Amsterdam', status: 'CANCELLED_BY_DRIVER', rideClass: 'premium', totalFare: '0.00', commissionAmount: '0.00', driverPayout: '0.00', createdAt: '2026-05-17T08:30:00Z' },
  { id: '12', publicId: 'ride_10476', riderName: 'Felix Wagner', driverName: 'Lukas Müller', pickupAddress: 'Mitte, Berlin', dropoffAddress: 'Friedrichshain, Berlin', status: 'COMPLETED', rideClass: 'taxi', totalFare: '11.10', commissionAmount: '2.22', driverPayout: '8.88', createdAt: '2026-05-17T08:15:00Z' },
  { id: '13', publicId: 'ride_10475', riderName: 'Camille Petit', driverName: 'Marie Laurent', pickupAddress: 'Montmartre, Paris', dropoffAddress: 'La Défense, Paris', status: 'DRIVER_ASSIGNED', rideClass: 'xl', totalFare: '35.30', commissionAmount: '7.06', driverPayout: '28.24', createdAt: '2026-05-19T15:00:00Z' },
  { id: '14', publicId: 'ride_10474', riderName: 'Léa Martin', driverName: 'Carlos García', pickupAddress: 'Gran Vía, Madrid', dropoffAddress: 'Chamartín, Madrid', status: 'COMPLETED', rideClass: 'taxi', totalFare: '15.00', commissionAmount: '3.00', driverPayout: '12.00', createdAt: '2026-05-17T07:52:00Z' },
  { id: '15', publicId: 'ride_10473', riderName: 'Petra Horáková', driverName: 'Anna Nowak', pickupAddress: 'Staré Město, Praha', dropoffAddress: 'Vinohrady, Praha', status: 'REQUESTED', rideClass: 'premium', totalFare: '13.40', commissionAmount: '2.68', driverPayout: '10.72', createdAt: '2026-05-19T11:18:00Z' },
];

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export type MockPayout = {
  id: string;
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

export const MOCK_PAYOUTS: MockPayout[] = [
  { id: 'p1', driverName: 'Lukas Müller', periodStart: '2026-05-05', periodEnd: '2026-05-11', grossAmount: '482.30', deductions: '12.00', netAmount: '470.30', status: 'paid', paidAt: '2026-05-12T06:01:00Z', bankRef: 'SEPA-2026051201' },
  { id: 'p2', driverName: 'Sofia Rossi', periodStart: '2026-05-05', periodEnd: '2026-05-11', grossAmount: '612.80', deductions: '15.00', netAmount: '597.80', status: 'paid', paidAt: '2026-05-12T06:01:00Z', bankRef: 'SEPA-2026051202' },
  { id: 'p3', driverName: 'Marie Laurent', periodStart: '2026-05-12', periodEnd: '2026-05-18', grossAmount: '345.10', deductions: '8.00', netAmount: '337.10', status: 'pending', paidAt: null, bankRef: null },
  { id: 'p4', driverName: 'Carlos García', periodStart: '2026-05-12', periodEnd: '2026-05-18', grossAmount: '410.40', deductions: '10.00', netAmount: '400.40', status: 'pending', paidAt: null, bankRef: null },
  { id: 'p5', driverName: 'Jonas Berger', periodStart: '2026-05-05', periodEnd: '2026-05-11', grossAmount: '290.50', deductions: '7.50', netAmount: '283.00', status: 'failed', paidAt: null, bankRef: null },
  { id: 'p6', driverName: 'Júlia Santos', periodStart: '2026-05-12', periodEnd: '2026-05-18', grossAmount: '538.90', deductions: '13.00', netAmount: '525.90', status: 'processing', paidAt: null, bankRef: null },
  { id: 'p7', driverName: 'Elena Popescu', periodStart: '2026-05-05', periodEnd: '2026-05-11', grossAmount: '215.70', deductions: '6.00', netAmount: '209.70', status: 'paid', paidAt: '2026-05-12T06:01:00Z', bankRef: 'SEPA-2026051207' },
  { id: 'p8', driverName: 'Beatrice Conti', periodStart: '2026-05-12', periodEnd: '2026-05-18', grossAmount: '378.20', deductions: '9.00', netAmount: '369.20', status: 'pending', paidAt: null, bankRef: null },
  { id: 'p9', driverName: 'Henrik Andersen', periodStart: '2026-05-05', periodEnd: '2026-05-11', grossAmount: '162.40', deductions: '5.00', netAmount: '157.40', status: 'paid', paidAt: '2026-05-12T06:01:00Z', bankRef: 'SEPA-2026051209' },
  { id: 'p10', driverName: 'Mateusz Kowalski', periodStart: '2026-05-05', periodEnd: '2026-05-11', grossAmount: '92.30', deductions: '4.00', netAmount: '88.30', status: 'failed', paidAt: null, bankRef: null },
];

export type RiderStatus = 'active' | 'suspended';

export type MockRider = {
  id: string;
  publicId: string;
  fullName: string;
  phone: string;
  email: string;
  totalRides: number;
  totalSpent: string;
  status: RiderStatus;
  joinedAt: string;
};

export const MOCK_RIDERS: MockRider[] = [
  { id: 'u1', publicId: 'usr_001', fullName: 'Hannah Schmidt', phone: '+49 151 8001001', email: 'hannah.schmidt@example.de', totalRides: 87, totalSpent: '1240.50', status: 'active', joinedAt: '2026-02-14' },
  { id: 'u2', publicId: 'usr_002', fullName: 'Marco Bianchi', phone: '+39 333 8002002', email: 'marco.bianchi@example.it', totalRides: 142, totalSpent: '2310.80', status: 'active', joinedAt: '2026-01-22' },
  { id: 'u3', publicId: 'usr_003', fullName: 'Sophie Dubois', phone: '+33 6 12 80 03 03', email: 'sophie.dubois@example.fr', totalRides: 54, totalSpent: '890.20', status: 'active', joinedAt: '2026-03-05' },
  { id: 'u4', publicId: 'usr_004', fullName: 'Tomás Fernández', phone: '+34 612 800 404', email: 'tomas.fernandez@example.es', totalRides: 23, totalSpent: '312.50', status: 'suspended', joinedAt: '2026-03-19' },
  { id: 'u5', publicId: 'usr_005', fullName: 'Ola Lewandowska', phone: '+48 605 800 505', email: 'ola.lewandowska@example.pl', totalRides: 38, totalSpent: '520.40', status: 'active', joinedAt: '2026-03-30' },
  { id: 'u6', publicId: 'usr_006', fullName: 'Niklas Weber', phone: '+49 151 8006006', email: 'niklas.weber@example.de', totalRides: 19, totalSpent: '245.00', status: 'active', joinedAt: '2026-04-08' },
  { id: 'u7', publicId: 'usr_007', fullName: 'Ana Costa', phone: '+351 912 800 707', email: 'ana.costa@example.pt', totalRides: 67, totalSpent: '987.30', status: 'active', joinedAt: '2026-02-26' },
  { id: 'u8', publicId: 'usr_008', fullName: 'Radu Ionescu', phone: '+40 712 800 808', email: 'radu.ionescu@example.ro', totalRides: 12, totalSpent: '154.20', status: 'active', joinedAt: '2026-04-22' },
  { id: 'u9', publicId: 'usr_009', fullName: 'Giulia Romano', phone: '+39 333 8009009', email: 'giulia.romano@example.it', totalRides: 95, totalSpent: '1480.00', status: 'active', joinedAt: '2026-02-02' },
  { id: 'u10', publicId: 'usr_010', fullName: 'Eva Janssen', phone: '+31 6 1280 1010', email: 'eva.janssen@example.nl', totalRides: 41, totalSpent: '612.70', status: 'suspended', joinedAt: '2026-03-12' },
];

export type CouponType = 'percent' | 'flat';
export type CouponStatus = 'active' | 'expired';

export type MockCoupon = {
  id: string;
  code: string;
  type: CouponType;
  value: string;
  rideClass: VehicleClass | null;
  minFare: string;
  expiresAt: string;
  redemptions: number;
  status: CouponStatus;
};

export const MOCK_COUPONS: MockCoupon[] = [
  { id: 'c1', code: 'WELCOME10', type: 'percent', value: '10', rideClass: null, minFare: '5.00', expiresAt: '2026-12-31', redemptions: 1240, status: 'active' },
  { id: 'c2', code: 'SUMMER20', type: 'percent', value: '20', rideClass: null, minFare: '10.00', expiresAt: '2026-08-31', redemptions: 320, status: 'active' },
  { id: 'c3', code: 'PREMIUM5', type: 'flat', value: '5.00', rideClass: 'premium', minFare: '15.00', expiresAt: '2026-06-30', redemptions: 84, status: 'active' },
  { id: 'c4', code: 'XL15', type: 'percent', value: '15', rideClass: 'xl', minFare: '20.00', expiresAt: '2026-07-15', redemptions: 47, status: 'active' },
  { id: 'c5', code: 'SPRING25', type: 'percent', value: '25', rideClass: null, minFare: '12.00', expiresAt: '2026-04-30', redemptions: 980, status: 'expired' },
  { id: 'c6', code: 'TAXI3', type: 'flat', value: '3.00', rideClass: 'taxi', minFare: '8.00', expiresAt: '2026-09-30', redemptions: 215, status: 'active' },
  { id: 'c7', code: 'EASTER50', type: 'percent', value: '50', rideClass: null, minFare: '20.00', expiresAt: '2026-04-12', redemptions: 412, status: 'expired' },
  { id: 'c8', code: 'NEWUSER', type: 'flat', value: '8.00', rideClass: null, minFare: '6.00', expiresAt: '2026-12-31', redemptions: 2104, status: 'active' },
];

export type MockAudit = {
  id: string;
  ts: string;
  actorEmail: string;
  action: string;
  entity: string;
  entityId: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
};

export const MOCK_AUDIT: MockAudit[] = [
  { id: 'a1', ts: '2026-05-19T14:22:00Z', actorEmail: 'admin@moviai.app', action: 'driver.kyc_approved', entity: 'driver', entityId: 'drv_003', before: { status: 'pending_kyc' }, after: { status: 'active' } },
  { id: 'a2', ts: '2026-05-19T13:50:00Z', actorEmail: 'admin@moviai.app', action: 'config.commission_pct_updated', entity: 'platform_config', entityId: 'commission_pct', before: { value: '18.00' }, after: { value: '20.00' } },
  { id: 'a3', ts: '2026-05-19T12:14:00Z', actorEmail: 'admin@moviai.app', action: 'ride.refunded', entity: 'ride', entityId: 'ride_10484', before: { status: 'COMPLETED' }, after: { status: 'REFUNDED', refundAmount: '14.20' } },
  { id: 'a4', ts: '2026-05-19T11:02:00Z', actorEmail: 'admin@moviai.app', action: 'user.suspended', entity: 'user', entityId: 'usr_004', before: { status: 'active' }, after: { status: 'suspended', reason: 'fraud' } },
  { id: 'a5', ts: '2026-05-19T10:31:00Z', actorEmail: 'admin@moviai.app', action: 'coupon.created', entity: 'coupon', entityId: 'c2', before: {}, after: { code: 'SUMMER20', value: '20' } },
  { id: 'a6', ts: '2026-05-18T16:45:00Z', actorEmail: 'admin@moviai.app', action: 'payout.marked_paid', entity: 'payment', entityId: 'p1', before: { status: 'processing' }, after: { status: 'paid', bankRef: 'SEPA-2026051201' } },
  { id: 'a7', ts: '2026-05-18T15:12:00Z', actorEmail: 'admin@moviai.app', action: 'driver.suspended', entity: 'driver', entityId: 'drv_006', before: { status: 'active' }, after: { status: 'suspended', reason: 'complaints' } },
  { id: 'a8', ts: '2026-05-18T11:08:00Z', actorEmail: 'admin@moviai.app', action: 'coupon.expired', entity: 'coupon', entityId: 'c5', before: { status: 'active' }, after: { status: 'expired' } },
  { id: 'a9', ts: '2026-05-17T18:32:00Z', actorEmail: 'admin@moviai.app', action: 'user.gdpr_deleted', entity: 'user', entityId: 'usr_999', before: { fullName: 'John Doe' }, after: { fullName: 'REDACTED' } },
  { id: 'a10', ts: '2026-05-17T14:00:00Z', actorEmail: 'admin@moviai.app', action: 'config.fare_base_updated', entity: 'platform_config', entityId: 'fare_base', before: { value: '2.50' }, after: { value: '3.00' } },
  { id: 'a11', ts: '2026-05-16T09:14:00Z', actorEmail: 'admin@moviai.app', action: 'driver.document_rejected', entity: 'driver', entityId: 'drv_009', before: { license: 'pending' }, after: { license: 'rejected', note: 'expired' } },
  { id: 'a12', ts: '2026-05-15T20:01:00Z', actorEmail: 'admin@moviai.app', action: 'ride.cancelled', entity: 'ride', entityId: 'ride_10484', before: { status: 'REQUESTED' }, after: { status: 'CANCELLED_BY_RIDER' } },
];

export type LedgerRefType = 'payment_capture' | 'refund' | 'adjustment';
export type LedgerDirection = 'credit' | 'debit';

export type MockLedger = {
  id: string;
  ts: string;
  refType: LedgerRefType;
  direction: LedgerDirection;
  amount: string;
  currency: 'EUR';
  balanceAfter: string;
  rideId: string | null;
  reason: string;
};

export const MOCK_LEDGER: MockLedger[] = [
  { id: 'l1', ts: '2026-05-19T10:42:00Z', refType: 'payment_capture', direction: 'credit', amount: '2.84', currency: 'EUR', balanceAfter: '14820.40', rideId: 'ride_10487', reason: 'Commission on ride' },
  { id: 'l2', ts: '2026-05-19T11:08:00Z', refType: 'payment_capture', direction: 'credit', amount: '5.70', currency: 'EUR', balanceAfter: '14826.10', rideId: 'ride_10486', reason: 'Commission on ride' },
  { id: 'l3', ts: '2026-05-19T12:14:00Z', refType: 'refund', direction: 'debit', amount: '2.84', currency: 'EUR', balanceAfter: '14823.26', rideId: 'ride_10487', reason: 'Refund issued' },
  { id: 'l4', ts: '2026-05-19T10:14:00Z', refType: 'payment_capture', direction: 'credit', amount: '6.40', currency: 'EUR', balanceAfter: '14817.56', rideId: 'ride_10485', reason: 'Commission on ride' },
  { id: 'l5', ts: '2026-05-19T09:42:00Z', refType: 'payment_capture', direction: 'credit', amount: '3.46', currency: 'EUR', balanceAfter: '14811.16', rideId: 'ride_10483', reason: 'Commission on ride' },
  { id: 'l6', ts: '2026-05-18T09:30:00Z', refType: 'payment_capture', direction: 'credit', amount: '1.96', currency: 'EUR', balanceAfter: '14807.70', rideId: 'ride_10482', reason: 'Commission on ride' },
  { id: 'l7', ts: '2026-05-18T09:18:00Z', refType: 'payment_capture', direction: 'credit', amount: '2.48', currency: 'EUR', balanceAfter: '14805.74', rideId: 'ride_10481', reason: 'Commission on ride' },
  { id: 'l8', ts: '2026-05-18T09:05:00Z', refType: 'payment_capture', direction: 'credit', amount: '4.04', currency: 'EUR', balanceAfter: '14803.26', rideId: 'ride_10480', reason: 'Commission on ride' },
  { id: 'l9', ts: '2026-05-18T08:42:00Z', refType: 'payment_capture', direction: 'credit', amount: '3.50', currency: 'EUR', balanceAfter: '14799.22', rideId: 'ride_10478', reason: 'Commission on ride' },
  { id: 'l10', ts: '2026-05-18T06:01:00Z', refType: 'adjustment', direction: 'debit', amount: '50.00', currency: 'EUR', balanceAfter: '14795.72', rideId: null, reason: 'Manual adjustment — bank fee write-off' },
  { id: 'l11', ts: '2026-05-17T08:15:00Z', refType: 'payment_capture', direction: 'credit', amount: '2.22', currency: 'EUR', balanceAfter: '14845.72', rideId: 'ride_10476', reason: 'Commission on ride' },
  { id: 'l12', ts: '2026-05-17T07:52:00Z', refType: 'payment_capture', direction: 'credit', amount: '3.00', currency: 'EUR', balanceAfter: '14843.50', rideId: 'ride_10474', reason: 'Commission on ride' },
  { id: 'l13', ts: '2026-05-16T18:30:00Z', refType: 'adjustment', direction: 'credit', amount: '120.00', currency: 'EUR', balanceAfter: '14840.50', rideId: null, reason: 'Driver bonus claw-back' },
  { id: 'l14', ts: '2026-05-15T14:22:00Z', refType: 'refund', direction: 'debit', amount: '6.40', currency: 'EUR', balanceAfter: '14720.50', rideId: 'ride_10485', reason: 'Partial refund — late driver' },
  { id: 'l15', ts: '2026-05-15T10:00:00Z', refType: 'payment_capture', direction: 'credit', amount: '4.10', currency: 'EUR', balanceAfter: '14726.90', rideId: 'ride_10470', reason: 'Commission on ride' },
];

export type NotificationKind = 'kyc' | 'ride' | 'payout' | 'complaint' | 'coupon';

export type MockNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  ts: string;
  href: string;
  unread: boolean;
};

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  { id: 'n1', kind: 'kyc', title: 'New driver KYC pending', body: 'Mateusz Kowalski submitted documents', ts: '2026-05-20T09:42:00Z', href: '/admin/drivers/drv_003', unread: true },
  { id: 'n2', kind: 'complaint', title: 'Rider complaint filed', body: 'Anna Nowak — rude behaviour reported', ts: '2026-05-20T08:18:00Z', href: '/admin/drivers/drv_006', unread: true },
  { id: 'n3', kind: 'payout', title: 'Payout failed', body: 'IBAN rejected for Sofia Rossi · €482.30', ts: '2026-05-20T06:30:00Z', href: '/admin/payouts', unread: true },
  { id: 'n4', kind: 'ride', title: 'Ride cancelled by driver', body: 'ride_10487 — driver no-show', ts: '2026-05-19T22:14:00Z', href: '/admin/rides', unread: false },
  { id: 'n5', kind: 'coupon', title: 'Coupon usage spike', body: 'WELCOME20 redeemed 142 times today', ts: '2026-05-19T18:00:00Z', href: '/admin/coupons', unread: false },
];
