import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import {
  approveBooking,
  cancelBooking,
  getBookingById,
  rejectBooking,
} from '../services/bookingService.js';

const statusLabels = {
  pending: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธ',
  cancelled: 'ยกเลิกแล้ว',
};

function BookingDetailPage() {
  const { bookingId } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [loadState, setLoadState] = useState('loading');
  const [booking, setBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [reloadKey, reload] = useManualReload();

  useEffect(() => {
    let ignore = false;
    getBookingById(bookingId)
      .then((result) => {
        if (ignore) return;
        setBooking(result);
        setLoadState('success');
      })
      .catch((error) => {
        if (ignore) return;
        setErrorMessage(error instanceof Error ? error.message : 'โหลดรายละเอียดการจองไม่สำเร็จ');
        setLoadState('error');
      });
    return () => {
      ignore = true;
    };
  }, [bookingId, reloadKey]);

  async function changeStatus(action) {
    try {
      const updated = action === 'approve'
        ? await approveBooking(bookingId)
        : action === 'reject'
          ? await rejectBooking(bookingId)
          : await cancelBooking(bookingId);
      setBooking(updated || { ...booking, status: 'cancelled' });
      setNotice('อัปเดตสถานะการจองแล้ว');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'อัปเดตสถานะไม่สำเร็จ');
    }
  }

  return (
    <section data-testid="page-booking-detail">
      {loadState === 'loading' && <LoadingState message="กำลังโหลดรายละเอียดการจอง..." />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {loadState === 'success' && !booking && (
        <section className="state-card">
          <h1>ไม่พบการจอง</h1>
          <p>ไม่พบข้อมูล Booking ID {bookingId}</p>
          <Link to="/bookings/history">กลับไปประวัติการจอง</Link>
        </section>
      )}
      {booking && (
        <>
          <div className="page-heading">
            <div>
              <p className="eyebrow dark">BOOKING DETAILS</p>
              <h1>รายละเอียดการจอง</h1>
              <p>Booking ID: <code>{booking.booking_id}</code></p>
            </div>
          </div>
          {notice && <p className="notice" role="status">{notice}</p>}
          <article className="panel detail-card">
            <h2>{booking.room_name || booking.room_id}</h2>
            <span className={`badge ${booking.status}`}>{statusLabels[booking.status] || booking.status}</span>
            <dl>
              <div><dt>Booking ID</dt><dd>{booking.booking_id}</dd></div>
              <div><dt>User</dt><dd>{booking.user_name || `User ${booking.user_id}`}</dd></div>
              <div><dt>ห้อง</dt><dd>{booking.room_name || booking.room_id}</dd></div>
              <div><dt>วันที่จอง</dt><dd>{booking.booking_date}</dd></div>
              <div><dt>เวลา</dt><dd>{booking.start_time}–{booking.end_time}</dd></div>
              <div><dt>วัตถุประสงค์</dt><dd>{booking.purpose}</dd></div>
              <div><dt>สถานะ</dt><dd>{statusLabels[booking.status] || booking.status}</dd></div>
            </dl>
            <div className="heading-actions">
              {user?.role === 'staff' && booking.status === 'pending' && (
                <>
                  <button className="button primary" type="button" onClick={() => changeStatus('approve')}>อนุมัติ</button>
                  <button className="button danger" type="button" onClick={() => changeStatus('reject')}>ปฏิเสธ</button>
                </>
              )}
              {user?.role === 'student' && booking.status !== 'cancelled' && (
                <button className="button danger" type="button" onClick={() => changeStatus('cancel')}>ยกเลิกการจอง</button>
              )}
              <Link className="button secondary inline" to={user?.role === 'staff' ? '/staff/bookings' : '/bookings/history'}>
                กลับไปยังรายการจอง
              </Link>
            </div>
          </article>
        </>
      )}
    </section>
  );
}

export default BookingDetailPage;
