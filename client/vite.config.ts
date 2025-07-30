import path from 'path';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/MagazinesWebsite/',
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@' : path.resolve(__dirname, './src'), // Allows using "@" as an alias for "src"
    },
  },
  build: {
    // Ignore TypeScript errors during build
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore TypeScript warnings
        if (warning.code === 'TS2307' || warning.code === 'TS2339' || warning.code === 'TS2345') {
          return;
        }
        warn(warning);
      }
    }
  },
  esbuild: {
    // Ignore TypeScript errors in esbuild
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
