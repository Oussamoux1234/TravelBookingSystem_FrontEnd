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
    // No proxy needed since we're using VITE_API_BASE_URL with CORS
    // The API client makes direct requests to http://localhost:8080
  },
  envPrefix: 'VITE_',
})
