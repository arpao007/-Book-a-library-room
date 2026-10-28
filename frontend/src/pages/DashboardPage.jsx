import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BookingList from '../components/BookingList.jsx';
import ErrorState from '../components/ErrorState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { cancelBooking, getBookings } from '../services/bookingService.js';
import { summarizeBookings } from '../utils/bookingSummary.js';

function DashboardPage() {
  const signedIn = Boolean(localStorage.getItem('token'));
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [reloadKey, reload] = useManualReload();
  const [bookings, setBookings] = useState([]);
  const [loadState, setLoadState] = useState(signedIn ? 'loading' : 'success');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!signedIn) return undefined;
    let ignore = false;
    setLoadState('loading');
    getBookings()
      .then((result) => {
        if (ignore) return;
        setBookings(result);
        setLoadState('success');
      })
      .catch((error) => {
        if (ignore) return;
        setErrorMessage(error instanceof Error ? error.message : 'โหลดรายการจองไม่สำเร็จ');
        setLoadState('error');
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey, signedIn]);

  const summary = useMemo(() => summarizeBookings(bookings), [bookings]);
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const keyword = searchTerm.trim().toLowerCase();
    const matchesSearch = !keyword || [
      booking.booking_id,
      booking.room_name,
      booking.room_id,
      booking.purpose,
      booking.booking_date,
    ].some((value) => String(value || '').toLowerCase().includes(keyword));
    return matchesStatus && matchesSearch;
  });

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

  return (
    <section data-testid="page-dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">LIBRARY ROOM BOOKING</p>
          <h1>แดชบอร์ด</h1>
          <p>
            {user ? `ยินดีต้อนรับ ${user.name} — ` : ''}
            ค้นหาห้องและจัดการการจองห้องสมุดของคุณ
          </p>
        </div>
        <div className="heading-actions">
          <Link className="button secondary inline" to="/rooms">ดูรายการห้อง</Link>
          {signedIn && <Link className="button primary inline" to="/bookings/new">จองห้อง</Link>}
        </div>
      </div>

      {notice && <p className="notice" role="status">{notice}</p>}

      {!signedIn && (
        <section className="state-card">
          <h2>เริ่มต้นจองห้องอ่านหนังสือหรือห้องประชุม</h2>
          <p>เข้าสู่ระบบเพื่อส่งคำขอจอง ติดตามสถานะ และดูประวัติการจอง</p>
          <Link className="button primary inline" to="/login">เข้าสู่ระบบเพื่อจองห้อง</Link>
        </section>
      )}

      {signedIn && loadState === 'loading' && <LoadingState message="กำลังโหลดการจอง..." />}
      {signedIn && loadState === 'error' && (
        <ErrorState message={errorMessage} onRetry={reload} />
      )}
      {signedIn && loadState === 'success' && (
        <>
          <SummaryPanel summary={summary} />
          <section className="panel" aria-labelledby="booking-list-title">
            <div className="section-heading">
              <h2 id="booking-list-title">รายการจองล่าสุด</h2>
              <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
            </div>
            <div className="search-field">
              <label className="visually-hidden" htmlFor="booking-search">ค้นหารายการจอง</label>
              <input
                id="booking-search"
                type="search"
                placeholder="ค้นหา Booking ID ห้อง วันที่ หรือวัตถุประสงค์"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <BookingList
              bookings={filteredBookings}
              onCancel={user?.role === 'student' ? handleCancel : undefined}
            />
            <Link to="/bookings/history">ดูประวัติการจองทั้งหมด</Link>
          </section>
        </>
      )}
    </section>
  );
}

export default DashboardPage;
