// src/App.jsx
import useAuthStore from '@/features/auth/store/useAuthStore';
import AdminLayout from '@/layouts/AdminLayout';
import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import VerifyEmail from '@/pages/VerifyEmail';
import { Navigate, Route, Routes } from 'react-router-dom';

// 1. 訪客專區：已登入者跳轉回後台
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
};

// 2. 會員專區：沒登入不准看
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// 3. 管理員專區：不是管理員不准看
const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuthStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* 訪客分流：Login, Register, Verify */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify" element={<PublicRoute><VerifyEmail /></PublicRoute>} />

        {/* 會員保護 */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <div className="p-10 text-center">
              <h1 className="text-3xl font-black">🚀 我的筆記空間</h1>
              <p className="mt-4 text-[var(--text-secondary)]">後端驗證完畢後，這裡將顯示您的筆記列表</p>
            </div>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* 管理員保護 */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<div className="p-6">後台看板</div>} />
        <Route path="users" element={<div className="p-6">用戶管理</div>} />
      </Route>
    </Routes>
  );
}

export default App;