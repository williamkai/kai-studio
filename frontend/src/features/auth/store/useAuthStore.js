import { create } from 'zustand';

const useAuthStore = create((set) => ({
    // 初始化時直接從 localStorage 讀取，這保證了開新分頁或重新整理時狀態還在
    isLoggedIn: !!localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,

    login: (userData, token) => {
        // 存入記憶體
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // 更新大腦狀態
        set({ isLoggedIn: true, user: userData });
    },

    logout: () => {
        // 清除記憶體
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // 重置大腦狀態
        set({ isLoggedIn: false, user: null });
    }
}));

export default useAuthStore;