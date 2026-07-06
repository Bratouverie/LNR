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
    'import.meta.env.VITE_BASE44_APP_BASE_URL': 'window.location.origin',
  }
});