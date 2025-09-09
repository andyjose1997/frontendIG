import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',   // 🔹 sempre raiz
  plugins: [react()],
})
