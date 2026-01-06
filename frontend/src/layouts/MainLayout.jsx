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
        // 2. 登出時建議先導向首頁再清除狀態，避免私有頁面噴錯
        setIsMenuOpen(false);
        logout();
        navigate('/', { replace: true });
    };

    const links = isLoggedIn
        ? [{ name: '首頁', path: '/' }, { name: '我的空間', path: '/dashboard' }, { name: '筆記管理', path: '/dashboard/notes' }]
        : [{ name: '首頁', path: '/' }, { name: '關於我', path: '/about' }, { name: '公開筆記', path: '/public-notes' }];

    // --- 樣式變數定義 (整理後更易讀) ---
    const brandColor = "text-blue-600 dark:text-blue-400"; // 統一品牌藍色

    const headerStyles = `
        fixed top-4 left-4 right-4 h-16 z-[100] px-4
        flex items-center justify-between transition-all
        rounded-2xl border app-border shadow-xl
        bg-[var(--bg-card)]/60 backdrop-blur-sm
    `;

    const navLinkStyles = `
        text-sm font-bold px-4 py-2 rounded-xl transition-colors 
        opacity-80 hover:opacity-100 hover:bg-blue-500/10
    `;

    const mobileMenuWrapper = `
        absolute top-[calc(100%+0.75rem)] left-0 right-0 
        bg-[var(--bg-card)]/95 border app-border rounded-2xl shadow-2xl 
        overflow-hidden md:hidden z-[110] transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}
    `;

    const mobileNavLink = `text-base font-bold p-4 rounded-xl hover:bg-blue-500/10 transition-all`;

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300">
            <header className={headerStyles}>

                {/* 左側：Logo + 主題切換 */}
                <div className="flex items-center gap-2 md:gap-4">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain rounded-full transition-transform group-hover:scale-110" />
                        <span className={`text-lg font-black tracking-tighter hidden sm:block ${brandColor}`}>
                            KAI<span className="text-slate-400 font-light">.</span>STUDIO
                        </span>
                    </Link>

                    <div className="pl-2 md:pl-4 border-l app-border h-6 flex items-center">
                        <div className="scale-90 md:scale-100 origin-left">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* 右側：功能按鈕 (確保這裡會隨 isLoggedIn 即時重繪) */}
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        {/* 這裡的條件判斷能保證在分頁同步後，登入按鈕立刻消失 */}
                        {isLoggedIn ? (
                            <>
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="...">後台管理</Link>
                                )}
                                <nav className="flex items-center">
                                    {links.map((link) => (
                                        <Link key={link.path} to={link.path} className={navLinkStyles}>
                                            {link.name}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="flex items-center gap-3 ml-2 pl-4 border-l app-border">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <button onClick={handleLogout} className="...">登出</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <nav className="flex items-center">
                                    {links.map((link) => (
                                        <Link key={link.path} to={link.path} className={navLinkStyles}>{link.name}</Link>
                                    ))}
                                </nav>
                                <div className="flex items-center gap-2 ml-2 pl-4 border-l app-border">
                                    <Link to="/login" className={navLinkStyles}>登入</Link>
                                    <Link to="/register" className="...">註冊</Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 手機版漢堡按鈕 */}
                    <button
                        className="md:hidden p-2 rounded-xl bg-[var(--bg-page)]/50 border app-border active:scale-90 transition-transform"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className={`w-6 h-6 ${brandColor}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                            }
                        </svg>
                    </button>
                </div>

                {/* 手機版下拉選單 */}
                <div className={mobileMenuWrapper}>
                    <div className="flex flex-col p-3">
                        {isLoggedIn && user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="m-2 p-4 text-center font-bold text-orange-500 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                後台管理
                            </Link>
                        )}
                        {links.map((link) => (
                            <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className={mobileNavLink}>
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-[1px] app-border my-2 mx-4"></div>
                        {isLoggedIn ? (
                            <div className="p-2">
                                <div className="flex items-center gap-3 p-4 mb-2 bg-[var(--bg-page)]/40 rounded-2xl">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-black text-xs truncate">{user?.email}</span>
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