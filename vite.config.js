import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/CS_insen_17/', // 👈 これを追加することで、GitHub Pagesの階層に対応させます
})
