
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This ensures assets are loaded relatively (./) instead of absolutely (/)
  // which fixes "blank page" errors on many hosting providers like GitHub Pages or sub-paths.
  base: './',
  build: {
    outDir: 'dist',
  }
})
