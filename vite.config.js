import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['maplibre-gl']
  },
  server: {
    proxy: {
      '/api-inmet': {
        target: 'https://apitempo.inmet.gov.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-inmet/, '')
      },
      '/api-prevmet': {
        target: 'https://apiprevmet3.inmet.gov.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-prevmet/, '')
      },
      '/api-nowcastsig': {
        target: 'https://nowcastsig.funceme.br',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-nowcastsig/, '')
      }
    }
  }
})
