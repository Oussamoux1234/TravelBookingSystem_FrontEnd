import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 9002,
    proxy: {
      // Proxy API requests to Spring Cloud Gateway
      '/hotels': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/vols': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/reservations': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  envPrefix: 'VITE_',
})
