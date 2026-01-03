import { useNavigate } from 'react-router-dom'; // 1. 引入導航功能
import useAuthStore from '../store/useAuthStore'; // 2. 引入大腦

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login); // 取得大腦中的登入功能

    // 3. 建立測試用的登入處理函式
    const handleTestLogin = () => {
        // 模擬從後端取得的資料
        const mockUserData = {
            name: 'Kai (管理員)',
            role: 'admin', // 這裡可以改成 'user' 測試一般人的視角
        };

        login(mockUserData); // 告訴大腦：登入成功了
        alert('模擬登入成功！即將跳回首頁');
        navigate('/'); // 登入成功後自動跳回首頁
    };

    return (
        <div className="flex justify-center items-center py-12 px-4">
            <div className="app-card p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-300">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold mb-2">歡迎回來</h2>
                    <p className="app-text-muted text-sm">測試帳號：隨便輸入即可</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 ml-1">帳號</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl app-card outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="您的用戶名稱"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 ml-1">密碼</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl app-card outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="您的登入密碼"
                        />
                    </div>

                    {/* 4. 在按鈕加上 onClick 事件觸發模擬登入 */}
                    <button
                        onClick={handleTestLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transform active:scale-95 transition-all mt-4"
                    >
                        登入系統 (模擬)
                    </button>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center text-xs app-text-muted cursor-pointer">
                            <input type="checkbox" className="mr-2 rounded" /> 記住我
                        </label>
                        <a href="#" className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                            忘記密碼？
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// export default function Login() {
//     return (
//         <div className="flex justify-center items-center py-12 px-4">
//             {/* 登入卡片：套用 app-card 確保主題切換正常 */}
//             <div className="app-card p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-300">

//                 <div className="text-center mb-10">
//                     <h2 className="text-3xl font-extrabold mb-2">歡迎回來</h2>
//                     <p className="app-text-muted text-sm">請輸入您的帳號密碼以進入 Kai-Studio</p>
//                 </div>

//                 <div className="space-y-6">
//                     {/* 帳號輸入框 */}
//                     <div>
//                         <label className="block text-sm font-semibold mb-2 ml-1">帳號</label>
//                         <input
//                             type="text"
//                             className="w-full px-4 py-3 rounded-xl app-card outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:app-text-muted/50"
//                             placeholder="您的用戶名稱"
//                         />
//                     </div>

//                     {/* 密碼輸入框 */}
//                     <div>
//                         <label className="block text-sm font-semibold mb-2 ml-1">密碼</label>
//                         <input
//                             type="password"
//                             className="w-full px-4 py-3 rounded-xl app-card outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:app-text-muted/50"
//                             placeholder="您的登入密碼"
//                         />
//                     </div>

//                     {/* 登入按鈕：增加微互動效果 */}
//                     <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transform active:scale-95 transition-all mt-4">
//                         登入系統
//                     </button>

//                     <div className="flex items-center justify-between px-1">
//                         <label className="flex items-center text-xs app-text-muted cursor-pointer">
//                             <input type="checkbox" className="mr-2 rounded" /> 記住我
//                         </label>
//                         <a href="#" className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">
//                             忘記密碼？
//                         </a>
//                     </div>
//                 </div>

//                 {/* 底部裝飾 */}
//                 <div className="mt-10 pt-6 border-t app-border text-center">
//                     <p className="app-text-muted text-xs">
//                         還沒有帳號嗎？ <a href="#" className="text-blue-500 font-bold hover:underline">立即註冊</a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }