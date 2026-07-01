
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/tools',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('recharts') || id.includes('d3-') || id.includes('d3/') || id.includes('victory-')) return 'vendor-charts';
          if (id.includes('@radix-ui')) return 'vendor-radix';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('three')) return 'vendor-three';
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler')) return 'vendor-react';
          if (id.includes('@tanstack') || id.includes('react-hook-form') || id.includes('zod')) return 'vendor-forms';
        },
      },
    },
  },
});
