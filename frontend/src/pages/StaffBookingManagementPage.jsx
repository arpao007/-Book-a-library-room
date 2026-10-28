import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { approveBooking, getBookings, rejectBooking } from '../services/bookingService.js';

const labels = {
  pending: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธ',
  cancelled: 'ยกเลิกแล้ว',
};

function StaffBookingManagementPage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loadState, setLoadState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [reloadKey, reload] = useManualReload();

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
        setErrorMessage(error instanceof Error ? error.message : 'โหลดรายการจองทั้งหมดไม่สำเร็จ');
        setLoadState('error');
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  async function changeStatus(bookingId, action) {
    try {
      const updated = action === 'approve'
        ? await approveBooking(bookingId)
        : await rejectBooking(bookingId);
      setBookings((current) => current.map((booking) => (
        booking.booking_id === bookingId ? updated : booking
      )));
      setNotice(`อัปเดตสถานะการจอง ${bookingId} แล้ว`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'อัปเดตสถานะไม่สำเร็จ');
    }
  }

  if (!localStorage.getItem('token') || user?.role !== 'staff') {
    return (
      <section className="state-card">
        <h1>สำหรับเจ้าหน้าที่เท่านั้น</h1>
        <p>เข้าสู่ระบบด้วยบัญชีเจ้าหน้าที่เพื่อจัดการคำขอจอง</p>
        <Link className="button primary inline" to="/login">เข้าสู่ระบบ</Link>
      </section>
    );
  }

  const visibleBookings = bookings.filter((booking) => filter === 'all' || booking.status === filter);
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">STAFF WORKSPACE</p>
          <h1>จัดการการจอง</h1>
          <p>ตรวจสอบคำขอและอนุมัติหรือปฏิเสธการจองห้อง</p>
        </div>
      </div>
      {notice && <p className="notice" role="status">{notice}</p>}
      {loadState === 'loading' && <LoadingState message="กำลังโหลดรายการจอง..." />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {loadState === 'success' && (
        <section className="panel">
          <div className="section-heading">
            <h2>รายการจองทั้งหมด ({bookings.length})</h2>
            <FilterBar value={filter} onFilterChange={setFilter} />
          </div>
          {visibleBookings.length === 0 ? (
            <p className="subtle-empty">ไม่มีรายการจองที่ตรงกับตัวกรอง</p>
          ) : (
            <div className="table-scroll">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>ผู้ใช้</th>
                    <th>ห้อง</th>
                    <th>วันและเวลา</th>
                    <th>วัตถุประสงค์</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleBookings.map((booking) => (
                    <tr key={booking.booking_id}>
                      <td><Link to={`/bookings/${encodeURIComponent(booking.booking_id)}`}>{booking.booking_id}</Link></td>
                      <td>{booking.user_name || `User ${booking.user_id}`}</td>
                      <td>{booking.room_name || booking.room_id}</td>
                      <td>{booking.booking_date}<br />{booking.start_time}–{booking.end_time}</td>
                      <td>{booking.purpose}</td>
                      <td><span className={`badge ${booking.status}`}>{labels[booking.status] || booking.status}</span></td>
                      <td>
                        {booking.status === 'pending' && (
                          <div className="table-actions">
                            <button className="button primary" type="button" onClick={() => changeStatus(booking.booking_id, 'approve')}>อนุมัติ</button>
                            <button className="button danger" type="button" onClick={() => changeStatus(booking.booking_id, 'reject')}>ปฏิเสธ</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </section>
  );
}

export default StaffBookingManagementPage;
