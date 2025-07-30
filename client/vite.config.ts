import path from 'path';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@' : path.resolve(__dirname, './src'), // Allows using "@" as an alias for "src"
    },
  },
  build: {
    // Ensure assets are built correctly
    assetsDir: 'assets',
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore TypeScript warnings
        if (warning.code === 'TS2307' || warning.code === 'TS2339' || warning.code === 'TS2345') {
          return;
        }
        warn(warning);
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  esbuild: {
    // Ignore TypeScript errors in esbuild
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
