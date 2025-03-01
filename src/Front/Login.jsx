import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });

      if (response.data.success) {
        onLogin(response.data.token);

        if (rememberMe) {
          localStorage.setItem('authToken', response.data.token);
        }

        setError('');
        navigate('/orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, rgb(221, 169, 232),rgb(218, 247, 251))',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px', // ปรับขนาดฟอร์ม
          padding: '40px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '25px', fontSize: '28px', color: '#7f5539' }}>เข้าสู่ระบบ</h2>
        {error && <p style={{ color: 'red', marginBottom: '15px', fontSize: '18px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '8px', fontSize: '18px', color: '#7f5539' }}
            >
              อีเมล:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '18px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
              placeholder="กรอกอีเมลของคุณ"
              required
            />
          </div>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '8px', fontSize: '18px', color: '#7f5539' }}
            >
              รหัสผ่าน:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '18px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
              placeholder="กรอกรหัสผ่านของคุณ"
              required
            />
          </div>
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
            }}
          > 
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '20px',
              backgroundColor: loading ? '#ccc' : '#7f5539',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
