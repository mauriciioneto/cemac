import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

// Pega a versão do package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

// Pega o hash curto do último commit git (fallback se não tiver git)
let gitHash = 'dev'
try {
  gitHash = execSync('git rev-parse --short HEAD').toString().trim()
} catch (e) {}

const appVersion = `v${pkg.version} (${gitHash})`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
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
