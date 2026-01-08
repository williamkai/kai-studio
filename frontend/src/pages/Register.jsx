// src/pages/Register.jsx
import userService from '@/features/users/api/userService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Turnstile } from 'react-turnstile'; // Import Turnstile

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [turnstileToken, setTurnstileToken] = useState(''); // New: Turnstile token state
    const navigate = useNavigate();

    // Password validation state
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        lowercase: false,
        uppercase: false,
        digit: false,
        specialChar: false,
    });

    // Function to validate password against rules (mirroring backend)
    const validatePassword = (currentPassword) => {
        setPasswordValidation({
            minLength: currentPassword.length >= 8,
            lowercase: /[a-z]/.test(currentPassword),
            uppercase: /[A-Z]/.test(currentPassword),
            digit: /[0-9]/.test(currentPassword),
            specialChar: /[@$!%*?&#]/.test(currentPassword),
        });
    };

    // Run validation whenever password changes
    useEffect(() => {
        validatePassword(password);
    }, [password]);


    const inputStyles = `w-full p-4 rounded-2xl bg-[var(--bg-page)] border-2 border-transparent text-[var(--text-primary)] outline-none transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10`;
    const labelStyles = "block text-sm font-bold ml-1 text-[var(--text-primary)]";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !turnstileToken) { // Validate turnstileToken
            setStatusMsg({ type: 'error', text: '請完整填寫欄位或完成機器人驗證。' });
            return;
        }

        setIsSubmitting(true);
        setStatusMsg({ type: '', text: '' });

        try {
            await userService.register({ email, password, turnstileToken }); // Pass turnstileToken to backend
            setIsRegistered(true);
        } catch (error) {
            const errorDetail = error.response?.data?.detail || '註冊失敗，請稍後再試。';
            setStatusMsg({ type: 'error', text: errorDetail });
            setIsSubmitting(false);
        }
    };

    // --- 成功後的「請去收信」介面 ---
    if (isRegistered) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 md:p-10 app-card rounded-[2.5rem] shadow-2xl border app-border text-center animate-in fade-in zoom-in duration-300">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center text-4xl shadow-lg shadow-blue-500/10">
                        ✉️
                    </div>
                </div>
                <h2 className="text-3xl font-black mb-4 text-blue-600 dark:text-blue-400">請驗證您的信箱</h2>
                <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                    我們已發送驗證信至 <span className="font-bold text-[var(--text-primary)]">{email}</span>。<br />
                    請點擊信中的連結以啟用您的帳號。
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/20"
                >
                    前往登入頁
                </button>
                <p className="mt-6 text-sm text-[var(--text-secondary)]">
                    沒收到信？ <button onClick={() => setIsRegistered(false)} className="text-blue-500 font-bold hover:underline">重新嘗試</button>
                </p>
            </div>
        );
    }

    // --- 原始註冊表單 ---
    return (
        <div className="max-w-md mx-auto mt-20 p-8 md:p-10 app-card rounded-[2.5rem] shadow-2xl border app-border">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-black tracking-tight mb-3 text-blue-600 dark:text-blue-400">建立帳號</h2>
                <p className="text-sm font-medium text-[var(--text-secondary)] opacity-80">加入 KAI.STUDIO 開始記錄你的筆記</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {statusMsg.text && (
                    <div className={`p-4 rounded-xl text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/20`}>
                        {statusMsg.text}
                    </div>
                )}

                <div className="space-y-2">
                    <label className={labelStyles}>電子信箱</label>
                    <input
                        type="email"
                        className={inputStyles}
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className={labelStyles}>設定密碼</label>
                    <input
                        type="password"
                        className={inputStyles}
                        placeholder="至少 8 位字元"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {/* Password Validation Feedback */}
                    <ul className="text-sm text-[var(--text-secondary)] space-y-1 mt-2">
                        <li className={`flex items-center ${passwordValidation.minLength ? 'text-green-500' : 'text-red-500'}`}>
                            {passwordValidation.minLength ? '✅' : '❌'} 至少 8 個字元
                        </li>
                        <li className={`flex items-center ${passwordValidation.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                            {passwordValidation.lowercase ? '✅' : '❌'} 包含一個小寫字母
                        </li>
                        <li className={`flex items-center ${passwordValidation.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                            {passwordValidation.uppercase ? '✅' : '❌'} 包含一個大寫字母
                        </li>
                        <li className={`flex items-center ${passwordValidation.digit ? 'text-green-500' : 'text-red-500'}`}>
                            {passwordValidation.digit ? '✅' : '❌'} 包含一個數字
                        </li>
                        <li className={`flex items-center ${passwordValidation.specialChar ? 'text-green-500' : 'text-red-500'}`}>
                            {passwordValidation.specialChar ? '✅' : '❌'} 包含一個特殊字元 (@$!%*?&#)
                        </li>
                    </ul>
                </div>

                {/* Cloudflare Turnstile Widget */}
                <div className="mt-6">
                    <Turnstile sitekey="YOUR_TURNSTILE_SITE_KEY" onVerify={setTurnstileToken} />
                </div>

                <button
                    disabled={isSubmitting || !turnstileToken}
                    className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {isSubmitting ? '處理中...' : '立即註冊'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                    已經有帳號了？
                    <button onClick={() => navigate('/login')} className="ml-2 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        返回登入
                    </button>
                </p>
            </div>
        </div>
    );
}