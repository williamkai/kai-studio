// src/pages/VerifyEmail.jsx
import userService from '@/features/users/api/userService';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying | success | error
    const navigate = useNavigate();
    const token = searchParams.get('token');

    // 關鍵：使用 useRef 防止 React StrictMode 觸發兩次 API 請求
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;

        const handleVerify = async () => {
            if (!token) {
                setStatus('error');
                return;
            }

            initialized.current = true;

            try {
                // 呼叫後端驗證 API
                await userService.verifyEmail(token);
                setStatus('success');

                // 成功後 4 秒自動導向登入頁面
                setTimeout(() => {
                    navigate('/login', {
                        state: { message: '驗證成功！現在您可以登入了。' },
                        replace: true
                    });
                }, 4000);
            } catch (error) {
                console.error('驗證失敗:', error);
                setStatus('error');
            }
        };

        handleVerify();
    }, [token, navigate]);

    return (
        <div className="max-w-md mx-auto mt-20 p-8 md:p-12 app-card rounded-[2.5rem] shadow-2xl border app-border text-center">
            {status === 'verifying' && (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-black text-[var(--text-primary)]">帳號驗證中</h2>
                    <p className="text-sm text-[var(--text-secondary)] opacity-80">正在為您開啟筆記空間，請稍候...</p>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-4xl shadow-lg shadow-green-500/20">
                            ✓
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-green-500">驗證成功！</h2>
                    <p className="text-sm text-[var(--text-secondary)] font-medium px-4">
                        您的帳號已成功激活。系統將在幾秒後為您轉跳至登入頁面。
                    </p>
                    <div className="pt-4">
                        <Link
                            to="/login"
                            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25"
                        >
                            立即登入
                        </Link>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-4xl">
                            !
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-red-500">驗證失敗</h2>
                    <p className="text-sm text-[var(--text-secondary)] px-4">
                        該連結可能已失效或已被使用過。請嘗試重新註冊或聯繫技術支援。
                    </p>
                    <div className="pt-4 space-y-3">
                        <Link
                            to="/register"
                            className="block w-full py-3 bg-[var(--bg-page)] border app-border text-[var(--text-primary)] rounded-xl font-bold hover:bg-[var(--bg-card)] transition-all"
                        >
                            重新註冊
                        </Link>
                        <Link to="/" className="block text-sm font-bold text-blue-600 dark:text-blue-400">
                            回到首頁
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}