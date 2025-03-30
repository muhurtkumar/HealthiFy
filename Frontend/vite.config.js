import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to all network interfaces
    port: 3000, // Optional: specify a port
    proxy: {
      '/healthify': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        credentials: 'include',
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
