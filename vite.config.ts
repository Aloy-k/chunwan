
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/final1/',
  server: {
    port: 5173,
    open: true // 运行 npm run dev 时自动打开浏览器
  }
})
