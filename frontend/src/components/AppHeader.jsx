import { Link, NavLink, useNavigate } from 'react-router-dom';

function AppHeader() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isStaff = user?.role === 'staff';

  function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const links = [
    ['/', 'แดชบอร์ด'],
    ['/rooms', 'รายการห้อง'],
    ...(token ? [['/bookings/history', 'ประวัติการจอง']] : []),
    ...(isStaff ? [['/staff/bookings', 'จัดการการจอง']] : []),
    ['/about', 'เกี่ยวกับระบบ'],
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand-link" to="/">
          <span className="eyebrow">LIBRARY ROOM BOOKING</span>
          <span className="brand">ระบบจองห้องสมุด</span>
        </Link>

        <div className="header-controls">
          <nav aria-label="เมนูหลัก">
            {links.map(([to, label]) => (
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                end={to === '/'}
                key={to}
                to={to}
              >
                {label}
              </NavLink>
            ))}

            {token ? (
              <button className="nav-link nav-button" type="button" onClick={signOut}>
                ออกจากระบบ
              </button>
            ) : (
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to="/login"
              >
                เข้าสู่ระบบ
              </NavLink>
            )}
          </nav>

          {token && user && (
            <p className="current-user">
              {user.name} <span>({isStaff ? 'เจ้าหน้าที่' : 'นักศึกษา'})</span>
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
