import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import useAuthStore from '../store/useAuthStore'; // 1. 引入大腦

const MainLayout = ({ children }) => {
    // 從大腦拿取狀態
    const { isLoggedIn, user, logout } = useAuthStore();

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
            <header className="h-16 app-card border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 transition-colors duration-300">
                <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    Kai-Studio
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {/* 2. 動態顯示區域 */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Hi, {user?.name}</span>

                            {/* 如果角色是 admin，就顯示進入後台的入口，不需要手打網址 */}
                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="text-sm font-bold text-orange-500 hover:text-orange-600 border border-orange-500 px-3 py-1 rounded-lg"
                                >
                                    後台管理
                                </Link>
                            )}

                            <button
                                onClick={logout}
                                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                            >
                                登出
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
                            登入
                        </Link>
                    )}
                </div>
            </header>

            <main className="flex-1 container mx-auto p-6 md:p-10">
                {children}
            </main>

            <footer className="py-10 text-center app-text-muted text-sm border-t app-border">
                © 2026 Kai-Studio | 自學者的全端之旅
            </footer>
        </div>
    );
};

export default MainLayout;
// import { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import ThemeToggle from '../components/ThemeToggle';

// const MainLayout = ({ children }) => {
//     // 1. 初始化主題：網頁載入時從瀏覽器記憶體讀取舊設定
//     useEffect(() => {
//         const savedTheme = localStorage.getItem('app-theme') || 'light';
//         changeTheme(savedTheme);
//     }, []);

//     // 2. 主題切換邏輯
//     const changeTheme = (theme) => {
//         const html = document.documentElement;
//         html.classList.remove('dark', 'sepia');
//         if (theme !== 'light') html.classList.add(theme);

//         // 儲存設定到瀏覽器記憶體
//         localStorage.setItem('app-theme', theme);
//     };

//     return (
//         <div className="min-h-screen flex flex-col">
//             {/* 修改處：使用 app-card 讓 Header 自動隨主題變色，並移除寫死的 bg-white */}
//             <header className="h-16 app-card border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 transition-colors duration-300">
//                 <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
//                     Kai-Studio
//                 </Link>

//                 <div className="flex items-center gap-4">
//                     {/* 2. 把原本那一長串按鈕，換成這個精簡的組件 */}
//                     <ThemeToggle />

//                     <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold">
//                         登入
//                     </Link>
//                 </div>
//             </header>

//             {/* 內容區 */}
//             <main className="flex-1 container mx-auto p-6 md:p-10">
//                 {children}
//             </main>

//             {/* 頁尾也同步主題色 */}
//             <footer className="py-10 text-center app-text-muted text-sm border-t app-border">
//                 © 2026 Kai-Studio | 自學者的全端之旅
//             </footer>
//         </div>
//     );
// };

// export default MainLayout;