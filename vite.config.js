import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

// Pega a versão do package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

// Pega o hash curto do último commit git (fallback se não tiver git)
let gitHash = 'dev'
let commitCount = 0
try {
  gitHash = execSync('git rev-parse --short HEAD').toString().trim()
  commitCount = parseInt(execSync('git rev-list --count HEAD').toString().trim(), 10)
} catch (e) {}

const BASE_DEPLOY_OFFSET = 9 // deploys feitos antes do git init
const appVersion = `v0.1.${commitCount + BASE_DEPLOY_OFFSET}`

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
