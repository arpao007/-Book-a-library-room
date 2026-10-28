export function summarizeBookings(bookings) {
  const count = (status) => bookings.filter((booking) => booking.status === status).length;
  return {
    total: bookings.length,
    pending: count('pending'),
    approved: count('approved'),
    rejected: count('rejected'),
    cancelled: count('cancelled'),
  };
}
