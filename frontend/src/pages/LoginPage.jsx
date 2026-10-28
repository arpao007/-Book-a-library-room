import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

async function handleSubmit(event) {
  event.preventDefault();
  setMessage('');

  console.log('email =', email);
  console.log('password =', password);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    console.log('response status =', response.status);
    console.log('response data =', data);

    if (!response.ok) {
      throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    console.log('saved token =', localStorage.getItem('token'));

    navigate('/');
  } catch (error) {
    console.error(error);

    setMessage(
      error instanceof Error
        ? error.message
        : 'เข้าสู่ระบบไม่สำเร็จ'
    );
  }
}

  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        padding: '32px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#fffdf8',
          border: '1px solid #e6d5c3',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            color: '#6b4423',
            marginBottom: '32px',
            fontSize: '2.2rem',
          }}
        >
          เข้าสู่ระบบ
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #d8c3aa',
              backgroundColor: '#fffaf4',
              fontSize: '16px',
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #d8c3aa',
              backgroundColor: '#fffaf4',
              fontSize: '16px',
            }}
          />

          <button
            type="submit"
            style={{
              marginTop: '8px',
              padding: '14px',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: '#8b5e34',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: '20px',
              color: '#c62828',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

export default LoginPage;