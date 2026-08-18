import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite acesso externo
    port: 3000,
    strictPort: true,  // Mantém a porta fixa
    cors: true,
  },
});