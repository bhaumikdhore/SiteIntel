import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs work both on a repository Pages site and on a
  // custom-domain/root Pages site, regardless of the repository name.
  base: './'
})