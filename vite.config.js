import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin SPA fallback : redirige toutes les routes inconnues vers index.html
// Nécessaire pour que /maison, /caps/emerald-crown, etc. fonctionnent en accès direct
function spaFallback() {
  const rewrite = (req, _res, next) => {
    const url = req.url || ''
    const isFile = url.includes('.')
    const isViteInternal =
      url.startsWith('/@') ||
      url.startsWith('/src') ||
      url.startsWith('/node_modules') ||
      url.startsWith('/__')

    if (!isFile && !isViteInternal && url !== '/') {
      req.url = '/'
    }
    next()
  }

  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}

export default defineConfig({
  plugins: [react(), spaFallback()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
