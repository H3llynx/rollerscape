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
    environment: 'node'
  },
  server: {
    host: true,
    allowedHosts: ["5ae4-2a0c-5a85-510f-b000-4038-f223-5d4a-a820.ngrok-free.app"]
  }
})