import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Dashboard'],
  ['/requests/new', 'New Request'],
  ['/about', 'About'],
];

function AppHeader() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">ENGSE203 • Final Project-1-T03</p>
          <p className="brand">ระบบนัดหมายอาจารย์ที่ปรึกษา</p>
        </div>

        <div>
          <nav aria-label="เมนูหลัก">
            {links.map(([to, label]) => (
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                end={to === '/'}
                key={to}
                to={to}
              >
                {label}
              </NavLink>
            ))}

            {!token && (
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                to="/login"
              >
                Login
              </NavLink>
            )}

            {token && (
              <NavLink
                className="nav-link"
                to="/login"
                onClick={(event) => {
                  event.preventDefault();

                  localStorage.removeItem('token');
                  localStorage.removeItem('user');

                  window.location.href = '/#/login';
                }}
              >
                Logout
              </NavLink>
            )}
          </nav>

          {token && user && (
            <div
              style={{
                marginTop: '0.75rem',
                color: '#f5f3ee',
                fontSize: '1.3rem',
                textAlign: 'right',
                fontWeight: '700',
            }}
            >
              เข้าสู่ระบบในฐานะ: <strong>{user.name}</strong>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;