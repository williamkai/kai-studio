import logoImg from '@/assets/logo.png';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const MainLayout = () => {
    const { isLoggedIn, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const links = isLoggedIn
        ? [{ name: '首頁', path: '/' }, { name: '我的空間', path: '/dashboard' }, { name: '筆記管理', path: '/dashboard/notes' }]
        : [{ name: '首頁', path: '/' }, { name: '關於我', path: '/about' }, { name: '公開筆記', path: '/public-notes' }];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300">
            {/* Header - 保持你最喜歡的霧面質感 */}
            <header className="fixed top-4 left-4 right-4 h-16 rounded-2xl border app-border bg-[var(--bg-card)]/60 backdrop-blur-sm z-[100] shadow-xl px-4 flex items-center justify-between transition-all">

                {/* 左側：Logo + 縮小的切換鈕 */}
                <div className="flex items-center gap-2 md:gap-4">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain rounded-full transition-transform group-hover:scale-110" />
                        <span className="text-lg font-black tracking-tighter text-blue-600 dark:text-blue-400 hidden sm:block">
                            KAI<span className="text-slate-400 font-light">.</span>STUDIO
                        </span>
                    </Link>

                    <div className="pl-2 md:pl-4 border-l app-border h-6 flex items-center">
                        <div className="scale-90 md:scale-100 origin-left">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* 右側：功能按鈕 */}
                <div className="flex items-center gap-2">
                    {/* 電腦版導覽 */}
                    <div className="hidden md:flex items-center gap-2">
                        {isLoggedIn && user?.role === 'admin' && (
                            <Link to="/admin" className="text-xs font-bold text-orange-500 hover:bg-orange-500/10 border border-orange-500/50 px-3 py-1.5 rounded-xl transition-all mr-2">後台管理</Link>
                        )}
                        <nav className="flex items-center">
                            {links.map((link) => (
                                <Link key={link.path} to={link.path} className="text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-500/10 transition-colors opacity-80 hover:opacity-100">
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        {isLoggedIn ? (
                            <div className="flex items-center gap-3 ml-2 pl-4 border-l app-border">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                    {user?.name?.charAt(0)}
                                </div>
                                <button onClick={handleLogout} className="text-xs font-bold text-red-400 hover:text-red-500">登出</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-2 pl-4 border-l app-border">
                                <Link to="/login" className="text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-500/10 transition-colors opacity-80 hover:opacity-100">登入</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 ml-2">註冊</Link>
                            </div>
                        )}
                    </div>

                    {/* 手機版漢堡按鈕 */}
                    <button
                        className="md:hidden p-2 rounded-xl bg-[var(--bg-page)]/50 border app-border active:scale-90 transition-transform"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                            }
                        </svg>
                    </button>
                </div>

                {/* 手機版下拉選單 - 回歸純透明感 */}
                <div className={`
                    absolute top-[calc(100%+0.75rem)] left-0 right-0 
                    bg-[var(--bg-card)]/95 border app-border  rounded-2xl shadow-2xl 
                    overflow-hidden md:hidden z-[110]
                    transition-all duration-300 ease-in-out
                    ${isMenuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}
                `}>
                    <div className="flex flex-col p-3">
                        {isLoggedIn && user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="m-2 p-4 text-center font-bold text-orange-500 bg-orange-500/10 rounded-xl border border-orange-500/20">後台管理</Link>
                        )}
                        {links.map((link) => (
                            <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="text-base font-bold p-4 rounded-xl hover:bg-blue-500/10 transition-all">
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-[1px] app-border my-2 mx-4"></div>
                        {isLoggedIn ? (
                            <div className="p-2">
                                <div className="flex items-center gap-3 p-4 mb-2 bg-[var(--bg-page)]/40 rounded-2xl">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{user?.name?.charAt(0)}</div>
                                    <span className="font-black">{user?.name}</span>
                                </div>
                                <button onClick={handleLogout} className="w-full p-4 text-center text-red-500 font-bold bg-red-500/10 rounded-xl">登出帳號</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 p-2">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="p-4 text-center font-bold border app-border rounded-xl">登入</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="p-4 text-center font-bold bg-blue-600 text-white rounded-xl shadow-lg">註冊</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-6 pt-32 pb-10">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;