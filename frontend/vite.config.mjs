import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// Export the configuration using ESM syntax
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for the src directory
    },
  },
  server: {
    port: 3000, // Optional: Set your dev server port
  },
});
