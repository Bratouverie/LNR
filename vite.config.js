import base44 from '@base44/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    copyPublicDir: true,
  },
  logLevel: 'error',
  plugins: [
    base44({
      legacySDKImports: false,
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ],
  define: {
    'import.meta.env.VITE_BASE44_APP_ID': JSON.stringify('69f4a665db2c72a42818d397'),
    // [CLAUDE FIX 2026-07-06] Динамический домен — адаптируется под любой хост
    // Было: https://my-to-do-list-81bfaad7.base44.app (хардкод чужого приложения)
    // Стало: window.location.origin — автоматически использует текущий домен
    // Работает на: vosstanovim-dnr.ru, crm-vosstanovim-dnr.base44.app, localhost:5173
    'import.meta.env.VITE_BASE44_APP_BASE_URL': 'window.location.origin',
  }
});