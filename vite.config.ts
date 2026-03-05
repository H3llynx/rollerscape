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
    allowedHosts: ["2768-2a0c-5a85-510f-b000-9e0-65fe-982a-38fa.ngrok-free.app"]
  }
})