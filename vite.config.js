import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// const localUrl = 'http://127.0.0.1:9000'
const localUrl = 'http://navioncorp.asuscomm.com:49000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      modules: fileURLToPath(new URL('./node_modules', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: localUrl,
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
})
