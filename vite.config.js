import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// const localUrl = 'http://127.0.0.1:9000'
const localUrl = 'http://navioncorp.asuscomm.com:49000'
// const devServerUrl = 'http://192.168.0.58:9000'
// const devLocalUrl = 'http://192.168.3.92:9000'
// const mockServerUrl = 'https://f0e9c754-bcb8-4adf-8c95-e9c3197d9ec0.mock.pstmn.io'


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
      },
      '/influx': {
        target: localUrl,
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/ship': {
        target: localUrl,
        changeOrigin: true,
        secure: false,
        ws: true
      },
      // '^/mock': {
      //   target: mockServerUrl,
      //   changeOrigin: true,
      //   secure: false
      // }
    }
  },
})
