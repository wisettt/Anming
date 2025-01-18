import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './Front/Login';
import Menu from './Front/Menu';
import Orders from './Front/Orders';
import MenuDetails from './Front/MenuDetails';
import RobotStatus from './Front/RobotStatus';
import DailyMenu from './Front/DailyMenu';
import Menutoay from './Front/Menutoay';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // สถานะการล็อกอิน
  const [token, setToken] = useState(null); // เก็บ JWT Token

  // ตรวจสอบ Token เมื่อเริ่มต้น
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  // ฟังก์ชันจัดการล็อกอิน
  const handleLogin = (receivedToken) => {
    localStorage.setItem('token', receivedToken); // เก็บ Token ใน localStorage
    setToken(receivedToken);
    setIsLoggedIn(true);
  };

  // ฟังก์ชันจัดการล็อกเอาต์
  const handleLogout = () => {
    localStorage.removeItem('token'); // ลบ Token
    setToken(null);
    setIsLoggedIn(false);
  };

  // Sidebar Component
  const Sidebar = () => (
    <div
      className="sidebar"
      style={{
        width: '250px',
        background: '#2c3e50',
        color: '#ecf0f1',
        padding: '20px',
        height: '100vh',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '1.5rem',
          color: '#1abc9c',
        }}
      >
        เมนูหลัก
      </h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li
          style={{
            marginBottom: '15px',
            borderBottom: '1px solid #34495e',
            paddingBottom: '10px',
          }}
        >
          <Link
            to="/orders"
            style={{
              color: '#ecf0f1',
              textDecoration: 'none',
              fontSize: '1.1rem',
            }}
          >
            คำสั่งซื้อ
          </Link>
        </li>
        <li
          style={{
            marginBottom: '15px',
            borderBottom: '1px solid #34495e',
            paddingBottom: '10px',
          }}
        >
          <Link
            to="/menu"
            style={{
              color: '#ecf0f1',
              textDecoration: 'none',
              fontSize: '1.1rem',
            }}
          >
            ข้อมูลเมนู
          </Link>
        </li>
        <li
          style={{
            marginBottom: '15px',
            borderBottom: '1px solid #34495e',
            paddingBottom: '10px',
          }}
        >
          <Link
            to="/robot-status"
            style={{
              color: '#ecf0f1',
              textDecoration: 'none',
              fontSize: '1.1rem',
            }}
          >
            สถานะหุ่นยนต์
          </Link>
        </li>
        <li
          style={{
            marginBottom: '15px',
            borderBottom: '1px solid #34495e',
            paddingBottom: '10px',
          }}
        >
          <Link
            to="/menutoday"
            style={{
              color: '#ecf0f1',
              textDecoration: 'none',
              fontSize: '1.1rem',
            }}
          >
            เมนูวันนี้
          </Link>
        </li>
        <li
          style={{
            marginBottom: '15px',
            borderBottom: '1px solid #34495e',
            paddingBottom: '10px',
          }}
        >
          <Link
            to="/daily-menu"
            style={{
              color: '#ecf0f1',
              textDecoration: 'none',
              fontSize: '1.1rem',
            }}
          >
            ยอดขาย
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            style={{
              background: '#e74c3c',
              color: '#ecf0f1',
              border: 'none',
              padding: '10px',
              width: '100%',
              fontSize: '1rem',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            ออกจากระบบ
          </button>
        </li>
      </ul>
    </div>
  );

  // PrivateRoute Component: ป้องกันหน้าที่ต้องล็อกอิน
  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? (
      <div style={{ display: 'flex' }}>
        <Sidebar /> {/* แสดง Sidebar เมื่อเข้าสู่ระบบ */}
        <div style={{ flex: 1, padding: '20px' }}>{children}</div>
      </div>
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <Router>
      <Routes>
        {/* Route สำหรับ Login */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Route ที่ต้องล็อกอิน */}
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <MenuDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/robot-status"
          element={
            <PrivateRoute>
              <RobotStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/daily-menu"
          element={
            <PrivateRoute>
              <DailyMenu />
            </PrivateRoute>
          }
        />
        <Route
          path="/menutoday"
          element={
            <PrivateRoute>
              <Menutoay />
            </PrivateRoute>
          }
        />

        {/* Redirect ไปหน้า Login หากเส้นทางไม่ตรง */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
