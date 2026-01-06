import { create } from 'zustand';

const useAuthStore = create((set) => ({
    isLoggedIn: !!localStorage.getItem('token'),
    user: (() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            return null;
        }
    })(),

    login: (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        set({ isLoggedIn: true, user: userData });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ isLoggedIn: false, user: null });
    }
}));

// --- 關鍵：處理跨分頁同步 ---
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        // 當 token 被改變時（登入或登出）
        if (event.key === 'token') {
            const newToken = event.newValue;

            if (!newToken) {
                // 如果是登出（Token 被刪除）
                useAuthStore.getState().logout();
            } else {
                // 如果是登入（Token 出現）
                // 為了安全與確保資料同步，最穩健的做法是重新整理頁面
                window.location.reload();
            }
        }
    });
}

export default useAuthStore;