// src/pages/Login.jsx
import config from '@/config'; // 前端 config，裡面放 VITE_TURNSTILE_SITE_KEY
import authService from '@/features/auth/api/authService';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Turnstile } from 'react-turnstile'; // Import Turnstile

export default function Login() {
    const { isLoggedIn, user, login: loginStore } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [turnstileToken, setTurnstileToken] = useState(''); // Turnstile token state
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // --- 樣式變數 ---
    const inputStyles = `
        w-full p-4 rounded-2xl bg-[var(--bg-page)] border-2 border-transparent 
        text-[var(--text-primary)] placeholder:text-slate-400 outline-none transition-all shadow-sm
        focus:bg-[var(--bg-card)] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10
    `;
    const labelStyles = "block text-sm font-bold ml-1 text-[var(--text-primary)]";

    // --- 已登入自動跳轉 ---
    useEffect(() => {
        if (isLoggedIn) {
            const target = user?.role === 'admin' ? '/admin' : '/dashboard';
            navigate(target, { replace: true });
        }
    }, [isLoggedIn, user, navigate]);

    // --- 表單送出 ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 前端驗證：帳號、密碼、Turnstile token
        if (!email || !password || !turnstileToken) {
            return alert('請完整填寫欄位並完成機器人驗證');
        }

        setLoading(true);

        try {
            // 登入 API 呼叫，傳 email、password、turnstileToken
            const data = await authService.login({ email, password, turnstileToken });
            loginStore(data.user, data.token); // 存入 store
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.detail || err.message || '登入失敗';
            alert(errorMsg === 'ACCOUNT_INACTIVE'
                ? '帳號尚未驗證，請檢查信箱'
                : '帳號或密碼錯誤');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 md:p-10 app-card rounded-[2.5rem] shadow-2xl border app-border">
            {/* 標題 */}
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-black tracking-tight mb-3 text-blue-600 dark:text-blue-400">歡迎回來</h2>
                <p className="text-sm font-medium text-[var(--text-secondary)] opacity-80">請輸入您的帳號密碼以繼續</p>
            </div>

            {/* 登入表單 */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                    <label className={labelStyles}>帳號</label>
                    <input
                        type="email"
                        className={inputStyles}
                        placeholder="請輸入 Email帳號"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* 密碼 */}
                <div className="space-y-2">
                    <label className={labelStyles}>密碼</label>
                    <input
                        type="password"
                        className={inputStyles}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Turnstile Widget */}
                <div className="mt-4">
                    <Turnstile
                        sitekey={config.turnstileSiteKey}
                        onVerify={setTurnstileToken}
                        theme="light" // 可改成 dark
                    />
                </div>

                {/* Submit Button */}
                <button
                    disabled={loading || !turnstileToken}
                    className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '驗證中...' : '立即登入'}
                </button>
            </form>

            {/* 切換到註冊 */}
            <div className="mt-8 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                    還沒有帳號嗎？
                    <button
                        onClick={() => navigate('/register')}
                        className="ml-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                        免費註冊
                    </button>
                </p>
            </div>
        </div>
    );
}
