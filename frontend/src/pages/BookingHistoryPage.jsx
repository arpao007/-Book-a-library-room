import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookingList from '../components/BookingList.jsx';
import ErrorState from '../components/ErrorState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { cancelBooking, getBookings } from '../services/bookingService.js';

function BookingHistoryPage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadState, setLoadState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, reload] = useManualReload();
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let ignore = false;
    getBookings()
      .then((result) => {
        if (ignore) return;
        setBookings(result);
        setLoadState('success');
      })
      .catch((error) => {
        if (ignore) return;
        setErrorMessage(error instanceof Error ? error.message : 'โหลดประวัติการจองไม่สำเร็จ');
        setLoadState('error');
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  async function handleCancel(bookingId) {
    if (!window.confirm(`ยืนยันยกเลิกการจอง ${bookingId} หรือไม่?`)) return;
    try {
      await cancelBooking(bookingId);
      setBookings((current) => current.map((booking) => (
        booking.booking_id === bookingId ? { ...booking, status: 'cancelled' } : booking
      )));
      setNotice(`ยกเลิกการจอง ${bookingId} แล้ว`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'ยกเลิกการจองไม่สำเร็จ');
    }
  }

  if (!localStorage.getItem('token')) {
    return (
      <section className="state-card">
        <h1>เข้าสู่ระบบเพื่อดูประวัติการจอง</h1>
        <Link className="button primary inline" to="/login">เข้าสู่ระบบ</Link>
      </section>
    );
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">BOOKING HISTORY</p>
          <h1>ประวัติการจอง</h1>
          <p>ตรวจสอบสถานะและรายละเอียดการจองห้องของคุณ</p>
        </div>
        <Link className="button primary inline" to="/bookings/new">จองห้อง</Link>
      </div>
      {notice && <p className="notice" role="status">{notice}</p>}
      {loadState === 'loading' && <LoadingState message="กำลังโหลดประวัติการจอง..." />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {loadState === 'success' && (
        <section className="panel">
          <div className="section-heading">
            <h2>{user?.role === 'staff' ? 'รายการจองทั้งหมด' : 'รายการจองของฉัน'} ({bookings.length})</h2>
            <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
          </div>
          <BookingList
            bookings={bookings.filter((booking) => statusFilter === 'all' || booking.status === statusFilter)}
            onCancel={user?.role === 'student' ? handleCancel : undefined}
          />
        </section>
      )}
    </section>
  );
}

export default BookingHistoryPage;
