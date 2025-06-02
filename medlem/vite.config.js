import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // Allows access from network
//     port: 5173,
//     allowedHosts: ['client', 'frontend'] // 👈 Add this line
//   }
// })
// 
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // listen on all interfaces
//     port: 5173,
//     allowedHosts: 'all', // allow all hosts
//   },
// })

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: 'all',
    hmr: {
      host: '127.0.0.1', // or 'localhost'
      port: 5173,
    },
  },
})
