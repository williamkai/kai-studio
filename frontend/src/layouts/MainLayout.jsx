import ThemeToggle from '@/components/ThemeToggle';
import useAuthStore from '@/features/auth/store/useAuthStore'; // 確保路徑指向新位置
import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {
    // 從大腦拿取狀態
    const { isLoggedIn, user, logout } = useAuthStore();

    // 初始化主題
    useEffect(() => {
        const savedTheme = localStorage.getItem('app-theme') || 'light';
        changeTheme(savedTheme);
    }, []);

    const changeTheme = (theme) => {
        const html = document.documentElement;
        html.classList.remove('dark', 'sepia');
        if (theme !== 'light') html.classList.add(theme);
        localStorage.setItem('app-theme', theme);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* 導覽列 */}
            <header className="h-16 app-card border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 transition-colors duration-300">
                <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    Kai-Studio
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {/* 動態顯示區域：根據登入狀態變換 */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Hi, {user?.name}</span>

                            {/* 權限判斷：只有管理員能看到此按鈕 */}
                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="text-sm font-bold text-orange-500 hover:text-orange-600 border border-orange-500 px-3 py-1 rounded-lg transition-colors"
                                >
                                    後台管理
                                </Link>
                            )}

                            <button
                                onClick={logout}
                                className="text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                            >
                                登出
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                        >
                            登入
                        </Link>
                    )}
                </div>
            </header>

            {/* 主要內容區：使用 Outlet 渲染子路由頁面 */}
            <main className="flex-1 container mx-auto p-6 md:p-10">
                <Outlet />
            </main>

            {/* 頁尾 */}
            <footer className="py-10 text-center app-text-muted text-sm border-t app-border">
                © 2026 Kai-Studio | 自學者的全端之旅
            </footer>
        </div>
    );
};

export default MainLayout;
