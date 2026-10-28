import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../services/bookingService.js';

function LoginPage() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    try {
      const session = isRegistering
        ? await register({ name, email, password })
        : await login({ email, password });
      localStorage.setItem('token', session.token);
      localStorage.setItem('user', JSON.stringify(session.user));
      navigate('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'ดำเนินการไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="panel auth-panel">
        <p className="eyebrow dark">LIBRARY ROOM BOOKING</p>
        <h1>{isRegistering ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h1>
        <p>{isRegistering ? 'สมัครบัญชีนักศึกษาเพื่อจองห้องและติดตามสถานะ' : 'เข้าสู่ระบบเพื่อจองห้องหรือจัดการคำขอจอง'}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <label className="field" htmlFor="name">
              ชื่อผู้ใช้
              <input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} minLength="2" required />
            </label>
          )}
          <label className="field" htmlFor="email">
            อีเมล
            <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="field" htmlFor="password">
            รหัสผ่าน
            <input id="password" type="password" autoComplete={isRegistering ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={isRegistering ? 8 : undefined} required />
            {isRegistering && <small>รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร</small>}
          </label>
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? 'กำลังดำเนินการ...' : isRegistering ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        {message && <p className="error-message" role="alert">{message}</p>}
        <p className="auth-toggle">
          {isRegistering ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
          <button type="button" className="text-button" onClick={() => {
            setIsRegistering((current) => !current);
            setMessage('');
          }}>
            {isRegistering ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        </p>
        <Link to="/rooms">ดูรายการห้องโดยไม่เข้าสู่ระบบ</Link>
      </div>
    </section>
  );
}

export default LoginPage;
