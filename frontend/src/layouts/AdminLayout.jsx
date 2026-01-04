// src/layouts/AdminLayout.jsx
import useAuthStore from '@/features/auth/store/useAuthStore';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-950">
            {/* 側邊欄 Sidebar */}
            <aside className="w-64 bg-zinc-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-zinc-800">後台管理</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block p-3 hover:bg-zinc-800 rounded">數據總覽</Link>
                    <Link to="/admin/users" className="block p-3 hover:bg-zinc-800 rounded">用戶管理</Link>
                    <Link to="/" className="block p-3 text-blue-400 hover:bg-zinc-800 rounded mt-10">← 回前台首頁</Link>
                </nav>
                <div className="p-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-2">管理員: {user?.name}</p>
                    <button onClick={handleLogout} className="text-red-400 text-sm">安全登出</button>
                </div>
            </aside>

            {/* 主內容區 */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white dark:bg-zinc-900 border-b px-8 flex items-center justify-between">
                    <h2 className="font-bold">控制台</h2>
                </header>
                <section className="p-8">
                    <Outlet /> {/* 這裡會渲染 Admin 相關的 Pages */}
                </section>
            </main>
        </div>
    );
};

export default AdminLayout;