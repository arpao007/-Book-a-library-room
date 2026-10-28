import { Link } from 'react-router-dom';

const statusLabels = {
  pending: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธ',
  cancelled: 'ยกเลิกแล้ว',
};

function BookingCard({ booking, onCancel }) {
  return (
    <article className="booking-card">
      <div className="booking-card-main">
        <p className="booking-id">Booking ID: {booking.booking_id}</p>
        <h3>
          <Link to={`/bookings/${encodeURIComponent(booking.booking_id)}`}>
            {booking.room_name || booking.room_id}
          </Link>
        </h3>
        <p>
          {booking.booking_date} · {booking.start_time}–{booking.end_time}
        </p>
        <p>{booking.purpose}</p>
        {booking.user_name && <p>ผู้จอง: {booking.user_name}</p>}
        <span className={`badge ${booking.status}`}>
          {statusLabels[booking.status] || booking.status}
        </span>
      </div>
      {onCancel && booking.status !== 'cancelled' && (
        <button
          className="button danger"
          type="button"
          onClick={() => onCancel(booking.booking_id)}
          aria-label={`ยกเลิกการจอง ${booking.booking_id}`}
        >
          ยกเลิกการจอง
        </button>
      )}
    </article>
  );
}

export default BookingCard;
