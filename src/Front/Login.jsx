import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // เพิ่มสถานะ Loading
  const [rememberMe, setRememberMe] = useState(false); // เพิ่มสถานะ Remember Me
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true); // แสดงสถานะกำลังโหลด
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });

      if (response.data.success) {
        onLogin(response.data.token);

        // บันทึก Token หากเลือก Remember Me
        if (rememberMe) {
          localStorage.setItem('authToken', response.data.token);
        }

        setError('');
        navigate('/orders'); // เปลี่ยนเส้นทาง
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false); // ปิดสถานะกำลังโหลด
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #f8ede3, #dfd3c3)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#7f5539' }}>เข้าสู่ระบบ</h2>
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '5px', color: '#7f5539' }}
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
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              placeholder="กรอกอีเมลของคุณ"
              required
            />
          </div>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '5px', color: '#7f5539' }}
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
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
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
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            <label htmlFor="rememberMe" style={{ color: '#7f5539' }}>
              จำฉันไว้
            </label>
          </div>
          <button
            type="submit"
            disabled={loading} // ปิดปุ่มระหว่างกำลังโหลด
            style={{
              width: '100%',
              padding: '10px 15px',
              backgroundColor: loading ? '#ccc' : '#7f5539',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
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
