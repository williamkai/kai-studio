// frontend/vite.config.js
import tailwindcss from '@tailwindcss/vite'; // 1. 引入 Tailwind v4 插件
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. 啟用 Tailwind 插件
  ],
  server: {
    proxy: {
      // 3. 設定代理，讓前端 /api 請求轉發到後端 FastAPI
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  }
})