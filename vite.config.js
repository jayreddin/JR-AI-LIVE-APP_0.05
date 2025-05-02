import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      eventemitter3: '/node_modules/eventemitter3/index.js'
    }
  }
})