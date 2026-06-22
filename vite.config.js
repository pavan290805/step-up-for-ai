import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'react-step-up-for-ai',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173
  }
});
