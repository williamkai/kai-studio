import authService from '@/features/auth/api/authService';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const loginStore = useAuthStore((state) => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) return alert('請輸入帳號密碼');
        setLoading(true);
        try {
            const data = await authService.login(username, password);
            loginStore(data.user, data.token);
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            alert(err.message);
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
                {/* 帳號欄位 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold ml-1 text-[var(--text-primary)]">帳號</label>
                    <input
                        className="w-full p-4 rounded-2xl bg-[var(--bg-page)] border-2 border-transparent text-[var(--text-primary)] placeholder:text-slate-400 focus:bg-[var(--bg-card)] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                        placeholder="請輸入使用者名稱"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* 密碼欄位 */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="block text-sm font-bold text-[var(--text-primary)]">密碼</label>
                    </div>
                    <input
                        type="password"
                        className="w-full p-4 rounded-2xl bg-[var(--bg-page)] border-2 border-transparent text-[var(--text-primary)] placeholder:text-slate-400 focus:bg-[var(--bg-card)] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* 登入按鈕 */}
                <button
                    disabled={loading}
                    className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            驗證中...
                        </span>
                    ) : '立即登入'}
                </button>
            </form>

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