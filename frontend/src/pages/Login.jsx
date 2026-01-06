// src/pages/Login.jsx
import authService from '@/features/auth/api/authService';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { isLoggedIn, user, login: loginStore } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    // const loginStore = useAuthStore((state) => state.login);

    // --- 樣式變數 (方案 B) ---
    const inputStyles = `
        w-full p-4 rounded-2xl bg-[var(--bg-page)] border-2 border-transparent 
        text-[var(--text-primary)] placeholder:text-slate-400 outline-none transition-all shadow-sm
        focus:bg-[var(--bg-card)] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10
    `;

    const labelStyles = "block text-sm font-bold ml-1 text-[var(--text-primary)]";

    useEffect(() => {
        if (isLoggedIn) {
            const target = user?.role === 'admin' ? '/admin' : '/dashboard';
            navigate(target, { replace: true });
        }
    }, [isLoggedIn, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return alert('請輸入 Email 帳號與密碼');
        setLoading(true);
        try {
            const data = await authService.login(email, password);
            // 存入 Store (包含 Token)
            loginStore(data.user, data.token);
            // 權限跳轉
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            // 處理後端回傳的錯誤細節
            const errorMsg = err.response?.data?.detail || err.message || '登入失敗';
            alert(errorMsg === 'ACCOUNT_INACTIVE' ? '帳號尚未驗證，請檢查信箱' : '帳號或密碼錯誤');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 md:p-10 app-card rounded-[2.5rem] shadow-2xl border app-border">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-black tracking-tight mb-3 text-blue-600 dark:text-blue-400">歡迎回來</h2>
                <p className="text-sm font-medium text-[var(--text-secondary)] opacity-80">請輸入您的帳號密碼以繼續</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className={labelStyles}>帳號</label>
                    <input
                        className={inputStyles}
                        placeholder="請輸入 Email帳號"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className={labelStyles}>密碼</label>
                    <input
                        type="password"
                        className={inputStyles}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '驗證中...' : '立即登入'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                    還沒有帳號嗎？
                    <button onClick={() => navigate('/register')} className="ml-2 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        免費註冊
                    </button>
                </p>
            </div>
        </div>
    );
}