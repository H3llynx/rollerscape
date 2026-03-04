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
    allowedHosts: ["1d0b-2a0c-5a85-510f-b000-c517-656d-c6dd-25d9.ngrok-free.app"]
  }
})