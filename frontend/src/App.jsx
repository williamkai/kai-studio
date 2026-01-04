// src/App.jsx
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

        {/* 修正：如果已登入，訪問 /login 會根據角色踢走，不讓他在這停留 */}
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />
              : <Login />
          }
        />

        {/* 萬用路由：找不到的網址通通回首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* --- 後台區域：嚴格守衛 --- */}
      <Route
        path="/admin"
        element={
          isLoggedIn && user?.role === 'admin'
            ? <AdminLayout />
            : <Navigate to="/" replace />
        }
      >
        <Route index element={<div className="p-4 bg-white rounded shadow text-black">這是後台數據看板</div>} />
        <Route path="users" element={<div className="p-4 bg-white rounded shadow text-black">用戶管理清單</div>} />
      </Route>
    </Routes>
  );
}

export default App;