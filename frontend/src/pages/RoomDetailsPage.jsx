import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { deleteRoom, getRoomById, updateRoom } from '../services/bookingService.js';

function RoomDetailsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isStaff = user?.role === 'staff';
  const [room, setRoom] = useState(null);
  const [form, setForm] = useState(null);
  const [loadState, setLoadState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let ignore = false;
    getRoomById(roomId)
      .then((result) => {
        if (ignore) return;
        setRoom(result);
        if (result) setForm({ ...result });
        setLoadState('success');
      })
      .catch((error) => {
        if (ignore) return;
        setErrorMessage(error instanceof Error ? error.message : 'โหลดรายละเอียดห้องไม่สำเร็จ');
        setLoadState('error');
      });
    return () => {
      ignore = true;
    };
  }, [roomId]);

  async function saveRoom(event) {
    event.preventDefault();
    try {
      const updated = await updateRoom(roomId, { ...form, capacity: Number(form.capacity) });
      setRoom(updated);
      setForm({ ...updated });
      setNotice('บันทึกข้อมูลห้องแล้ว');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'บันทึกข้อมูลห้องไม่สำเร็จ');
    }
  }

  async function removeRoom() {
    if (!window.confirm(`ยืนยันลบห้อง ${room.room_name} หรือไม่?`)) return;
    try {
      await deleteRoom(roomId);
      navigate('/rooms');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'ลบห้องไม่สำเร็จ');
    }
  }

  return (
    <section>
      {loadState === 'loading' && <LoadingState message="กำลังโหลดรายละเอียดห้อง..." />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={() => window.location.reload()} />}
      {loadState === 'success' && !room && (
        <section className="state-card">
          <h1>ไม่พบห้องนี้</h1>
          <Link to="/rooms">กลับไปยังรายการห้อง</Link>
        </section>
      )}
      {room && form && (
        <>
          <div className="page-heading">
            <div>
              <p className="eyebrow dark">ROOM DETAILS · {room.room_id}</p>
              <h1>{room.room_name}</h1>
              <p>{room.location} · รองรับ {room.capacity} คน</p>
            </div>
            {room.status === 'available' && localStorage.getItem('token') && (
              <Link className="button primary inline" to={`/bookings/new?room_id=${encodeURIComponent(room.room_id)}`}>จองห้องนี้</Link>
            )}
          </div>
          {notice && <p className="notice" role="status">{notice}</p>}
          <article className="panel room-detail">
            <span className={`badge ${room.status}`}>{room.status === 'available' ? 'พร้อมใช้งาน' : 'ปิดใช้งาน'}</span>
            <h2>รายละเอียด</h2>
            <p>{room.description}</p>
            <dl>
              <div><dt>Room ID</dt><dd>{room.room_id}</dd></div>
              <div><dt>สถานที่</dt><dd>{room.location}</dd></div>
              <div><dt>ความจุ</dt><dd>{room.capacity} คน</dd></div>
            </dl>
          </article>
          {isStaff && (
            <section className="panel room-edit-panel">
              <h2>จัดการข้อมูลห้อง</h2>
              <form className="room-form" onSubmit={saveRoom}>
                <label className="field">ชื่อห้อง<input value={form.room_name} onChange={(event) => setForm({ ...form, room_name: event.target.value })} required maxLength="100" /></label>
                <label className="field">ความจุ<input type="number" min="1" step="1" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} required /></label>
                <label className="field">สถานที่<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required maxLength="120" /></label>
                <label className="field">รายละเอียด<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></label>
                <label className="field">สถานะ
                  <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                    <option value="available">พร้อมใช้งาน</option>
                    <option value="unavailable">ปิดใช้งาน</option>
                  </select>
                </label>
                <div className="heading-actions">
                  <button className="button primary" type="submit">บันทึกข้อมูลห้อง</button>
                  <button className="button danger" type="button" onClick={removeRoom}>ลบห้อง</button>
                </div>
              </form>
            </section>
          )}
          <p><Link to="/rooms">กลับไปยังรายการห้อง</Link></p>
        </>
      )}
    </section>
  );
}

export default RoomDetailsPage;
