import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { createBooking, getRooms } from '../services/bookingService.js';

function NewBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loadState, setLoadState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;
    getRooms()
      .then((result) => {
        if (ignore) return;
        setRooms(result);
        setLoadState('success');
      })
      .catch((error) => {
        if (ignore) return;
        setErrorMessage(error instanceof Error ? error.message : 'โหลดรายการห้องไม่สำเร็จ');
        setLoadState('error');
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreateBooking(booking) {
    const created = await createBooking(booking);
    navigate(`/bookings/${encodeURIComponent(created.booking_id)}`);
  }

  if (!localStorage.getItem('token')) {
    return (
      <section className="state-card">
        <h1>เข้าสู่ระบบก่อนจองห้อง</h1>
        <Link className="button primary inline" to="/login">เข้าสู่ระบบ</Link>
      </section>
    );
  }

  return (
    <section data-testid="page-new-booking">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">NEW BOOKING</p>
          <h1>จองห้อง</h1>
          <p>เลือกห้อง วันที่ และช่วงเวลาที่ต้องการใช้งาน</p>
        </div>
      </div>
      {loadState === 'loading' && <LoadingState message="กำลังโหลดห้องที่ให้บริการ..." />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={() => window.location.reload()} />}
      {loadState === 'success' && rooms.every((room) => room.status !== 'available') && (
        <section className="state-card">
          <h2>ขณะนี้ไม่มีห้องที่พร้อมให้จอง</h2>
          <Link to="/rooms">ดูรายการห้องทั้งหมด</Link>
        </section>
      )}
      {loadState === 'success' && rooms.some((room) => room.status === 'available') && (
        <section className="panel form-panel">
          <BookingForm
            rooms={rooms}
            defaultRoomId={searchParams.get('room_id') || ''}
            onCreateBooking={handleCreateBooking}
          />
        </section>
      )}
    </section>
  );
}

export default NewBookingPage;
