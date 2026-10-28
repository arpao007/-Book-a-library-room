import { useState } from 'react';

function BookingForm({ rooms, defaultRoomId = '', onCreateBooking }) {
  const [form, setForm] = useState({
    room_id: defaultRoomId,
    booking_date: '',
    start_time: '',
    end_time: '',
    purpose: '',
  });
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.room_id || !form.booking_date || !form.start_time || !form.end_time || form.purpose.trim().length < 5) {
      setFeedback('กรุณากรอกข้อมูลให้ครบ และระบุวัตถุประสงค์อย่างน้อย 5 ตัวอักษร');
      return;
    }

    setSubmitting(true);
    setFeedback('');
    try {
      await onCreateBooking({ ...form, purpose: form.purpose.trim() });
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'ส่งคำขอจองไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  return (
    <form className="booking-form" data-testid="booking-form" onSubmit={handleSubmit}>
      <label className="field" htmlFor="room_id">
        ห้อง
        <select id="room_id" name="room_id" value={form.room_id} onChange={handleChange} required>
          <option value="">เลือกห้อง</option>
          {rooms.filter((room) => room.status === 'available').map((room) => (
            <option value={room.room_id} key={room.room_id}>
              {room.room_name} · {room.location} · รองรับ {room.capacity} คน
            </option>
          ))}
        </select>
      </label>

      <label className="field" htmlFor="booking_date">
        วันที่จอง
        <input
          id="booking_date"
          name="booking_date"
          type="date"
          min={minDate}
          value={form.booking_date}
          onChange={handleChange}
          required
        />
      </label>

      <div className="time-fields">
        <label className="field" htmlFor="start_time">
          เวลาเริ่ม
          <input id="start_time" name="start_time" type="time" value={form.start_time} onChange={handleChange} required />
        </label>
        <label className="field" htmlFor="end_time">
          เวลาสิ้นสุด
          <input id="end_time" name="end_time" type="time" value={form.end_time} onChange={handleChange} required />
        </label>
      </div>

      <label className="field" htmlFor="purpose">
        วัตถุประสงค์
        <textarea
          id="purpose"
          name="purpose"
          rows="4"
          minLength="5"
          maxLength="500"
          value={form.purpose}
          onChange={handleChange}
          placeholder="เช่น ประชุมกลุ่มทำโครงงาน หรืออ่านหนังสือเตรียมสอบ"
          required
        />
      </label>

      <p className="subtle-text">คำขอจองใหม่จะมีสถานะ “รออนุมัติ” และระบบไม่อนุญาตให้จองเวลาซ้ำ</p>
      <button className="button primary" type="submit" disabled={submitting}>
        {submitting ? 'กำลังส่งคำขอ...' : 'ส่งคำขอจอง'}
      </button>
      {feedback && <p className="status error-message" role="alert">{feedback}</p>}
    </form>
  );
}

export default BookingForm;
