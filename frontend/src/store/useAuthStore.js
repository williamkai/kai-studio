// src/store/useAuthStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null, // 預設沒人登入
    isLoggedIn: false,

    // 模擬登入功能
    login: (userData) => set({
        user: userData,
        isLoggedIn: true
    }),

    // 登出功能
    logout: () => set({
        user: null,
        isLoggedIn: false
    }),
}));

export default useAuthStore;