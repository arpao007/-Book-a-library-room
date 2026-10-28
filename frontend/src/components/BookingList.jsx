import BookingCard from './BookingCard.jsx';

function BookingList({ bookings, onCancel }) {
  if (bookings.length === 0) {
    return <p className="subtle-empty">ไม่พบรายการจองที่ตรงกับตัวกรอง</p>;
  }

  return (
    <div className="booking-list" data-testid="booking-list">
      {bookings.map((booking) => (
        <BookingCard
          booking={booking}
          key={booking.booking_id}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}

export default BookingList;
