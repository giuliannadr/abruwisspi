import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5192 },
  build: {
    rolldownOptions: {
      output: {
        // librerías en archivos aparte: se bajan en paralelo y quedan en caché entre deploys
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\/](react|react-dom|scheduler)[\/]/ },
            { name: 'motion', test: /node_modules[\/](motion|framer-motion|motion-dom|motion-utils)[\/]/ },
            { name: 'gsap', test: /node_modules[\/](gsap|lenis)[\/]/ },
          ],
        },
      },
    },
  },
})
