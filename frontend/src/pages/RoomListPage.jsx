import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { createRoom, getRooms } from '../services/bookingService.js';

const blankRoom = { room_name: '', capacity: '', location: '', description: '', status: 'available' };

function RoomListPage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isStaff = user?.role === 'staff';
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(blankRoom);
  const [notice, setNotice] = useState('');
  const [loadState, setLoadState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, reload] = useManualReload();

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
  }, [reloadKey]);

  async function handleCreateRoom(event) {
    event.preventDefault();
    try {
      const created = await createRoom({ ...form, capacity: Number(form.capacity) });
      setRooms((current) => [...current, created].sort((a, b) => a.room_name.localeCompare(b.room_name)));
      setForm(blankRoom);
      setNotice(`เพิ่มห้อง ${created.room_name} แล้ว`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'เพิ่มห้องไม่สำเร็จ');
    }
  }

  const visibleRooms = rooms.filter((room) => {
    const matchesStatus = filter === 'all' || room.status === filter;
    const keyword = search.toLowerCase();
    const matchesSearch = !keyword || [room.room_name, room.room_id, room.location, room.description]
      .some((value) => String(value || '').toLowerCase().includes(keyword));
    return matchesStatus && matchesSearch;
  });

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">ROOM DIRECTORY</p>
          <h1>รายการห้อง</h1>
          <p>ค้นหาห้องอ่านหนังสือและห้องประชุมในห้องสมุด</p>
        </div>
        {localStorage.getItem('token') && (
          <Link className="button primary inline" to="/bookings/new">จองห้อง</Link>
        )}
      </div>
      {notice && <p className="notice" role="status">{notice}</p>}
      {loadState === 'loading' && <LoadingState message="กำลังโหลดรายการห้อง..." />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}

      {isStaff && (
        <details className="panel room-create-panel">
          <summary>เพิ่มห้องใหม่</summary>
          <form className="room-form" onSubmit={handleCreateRoom}>
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
            <button className="button primary" type="submit">เพิ่มห้อง</button>
          </form>
        </details>
      )}

      {loadState === 'success' && (
        <section className="panel">
          <div className="room-filters">
            <label className="field" htmlFor="room-search">ค้นหาห้อง
              <input id="room-search" type="search" placeholder="ชื่อห้อง สถานที่ หรือรายละเอียด" value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
            <label className="field" htmlFor="room-status">สถานะห้อง
              <select id="room-status" value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">ทุกสถานะ</option>
                <option value="available">พร้อมใช้งาน</option>
                <option value="unavailable">ปิดใช้งาน</option>
              </select>
            </label>
          </div>
          {visibleRooms.length === 0 ? (
            <p className="subtle-empty">ไม่พบห้องที่ตรงกับการค้นหา</p>
          ) : (
            <div className="room-grid">
              {visibleRooms.map((room) => (
                <article className="room-card" key={room.room_id}>
                  <div className="room-card-heading">
                    <span className={`badge ${room.status}`}>{room.status === 'available' ? 'พร้อมใช้งาน' : 'ปิดใช้งาน'}</span>
                    <span className="room-id">{room.room_id}</span>
                  </div>
                  <h2><Link to={`/rooms/${encodeURIComponent(room.room_id)}`}>{room.room_name}</Link></h2>
                  <p>{room.location}</p>
                  <p>รองรับ {room.capacity} คน</p>
                  <p>{room.description}</p>
                  <div className="room-actions">
                    <Link className="button secondary inline" to={`/rooms/${encodeURIComponent(room.room_id)}`}>ดูรายละเอียด</Link>
                    {room.status === 'available' && localStorage.getItem('token') && (
                      <Link className="button primary inline" to={`/bookings/new?room_id=${encodeURIComponent(room.room_id)}`}>จองห้องนี้</Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </section>
  );
}

export default RoomListPage;
