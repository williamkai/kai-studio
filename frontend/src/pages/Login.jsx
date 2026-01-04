// src/pages/Login.jsx
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
            // 存入 Zustand + LocalStorage
            loginStore(data.user, data.token);

            // 跳轉交給 App.jsx 的路由判斷或直接 navigate
            navigate(data.user.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 app-card rounded-2xl shadow-xl border app-border">
            <h2 className="text-3xl font-bold mb-8 text-center">歡迎回來</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 opacity-70 text-black dark:text-white">帳號</label>
                    <input
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border app-border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
                        placeholder="admin / user"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 opacity-70 text-black dark:text-white">密碼</label>
                    <input
                        type="password"
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border app-border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
                        placeholder="1234"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                >
                    {loading ? '驗證中...' : '確認登入'}
                </button>
            </form>
        </div>
    );
}