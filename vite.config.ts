import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    build: {lib: {entry: 'lib/main.ts', name: 'ntfy-chat-react', fileName: 'ntfy-chat-react', formats: ['es']}, rollupOptions:{
      external: ['react', 'react/jsx-runtime', 'styled-components'],
      output: {
          entryFileNames: "main.js",
      }
    }},
  plugins: [react(), dts({tsconfigPath: './tsconfig.app.json', include: ['lib']})],
})
