import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
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
    // [CLAUDE FIX 2026-07-06] Используем правильный Base44 домен приложения
    // Было: https://my-to-do-list-81bfaad7.base44.app (чужой домен, ошибка)
    // Стало: динамический домен через process.env или основной домен
    'import.meta.env.VITE_BASE44_APP_BASE_URL': JSON.stringify(process.env.VITE_BASE44_APP_BASE_URL || 'https://crm-vosstanovim-dnr.base44.app'),
  }
});
