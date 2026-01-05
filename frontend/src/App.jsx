// src/App.jsx 修正版
import useAuthStore from '@/features/auth/store/useAuthStore';
import AdminLayout from '@/layouts/AdminLayout';
import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  const { isLoggedIn, user } = useAuthStore();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* 1. 登入路由守衛 */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* 2. 新增：註冊頁面（目前先放個簡單的 div，之後補頁面） */}
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <div className="p-20 text-center">註冊頁面建設中</div>}
        />
        {/* 3. 新增：個人空間 (需要登入) */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <div className="p-10"><h1>我的筆記空間</h1></div> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* --- 後台區域 --- */}
      <Route
        path="/admin"
        element={isLoggedIn && user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/" replace />}
      >
        <Route index element={<div className="p-4 bg-white rounded shadow text-black">這是後台數據看板</div>} />
        <Route path="users" element={<div className="p-4 bg-white rounded shadow text-black">用戶管理清單</div>} />
      </Route>
    </Routes>
  );
}

export default App;