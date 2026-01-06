import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'; // 引入前台用的組件
import useAuthStore from '@/features/auth/store/useAuthStore';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- 樣式變數 (維持方案 B，讓代碼乾淨) ---
    const brandColor = "text-blue-600 dark:text-blue-400";

    const sidebarStyles = `
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        bg-zinc-900 text-white transition-transform duration-300 ease-in-out 
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    const navItemStyles = `
        flex items-center gap-3 p-3 rounded-xl transition-all
        hover:bg-zinc-800 text-zinc-400 hover:text-white
    `;

    return (
        <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300">

            {/* 手機版遮罩 */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* 側邊欄 Sidebar */}
            <aside className={sidebarStyles}>
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
                        <span className="text-xl font-black tracking-tighter">ADMIN</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-zinc-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <p className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">主要功能</p>
                    <Link to="/admin" className={navItemStyles} onClick={() => setIsSidebarOpen(false)}>
                        <span className="text-lg">📊</span> 數據總覽
                    </Link>
                    <Link to="/admin/users" className={navItemStyles} onClick={() => setIsSidebarOpen(false)}>
                        <span className="text-lg">👥</span> 用戶管理
                    </Link>

                    <div className="pt-4 mt-6 border-t border-zinc-800">
                        <Link to="/" className={`${navItemStyles} text-blue-400 hover:text-blue-300`}>
                            <span className="text-lg">🏠</span> 回到前台
                        </Link>
                    </div>
                </nav>

                {/* 底部管理員資訊 */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-950/30">
                    <div className="flex items-center gap-3 p-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-400 font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">系統管理員</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all border border-red-400/20 hover:border-red-400/40">
                        安全登出
                    </button>
                </div>
            </aside>

            {/* 主內容區 */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* 管理端 Header */}
                <header className="h-16 bg-[var(--bg-card)] border-b app-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 md:hidden">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="font-bold text-lg tracking-tight">控制台 / <span className="text-[var(--text-secondary)] font-normal text-sm">數據總覽</span></h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* 主題切換按鈕放在這！ */}
                        <div className="pr-2 md:pr-4 border-r app-border h-6 flex items-center">
                            <ThemeToggle />
                        </div>
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                SYSTEM ONLINE
                            </span>
                        </div>
                    </div>
                </header>

                <section className="p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminLayout;