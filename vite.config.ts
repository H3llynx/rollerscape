import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  base: "/rollerscape/",
  test: {
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    environment: 'jsdom'
  },
  server: {
    host: true,
    allowedHosts: ["8b41-195-235-110-145.ngrok-free.app"]
  }
})