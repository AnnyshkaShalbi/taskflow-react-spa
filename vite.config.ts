import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isDemoMode = mode === 'development' || env.VITE_DEMO_MODE === 'true'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      // Константа времени сборки: в код подставляется литерал true/false, поэтому
      // без демо-режима сборщик вырезает моки и демо-аккаунты из бандла целиком
      __DEMO_MODE__: JSON.stringify(isDemoMode),
    },
  }
})
