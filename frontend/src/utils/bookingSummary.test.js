import { describe, expect, test } from 'vitest';
import { summarizeBookings } from './bookingSummary.js';

const sample = [
  { booking_id: 'BK-001', status: 'pending' },
  { booking_id: 'BK-002', status: 'approved' },
  { booking_id: 'BK-003', status: 'rejected' },
  { booking_id: 'BK-004', status: 'cancelled' },
  { booking_id: 'BK-005', status: 'pending' },
];

describe('summarizeBookings', () => {
  test('counts every Library Room Booking status', () => {
    expect(summarizeBookings(sample)).toEqual({
      total: 5,
      pending: 2,
      approved: 1,
      rejected: 1,
      cancelled: 1,
    });
  });

  test('returns zero counts for an empty history', () => {
    expect(summarizeBookings([])).toEqual({
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
    });
  });
});
